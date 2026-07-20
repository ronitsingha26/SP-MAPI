const pool = require('../config/db');

class UserRepository {
  // ── Generate Customer Display ID ──────────────────────────────
  async generateCustomerDisplayId() {
    const result = await pool.query(
      `SELECT COUNT(*) AS total FROM customers`
    );
    const count = (result.rows[0]?.total || 0) + 1;
    return `SPMAPI-C-${String(count).padStart(4, '0')}`;
  }

  // ── Create Customer (with all expanded fields) ────────────────
  async createCustomer(customerData) {
    const {
      id, name, father_name, mobile, email, password_hash,
      state, district, block, village, ward_number, panchayat,
      mouja, police_station, pincode, address, aadhaar_number
    } = customerData;

    const customer_id_display = await this.generateCustomerDisplayId();

    await pool.query(
      `INSERT INTO customers
         (id, customer_id_display, name, father_name, mobile, email, password_hash,
          state, district, block, village, ward_number, panchayat,
          mouja, police_station, pincode, address, aadhaar_number)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id, customer_id_display, name, father_name || null, mobile, email || null, password_hash,
        state || 'Bihar', district || null, block || null, village || null,
        ward_number || null, panchayat || null, mouja || null,
        police_station || null, pincode || null, address || null, aadhaar_number || null
      ]
    );

    const result = await pool.query(
      `SELECT id, customer_id_display, name, father_name, mobile, email,
              state, district, block, village, ward_number, panchayat,
              mouja, police_station, pincode, address,
              status, profile_photo_url, created_at
       FROM customers WHERE id = ?`,
      [id]
    );
    return result.rows[0];
  }

  // ── Get Full Customer Profile ─────────────────────────────────
  async getFullCustomerProfile(id) {
    const result = await pool.query(
      `SELECT id, customer_id_display, name, father_name, mobile, email, aadhaar_number,
              state, district, block, village, ward_number, panchayat,
              mouja, police_station, pincode, address,
              status, profile_photo_url, is_email_verified, is_mobile_verified,
              created_at, updated_at
       FROM customers WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0];
  }

  // ── Update Customer Profile ───────────────────────────────────
  async updateCustomerProfile(id, data) {
    const fields = [];
    const values = [];
    const allowed = [
      'name', 'father_name', 'email', 'state', 'district', 'block',
      'village', 'ward_number', 'panchayat', 'mouja', 'police_station',
      'pincode', 'address', 'profile_photo_url'
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
    if (fields.length === 0) return null;
    values.push(id);
    await pool.query(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return await this.getFullCustomerProfile(id);
  }

  // ── Find Customer ─────────────────────────────────────────────
  async findCustomerByMobileOrEmail(mobile, email) {
    let query, params;
    if (mobile) {
      query = 'SELECT * FROM customers WHERE mobile = ? AND deleted_at IS NULL';
      params = [mobile];
    } else {
      query = 'SELECT * FROM customers WHERE email = ? AND deleted_at IS NULL';
      params = [email];
    }
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  // ── Admin / Super Admin / Amin lookups ────────────────────────
  async findSuperAdminByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM super_admins WHERE email = ? AND deleted_at IS NULL AND is_active = TRUE',
      [email]
    );
    return result.rows[0];
  }

  async findAdminByEmail(email) {
    const result = await pool.query(
      `SELECT a.*, JSON_ARRAYAGG(d.name) AS districts
       FROM admins a
       LEFT JOIN admin_districts ad ON a.id = ad.admin_id
       LEFT JOIN districts d ON ad.district_id = d.id
       WHERE a.email = ? AND a.deleted_at IS NULL AND a.status = 'active'
       GROUP BY a.id`,
      [email]
    );
    return result.rows[0];
  }

  async findAminByEmail(email) {
    const result = await pool.query(
      `SELECT a.*, d.name AS district_name_full
       FROM amins a
       LEFT JOIN districts d ON a.district_id = d.id
       WHERE a.email = ? AND a.deleted_at IS NULL AND a.status = 'active'`,
      [email]
    );
    return result.rows[0];
  }

  async updateLastLogin(table, id) {
    await pool.query(`UPDATE ${table} SET last_login_at = NOW() WHERE id = ?`, [id]);
  }

  async updateCustomerLastLogin(id) {
    await pool.query('UPDATE customers SET updated_at = NOW() WHERE id = ?', [id]);
  }
}

module.exports = new UserRepository();
