const Razorpay = require('razorpay');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// Mock Razorpay config if keys are not present (so it doesn't crash on boot)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

exports.createOrder = async (req, res, next) => {
  try {
    const { application_id, amount, payment_type = 'application_fee' } = req.body;
    const customer_id = req.user.id;

    if (!application_id || !amount) {
      return res.status(400).json({ success: false, message: 'Application ID and amount are required' });
    }

    // Verify application belongs to customer and is unpaid
    const { rows: apps } = await db.query(
      `SELECT * FROM applications WHERE id = ? AND customer_id = ?`,
      [application_id, customer_id]
    );

    if (apps.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const app = apps[0];
    if (app.payment_status === 'paid') {
      return res.status(400).json({ success: false, message: 'Application is already paid' });
    }

    // Create Razorpay Order
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${uuidv4().split('-')[0]}`
    };

    let order;
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_dummy' && process.env.RAZORPAY_KEY_ID !== 'false') {
      order = await razorpay.orders.create(options);
    } else {
      // Mock order creation if no real key is provided
      order = {
        id: `order_mock_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
        amount: options.amount,
        currency: 'INR',
        receipt: options.receipt
      };
    }

    // Generate unique payment ref
    const paymentRef = `PAY-${uuidv4().substring(0, 8).toUpperCase()}`;
    const paymentId = uuidv4();

    // Insert into payments table
    await db.query(
      `INSERT INTO payments 
       (id, payment_ref, customer_id, application_id, razorpay_order_id, amount, currency, payment_type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [paymentId, paymentRef, customer_id, application_id, order.id, amount, 'INR', payment_type, 'created']
    );

    res.json({
      success: true,
      order,
      payment_ref: paymentRef,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy'
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({ success: false, message: 'Could not create payment order' });
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, application_id } = req.body;
    const customer_id = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification details missing' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
    
    let isValid = false;

    // If using mock order, simulate verification success
    if (razorpay_order_id.startsWith('order_mock_')) {
      isValid = true;
    } else {
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest('hex');
      isValid = digest === razorpay_signature;
    }

    if (!isValid) {
      // Update payment status to failed
      await db.query(`UPDATE payments SET status = 'failed' WHERE razorpay_order_id = ?`, [razorpay_order_id]);
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update payment record
    await db.query(
      `UPDATE payments 
       SET status = 'success', razorpay_payment_id = ?, razorpay_signature = ?, paid_at = NOW() 
       WHERE razorpay_order_id = ? AND customer_id = ?`,
      [razorpay_payment_id, razorpay_signature, razorpay_order_id, customer_id]
    );

    // Update application payment status
    if (application_id) {
      await db.query(
        `UPDATE applications SET payment_status = 'paid' WHERE id = ? AND customer_id = ?`,
        [application_id, customer_id]
      );
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};
