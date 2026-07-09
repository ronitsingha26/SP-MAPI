const pool = require('../config/db');

class InvoiceRepository {
  async createInvoice(id, invoiceNumber, applicationId, paymentId, customerId, subtotal, taxAmount, totalAmount, status, client = pool) {
    await client.query(
      `INSERT INTO invoices (id, invoice_number, application_id, payment_id, customer_id, subtotal, tax_amount, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, invoiceNumber, applicationId, paymentId, customerId, subtotal, taxAmount, totalAmount, status]
    );
    return this.getInvoiceById(id, client);
  }

  async getInvoiceById(id, client = pool) {
    const res = await client.query(`
      SELECT i.*, 
             c.name as customer_name, c.email as customer_email, c.mobile as customer_phone,
             a.service_type as application_type, a.status as application_status
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      JOIN applications a ON i.application_id = a.id
      WHERE i.id = ?
    `, [id]);
    return res.rows[0];
  }

  async getInvoiceByPaymentId(paymentId) {
    const res = await pool.query('SELECT * FROM invoices WHERE payment_id = ?', [paymentId]);
    return res.rows[0];
  }

  async getInvoicesByCustomer(customerId) {
    const res = await pool.query(`
      SELECT i.*, a.service_type as application_type 
      FROM invoices i 
      JOIN applications a ON i.application_id = a.id
      WHERE i.customer_id = ? 
      ORDER BY i.issued_at DESC
    `, [customerId]);
    return res.rows;
  }

  async getAllInvoices(adminDistricts = null) {
    let sql = `
      SELECT i.*, 
             c.name as customer_name, c.mobile as customer_phone,
             a.service_type as application_type, a.district
      FROM invoices i 
      JOIN customers c ON i.customer_id = c.id
      JOIN applications a ON i.application_id = a.id
    `;
    let params = [];
    if (adminDistricts && adminDistricts.length > 0 && adminDistricts[0] !== '__NONE__') {
      sql += ` WHERE a.district IN (?)`;
      params.push(adminDistricts);
    }
    sql += ` ORDER BY i.issued_at DESC`;
    const res = await pool.query(sql, params);
    return res.rows;
  }

  async markInvoiceAsPaid(id, paymentId) {
    await pool.query(
      `UPDATE invoices SET status = 'paid', paid_at = CURRENT_TIMESTAMP, payment_id = ? WHERE id = ?`,
      [paymentId, id]
    );
    return this.getInvoiceById(id);
  }
}

module.exports = new InvoiceRepository();
