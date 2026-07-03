const miscService = require('../services/miscService');
const { AppError } = require('../middleware/errorHandler');

exports.submitEnquiry = async (req, res, next) => {
  try {
    const { name, mobile, message } = req.body;
    if (!name || !mobile || !message) {
      return next(new AppError('Name, mobile, and message are required.', 400));
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return next(new AppError('Enter a valid 10-digit mobile number.', 400));
    }

    const enquiry = await miscService.submitEnquiry(req.body, req.ip);

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been submitted. We will contact you within 24 hours.',
      enquiry_id: enquiry.id
    });
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await miscService.getProfile(req.user.id);
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await miscService.updateProfile(req.user.id, req.body);
    res.json({ success: true, message: 'Profile updated.', profile });
  } catch (err) { next(err); }
};

exports.getPayments = async (req, res, next) => {
  try {
    const payments = await miscService.getPayments(req.user.id);
    res.json({ success: true, payments });
  } catch (err) { next(err); }
};

exports.getDistricts = async (req, res, next) => {
  try {
    const districts = await miscService.getDistricts();
    res.json({ success: true, districts });
  } catch (err) { next(err); }
};

exports.getPublicTools = async (req, res, next) => {
  try {
    const pool = require('../config/db');
    const [rows] = await pool.query('SELECT id, name, description, rental_price FROM tools_inventory WHERE is_active = true ORDER BY name ASC');
    res.json({ success: true, tools: rows });
  } catch (err) { next(err); }
};
