const pool = require('../config/db');

class AdminRepository {
  async getAdminDistricts(adminId) {
    const saResult = await pool.query('SELECT id FROM super_admins WHERE id = ?', [adminId]);
    if (saResult.rows.length > 0) {
      const allDistResult = await pool.query('SELECT name FROM districts WHERE is_active = 1');
      return allDistResult.rows.map(r => r.name);
    }

    const distResult = await pool.query(
      `SELECT d.name FROM admin_districts ad
       JOIN districts d ON ad.district_id = d.id
       WHERE ad.admin_id = ?`,
      [adminId]
    );
    const districts = distResult.rows.map(r => r.name);
    return districts.length > 0 ? districts : ['__NONE__'];
  }

  async getDashboardStats(districts) {
    const statsResult = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM customers WHERE district IN (?) AND deleted_at IS NULL) AS total_customers,
         (SELECT COUNT(*) FROM amins WHERE district_name IN (?) AND deleted_at IS NULL AND status='active') AS active_amins,
         (SELECT COUNT(*) FROM applications WHERE district IN (?) AND status IN ('submitted','pending') AND deleted_at IS NULL) AS pending_services,
         (SELECT COALESCE(SUM(amount),0) FROM payments p JOIN applications a ON p.application_id=a.id WHERE a.district IN (?) AND p.status='success') AS district_revenue`,
      [districts, districts, districts, districts]
    );
    return statsResult.rows[0];
  }

  async getMonthlyApplications(districts) {
    const monthlyResult = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%b') AS month, COUNT(*) AS count
       FROM applications
       WHERE district IN (?) AND deleted_at IS NULL
         AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%b'), DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY DATE_FORMAT(created_at, '%Y-%m')`,
      [districts]
    );
    return monthlyResult.rows;
  }

  async getApplications(districts, conditions, params) {
    const result = await pool.query(
      `SELECT a.id, a.app_id, a.service_type, a.applicant_name, a.applicant_mobile,
              a.district, a.block_id, a.status, a.payment_status, a.created_at, a.applicant_email,
              a.updated_at, am.name AS amin_name
       FROM applications a
       LEFT JOIN amins am ON a.assigned_amin_id = am.id
       WHERE ${conditions.join(' AND ')}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );
    return result.rows;
  }

  async getApplicationsAll(conditions, params) {
    const result = await pool.query(
      `SELECT a.id, a.app_id, a.service_type, a.applicant_name, a.applicant_mobile,
              a.district, a.block_id, a.status, a.payment_status, a.created_at, a.applicant_email,
              a.updated_at, am.name AS amin_name
       FROM applications a
       LEFT JOIN amins am ON a.assigned_amin_id = am.id
       WHERE ${conditions.join(' AND ')}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );
    return result.rows;
  }

  async getGlobalDashboardStats() {
    const statsResult = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM customers WHERE deleted_at IS NULL) AS total_customers,
         (SELECT COUNT(*) FROM amins WHERE deleted_at IS NULL AND status='active') AS active_amins,
         (SELECT COUNT(*) FROM applications WHERE status IN ('submitted','pending') AND deleted_at IS NULL) AS pending_services,
         (SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='success') AS district_revenue`
    );
    return statsResult.rows[0];
  }

  async getGlobalMonthlyApplications() {
    const monthlyResult = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%b') AS month, COUNT(*) AS count
       FROM applications
       WHERE deleted_at IS NULL
         AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%b'), DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY DATE_FORMAT(created_at, '%Y-%m')`
    );
    return monthlyResult.rows;
  }

  async getApplicationsCount(conditions, params) {
    const countResult = await pool.query(
      `SELECT COUNT(*) as count FROM applications a WHERE ${conditions.join(' AND ')}`,
      params
    );
    return parseInt(countResult.rows[0].count);
  }

  async getApplicationById(id) {
    const appResult = await pool.query(
      'SELECT * FROM applications WHERE id=? AND deleted_at IS NULL',
      [id]
    );
    return appResult.rows[0];
  }

  async updateApplicationStatus(id, status, remark, history, adminId) {
    await pool.query(
      `UPDATE applications SET status=?, admin_remark=?, status_history=?, processed_by=?
       WHERE id=?`,
      [status, remark || null, JSON.stringify(history), adminId, id]
    );
  }

  async logAudit(actorId, actorName, action, entityId, oldValue, newValue, ipAddress) {
    await pool.query(
      `INSERT INTO audit_logs (actor_id,actor_type,actor_name,action,entity_type,entity_id,old_value,new_value,ip_address)
       VALUES (?,'admin',?,'${action}','application',?,?,?,?)`,
      [actorId, actorName, entityId, oldValue, newValue, ipAddress]
    );
  }

  async getAminById(id) {
    const aminResult = await pool.query('SELECT * FROM amins WHERE id=? AND status=\'active\'', [id]);
    return aminResult.rows[0];
  }

  async assignAmin(applicationId, aminId) {
    await pool.query(
      `UPDATE applications SET assigned_amin_id=?, amin_assigned_at=NOW(), status='assigned'
       WHERE id=?`,
      [aminId, applicationId]
    );
    await pool.query('UPDATE amins SET active_tasks=active_tasks+1 WHERE id=?', [aminId]);
  }

  async getDocumentsForApplications(appIds) {
    if (!appIds || appIds.length === 0) return [];
    const result = await pool.query(
      `SELECT * FROM documents WHERE application_id IN (?)`,
      [appIds]
    );
    return result.rows;
  }

  async getCustomers(conditions, params) {
    const result = await pool.query(
      `SELECT id, name, mobile, email, district, status, is_mobile_verified, created_at,
              (SELECT COUNT(*) FROM applications WHERE customer_id=customers.id AND deleted_at IS NULL) AS total_applications
       FROM customers WHERE ${conditions.join(' AND ')}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      params
    );
    return result.rows;
  }

  async getAmins(districts) {
    const result = await pool.query(
      `SELECT a.id, a.name, a.mobile, a.email, a.district_name, a.license_number, a.status,
              a.tasks_completed, a.active_tasks, a.rating, a.created_at,
              (SELECT GROUP_CONCAT(block_id) FROM amin_territories t WHERE t.amin_id = a.id) as operating_block_ids
       FROM amins a WHERE a.district_name IN (?) AND a.deleted_at IS NULL
       ORDER BY a.name`,
      [districts]
    );
    return result.rows;
  }

  async createAmin(id, name, mobile, email, password_hash, district_id, district, license_number, created_by) {
    await pool.query(
      `INSERT INTO amins (id, name, mobile, email, password_hash, district_id, district_name, license_number, created_by)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [id, name, mobile, email || null, password_hash, district_id, district || null, license_number || null, created_by]
    );
    const aminResult = await pool.query(
      'SELECT id,name,mobile,email,district_name,license_number,status,created_at FROM amins WHERE id=?',
      [id]
    );
    return aminResult.rows[0];
  }

  async updateAmin(id, name, mobile, email, district_id, district, license_number, status) {
    await pool.query(
      `UPDATE amins SET name=COALESCE(?,name), mobile=COALESCE(?,mobile), email=COALESCE(?,email),
         district_id=COALESCE(?,district_id), district_name=COALESCE(?,district_name),
         license_number=COALESCE(?,license_number), status=COALESCE(?,status)
       WHERE id=? AND deleted_at IS NULL`,
      [name, mobile, email, district_id, district, license_number, status, id]
    );
  }

  async deleteAmin(id) {
    await pool.query('UPDATE amins SET deleted_at=NOW(), status=\'inactive\' WHERE id=?', [id]);
  }

  async getPayments(districts) {
    const result = await pool.query(
      `SELECT p.*, c.name AS customer_name, a.app_id, a.service_type
       FROM payments p
       JOIN applications a ON p.application_id = a.id
       LEFT JOIN customers c ON p.customer_id = c.id
       WHERE a.district IN (?)
       ORDER BY p.created_at DESC`,
      [districts]
    );
    return result.rows;
  }

  async getEnquiries() {
    const result = await pool.query(
      'SELECT * FROM contact_enquiries ORDER BY created_at DESC LIMIT 100'
    );
    return result.rows;
  }
}

module.exports = new AdminRepository();
