const pool = require('../config/db');

class BookingRepository {
  async getAll(conditions = [], params = []) {
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pool.query(
      `SELECT b.*, p.title as property_title, p.price as property_price, p.district as property_district,
              c.name as customer_name, c.mobile as customer_mobile
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN customers c ON b.customer_id = c.id
       ${where} ORDER BY b.created_at DESC`,
      params
    );
    return res.rows;
  }

  async getById(id) {
    const res = await pool.query(
      `SELECT b.*, p.title as property_title, p.price as property_price
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE b.id = ?`, 
      [id]
    );
    return res.rows[0];
  }

  async create(bookingData) {
    const { id, customer_id, property_id, amount } = bookingData;
    await pool.query(
      `INSERT INTO bookings (id, customer_id, property_id, amount) VALUES (?, ?, ?, ?)`,
      [id, customer_id, property_id, amount]
    );
  }

  async updateStatus(id, status) {
    await pool.query(`UPDATE bookings SET status = ? WHERE id = ?`, [status, id]);
  }
}

module.exports = new BookingRepository();
