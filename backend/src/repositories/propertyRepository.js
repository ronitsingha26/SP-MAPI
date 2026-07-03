const pool = require('../config/db');

class PropertyRepository {
  async getAll(conditions = [], params = []) {
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pool.query(
      `SELECT * FROM properties ${where} ORDER BY created_at DESC`,
      params
    );
    return res.rows;
  }

  async getById(id) {
    const res = await pool.query('SELECT * FROM properties WHERE id = ?', [id]);
    return res.rows[0];
  }

  async create(propertyData) {
    const { id, title, district, block_name, area_sqft, price, plot_type, status, images, admin_id } = propertyData;
    await pool.query(
      `INSERT INTO properties 
       (id, title, district, block_name, area_sqft, price, plot_type, status, images, admin_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, district, block_name, area_sqft, price, plot_type, status, JSON.stringify(images), admin_id]
    );
  }

  async update(id, propertyData) {
    const { title, district, block_name, area_sqft, price, plot_type, status, images } = propertyData;
    await pool.query(
      `UPDATE properties 
       SET title=?, district=?, block_name=?, area_sqft=?, price=?, plot_type=?, status=?, images=?
       WHERE id=?`,
      [title, district, block_name, area_sqft, price, plot_type, status, JSON.stringify(images), id]
    );
  }

  async delete(id) {
    await pool.query('DELETE FROM properties WHERE id = ?', [id]);
  }
}

module.exports = new PropertyRepository();
