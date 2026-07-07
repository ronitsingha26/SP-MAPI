const pool = require('../config/db');

class SuperAdminRepository {
  async getDashboardStats() {
    const statsResult = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM customers WHERE deleted_at IS NULL) AS total_users,
        (SELECT COUNT(*) FROM amins WHERE deleted_at IS NULL AND status='active') AS active_amins,
        (SELECT COUNT(*) FROM applications WHERE deleted_at IS NULL AND status IN ('submitted','pending','verification')) AS pending_services,
        (SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='success') AS total_revenue,
        (SELECT COUNT(*) FROM admins WHERE deleted_at IS NULL AND status='active') AS total_admins,
        (SELECT COUNT(*) FROM applications WHERE deleted_at IS NULL) AS total_applications
    `);
    
    const monthlyRevenue = await pool.query(`
      SELECT DATE_FORMAT(paid_at, '%b') AS month, COALESCE(SUM(amount),0) AS revenue
      FROM payments
      WHERE status='success' AND paid_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(paid_at, '%b'), DATE_FORMAT(paid_at, '%Y-%m')
      ORDER BY DATE_FORMAT(paid_at, '%Y-%m')
    `);
    
    const serviceByType = await pool.query(`
      SELECT service_type AS name, COUNT(*) AS value
      FROM applications WHERE deleted_at IS NULL
      GROUP BY service_type
    `);
    
    const bookingByType = await pool.query(`
      SELECT payment_type AS name, COUNT(*) AS value
      FROM payments WHERE status='success'
      GROUP BY payment_type
    `);
    
    return {
      stats: statsResult.rows[0],
      monthly_revenue: monthlyRevenue.rows,
      service_by_type: serviceByType.rows,
      booking_by_type: bookingByType.rows
    };
  }

  async getAdmins() {
    const result = await pool.query(`
      SELECT a.id, a.name, a.email, a.mobile, a.status, a.last_login_at, a.created_at,
             JSON_ARRAYAGG(d.name) AS districts
      FROM admins a
      LEFT JOIN admin_districts ad ON a.id = ad.admin_id
      LEFT JOIN districts d ON ad.district_id = d.id
      WHERE a.deleted_at IS NULL
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `);
    return result.rows;
  }

  async createAdmin(id, name, email, password_hash, mobile, createdBy, client) {
    await client.query(
      `INSERT INTO admins (id, name, email, password_hash, mobile, created_by)
       VALUES (?,?,?,?,?,?)`,
      [id, name, email, password_hash, mobile, createdBy]
    );
    const result = await client.query('SELECT * FROM admins WHERE id=?', [id]);
    return result.rows[0];
  }

  async assignAdminDistrict(adminId, districtName, client) {
    const dResult = await client.query('SELECT id FROM districts WHERE name=?', [districtName]);
    if (dResult.rows[0]) {
      await client.query(
        'INSERT IGNORE INTO admin_districts (admin_id, district_id) VALUES (?,?)',
        [adminId, dResult.rows[0].id]
      );
    }
  }

  async updateAdmin(id, name, mobile, status, client) {
    await client.query(
      `UPDATE admins SET name=COALESCE(?,name), mobile=COALESCE(?,mobile),
         status=COALESCE(?,status), updated_at=NOW() WHERE id=?`,
      [name, mobile, status, id]
    );
  }

  async clearAdminDistricts(id, client) {
    await client.query('DELETE FROM admin_districts WHERE admin_id=?', [id]);
  }

  async deleteAdmin(id) {
    await pool.query(
      'UPDATE admins SET deleted_at=NOW(), status=\'inactive\' WHERE id=?',
      [id]
    );
  }

  async getAllUsers(type, search, limit, offset) {
    let query, params = [];
    if (type === 'amins') {
      query = `SELECT id,name,mobile,email,district_name,license_number,status,tasks_completed,rating,created_at
               FROM amins WHERE deleted_at IS NULL`;
      if (search) { query += ` AND (name LIKE ? OR mobile LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
      query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));
    } else if (type === 'admins') {
      query = `SELECT id,name,mobile,email,status,created_at
               FROM admins WHERE deleted_at IS NULL`;
      if (search) { query += ` AND (name LIKE ? OR mobile LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
      query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));
    } else {
      query = `SELECT id,name,mobile,email,district,status,is_mobile_verified,created_at
               FROM customers WHERE deleted_at IS NULL`;
      if (search) { query += ` AND (name LIKE ? OR mobile LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
      query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));
    }
    const result = await pool.query(query, params);
    return result.rows;
  }

  async getAuditLogs(limit, offset) {
    const result = await pool.query(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [Number(limit), Number(offset)]
    );
    const count = await pool.query('SELECT COUNT(*) as count FROM audit_logs');
    return { logs: result.rows, total: parseInt(count.rows[0].count) };
  }

  async getDistricts() {
    const result = await pool.query('SELECT * FROM districts ORDER BY state, name');
    return result.rows;
  }

  async createDistrict(name, state) {
    await pool.query(
      'INSERT INTO districts (name, state) VALUES (?, ?)',
      [name, state]
    );
  }

  async updateDistrict(id, name, state, is_active) {
    await pool.query(
      `UPDATE districts SET name=COALESCE(?,name), state=COALESCE(?,state),
         is_active=COALESCE(?,is_active), updated_at=NOW() WHERE id=?`,
      [name, state, is_active !== undefined ? is_active : null, id]
    );
  }

  async getPayments(limit, offset) {
    const result = await pool.query(
      `SELECT p.*, c.name AS customer_name, a.service_type
       FROM payments p
       LEFT JOIN customers c ON p.customer_id = c.id
       LEFT JOIN applications a ON p.application_id = a.id
       ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [Number(limit), Number(offset)]
    );
    return result.rows;
  }

  async logAudit(actorId, actorName, action, entityType, entityId, ipAddress, client = pool) {
    await client.query(
      `INSERT INTO audit_logs (actor_id,actor_type,actor_name,action,entity_type,entity_id,ip_address)
       VALUES (?,'superadmin',?,'${action}','${entityType}',?,?)`,
      [actorId, actorName, entityId || null, ipAddress]
    );
  }
}

module.exports = new SuperAdminRepository();
