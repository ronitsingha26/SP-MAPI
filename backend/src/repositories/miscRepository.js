const pool = require('../config/db');

class MiscRepository {
  async createEnquiry(id, name, mobile, email, subject, message, ip) {
    await pool.query(
      `INSERT INTO contact_enquiries (id, name, mobile, email, subject, message, ip_address)
       VALUES (?,?,?,?,?,?,?)`,
      [id, name, mobile, email || null, subject || null, message, ip]
    );
    const result = await pool.query('SELECT id, created_at FROM contact_enquiries WHERE id=?', [id]);
    return result.rows[0];
  }

  async getAllEnquiries() {
    const result = await pool.query(
      `SELECT * FROM contact_enquiries ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async getCustomerProfile(customerId) {
    const result = await pool.query(
      `SELECT id, customer_id_display, name, father_name, mobile, email,
              state, district, block, village, ward_number, panchayat,
              mouja, police_station, pincode, address,
              status, is_email_verified, is_mobile_verified,
              profile_photo_url, primary_app_id, created_at
       FROM customers WHERE id=? AND deleted_at IS NULL`,
      [customerId]
    );
    return result.rows[0];
  }

  async updateCustomerProfile(customerId, data) {
    const allowed = [
      'name', 'father_name', 'email', 'state', 'district', 'block',
      'village', 'ward_number', 'panchayat', 'mouja', 'police_station',
      'pincode', 'address', 'profile_photo_url'
    ];
    const sets = [];
    const vals = [];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        sets.push(`${key} = ?`);
        vals.push(data[key]);
      }
    }
    if (sets.length > 0) {
      vals.push(customerId);
      await pool.query(
        `UPDATE customers SET ${sets.join(', ')}, updated_at=NOW() WHERE id=? AND deleted_at IS NULL`,
        vals
      );
    }
    return await this.getCustomerProfile(customerId);
  }

  async getCustomerPayments(customerId) {
    const result = await pool.query(
      `SELECT p.id, p.payment_ref, p.amount, p.currency, p.payment_method,
              p.payment_type, p.status, p.paid_at, p.receipt_url,
              a.app_id, a.service_type
       FROM payments p
       LEFT JOIN applications a ON p.application_id = a.id
       WHERE p.customer_id = ?
       ORDER BY p.created_at DESC`,
      [customerId]
    );
    return result.rows;
  }

  async getDistricts() {
    const result = await pool.query(
      'SELECT id, name, state FROM districts WHERE is_active=TRUE ORDER BY state, name'
    );
    return result.rows;
  }
}

module.exports = new MiscRepository();
