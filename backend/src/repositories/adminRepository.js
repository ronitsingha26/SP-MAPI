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
         (SELECT COUNT(*) FROM applications WHERE district IN (?) AND status IN ('submitted','pending') AND deleted_at IS NULL) +
         (SELECT COUNT(*) FROM tool_requests tr JOIN customers c ON tr.customer_id = c.id WHERE c.district IN (?) AND tr.status = 'pending') AS pending_services,
         (SELECT COALESCE(SUM(amount),0) FROM payments p JOIN applications a ON p.application_id=a.id WHERE a.district IN (?) AND p.status='success') AS district_revenue`,
      [districts, districts, districts, districts, districts]
    );
    return statsResult.rows[0];
  }

  async getFinancialDashboardStats(districts) {
    const statsResult = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM customers WHERE district IN (?) AND deleted_at IS NULL) AS total_users,
        (SELECT COUNT(*) FROM amins WHERE district_name IN (?) AND deleted_at IS NULL AND status='active') AS active_amins,
        (SELECT COUNT(*) FROM applications WHERE district IN (?) AND status IN ('submitted','pending') AND deleted_at IS NULL) +
        (SELECT COUNT(*) FROM tool_requests tr JOIN customers c ON tr.customer_id = c.id WHERE c.district IN (?) AND tr.status = 'pending') AS pending_services,
        (SELECT COALESCE(SUM(amount),0) FROM payments p JOIN applications a ON p.application_id=a.id WHERE a.district IN (?) AND p.status='success') AS total_revenue,
        0 AS total_admins,
        (SELECT COUNT(*) FROM applications WHERE district IN (?) AND deleted_at IS NULL) +
        (SELECT COUNT(*) FROM tool_requests tr JOIN customers c ON tr.customer_id = c.id WHERE c.district IN (?)) AS total_applications
    `, [districts, districts, districts, districts, districts, districts, districts]);
    
    const monthlyRevenue = await pool.query(`
      SELECT DATE_FORMAT(p.paid_at, '%b') AS month, COALESCE(SUM(p.amount),0) AS revenue
      FROM payments p
      JOIN applications a ON p.application_id=a.id
      WHERE a.district IN (?) AND p.status='success' AND p.paid_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(p.paid_at, '%b'), DATE_FORMAT(p.paid_at, '%Y-%m')
      ORDER BY DATE_FORMAT(p.paid_at, '%Y-%m')
    `, [districts]);
    
    const serviceByType = await pool.query(`
      SELECT service_type AS name, COUNT(*) AS value
      FROM applications WHERE district IN (?) AND deleted_at IS NULL
      GROUP BY service_type
      UNION ALL
      SELECT 'Tool Order' AS name, COUNT(*) AS value
      FROM tool_requests tr JOIN customers c ON tr.customer_id = c.id
      WHERE c.district IN (?)
    `, [districts, districts]);
    
    const bookingByType = await pool.query(`
      SELECT p.payment_type AS name, COUNT(*) AS value
      FROM payments p JOIN applications a ON p.application_id=a.id
      WHERE a.district IN (?) AND p.status='success'
      GROUP BY p.payment_type
    `, [districts]);
    
    return {
      stats: statsResult.rows[0],
      monthly_revenue: monthlyRevenue.rows,
      service_by_type: serviceByType.rows,
      booking_by_type: bookingByType.rows
    };
  }

  async getMonthlyApplications(districts) {
    const monthlyResult = await pool.query(
      `SELECT DATE_FORMAT(a.created_at, '%b') AS month, COUNT(*) AS count
       FROM (
         SELECT created_at, district, deleted_at FROM applications
         UNION ALL
         SELECT tr.created_at, c.district, NULL AS deleted_at 
         FROM tool_requests tr JOIN customers c ON tr.customer_id = c.id
       ) AS a
       WHERE a.district IN (?) AND a.deleted_at IS NULL
         AND a.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(a.created_at, '%b'), DATE_FORMAT(a.created_at, '%Y-%m')
       ORDER BY DATE_FORMAT(a.created_at, '%Y-%m')`,
      [districts]
    );
    return monthlyResult.rows;
  }

  async getApplications(districts, conditions, params) {
    const result = await pool.query(
      `SELECT a.id, a.app_id, a.service_type, a.applicant_name, a.applicant_mobile,
              a.district, a.block_id, a.status, a.payment_status, a.created_at, a.applicant_email,
              a.updated_at, am.name AS amin_name
       FROM (
         SELECT id, app_id, service_type, applicant_name, applicant_mobile, district, block_id, status, payment_status, created_at, applicant_email, updated_at, assigned_amin_id, deleted_at FROM applications
         UNION ALL
         SELECT tr.id, tr.app_id, 'Tool Order' AS service_type, c.name AS applicant_name, c.mobile AS applicant_mobile, c.district, NULL AS block_id, tr.status, NULL AS payment_status, tr.created_at, c.email AS applicant_email, tr.updated_at, tr.processed_by AS assigned_amin_id, NULL AS deleted_at
         FROM tool_requests tr JOIN customers c ON tr.customer_id = c.id
       ) a
       LEFT JOIN amins am ON a.assigned_amin_id = am.id
       WHERE a.deleted_at IS NULL AND ${conditions.join(' AND ')}
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
       FROM (
         SELECT id, app_id, service_type, applicant_name, applicant_mobile, district, block_id, status, payment_status, created_at, applicant_email, updated_at, assigned_amin_id, deleted_at FROM applications
         UNION ALL
         SELECT tr.id, tr.app_id, 'Tool Order' AS service_type, c.name AS applicant_name, c.mobile AS applicant_mobile, c.district, NULL AS block_id, tr.status, NULL AS payment_status, tr.created_at, c.email AS applicant_email, tr.updated_at, tr.processed_by AS assigned_amin_id, NULL AS deleted_at
         FROM tool_requests tr JOIN customers c ON tr.customer_id = c.id
       ) a
       LEFT JOIN amins am ON a.assigned_amin_id = am.id
       WHERE a.deleted_at IS NULL AND ${conditions.join(' AND ')}
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
         (SELECT COUNT(*) FROM applications WHERE status IN ('submitted','pending') AND deleted_at IS NULL) +
         (SELECT COUNT(*) FROM tool_requests WHERE status = 'pending') AS pending_services,
         (SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='success') AS district_revenue`
    );
    return statsResult.rows[0];
  }

  async getGlobalMonthlyApplications() {
    const monthlyResult = await pool.query(
      `SELECT DATE_FORMAT(a.created_at, '%b') AS month, COUNT(*) AS count
       FROM (
         SELECT created_at, deleted_at FROM applications
         UNION ALL
         SELECT created_at, NULL AS deleted_at FROM tool_requests
       ) AS a
       WHERE a.deleted_at IS NULL
         AND a.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(a.created_at, '%b'), DATE_FORMAT(a.created_at, '%Y-%m')
       ORDER BY DATE_FORMAT(a.created_at, '%Y-%m')`
    );
    return monthlyResult.rows;
  }

  async getApplicationsCount(conditions, params) {
    const countResult = await pool.query(
      `SELECT COUNT(*) as count
       FROM (
         SELECT district, service_type, status, app_id, applicant_name, applicant_mobile, deleted_at FROM applications
         UNION ALL
         SELECT c.district, 'Tool Order' AS service_type, tr.status, tr.app_id, c.name AS applicant_name, c.mobile AS applicant_mobile, NULL AS deleted_at
         FROM tool_requests tr JOIN customers c ON tr.customer_id = c.id
       ) a
       WHERE a.deleted_at IS NULL AND ${conditions.join(' AND ')}`,
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

  async getCustomerDetails(customerId) {
    // 1. Customer profile
    const customerRes = await pool.query(
      'SELECT id, name, mobile, email, district, status, created_at, customer_id_display FROM customers WHERE id = ?',
      [customerId]
    );
    const customer = customerRes.rows[0];
    if (!customer) throw new Error('Customer not found');

    // 2. Applications (Mapi, Bantwara, Maps)
    const appsRes = await pool.query(
      `SELECT a.*, 
              (SELECT name FROM amins am WHERE am.id = a.assigned_amin_id) AS amin_name
       FROM applications a
       WHERE a.customer_id = ? AND a.deleted_at IS NULL
       ORDER BY a.created_at DESC`,
      [customerId]
    );
    const applications = appsRes.rows;

    // 3. Tool Orders
    const toolsRes = await pool.query(
      'SELECT * FROM tool_requests WHERE customer_id = ? ORDER BY created_at DESC',
      [customerId]
    );
    const toolOrders = toolsRes.rows;

    // 4. Documents & Reports
    let documents = [];
    if (applications.length > 0) {
      const appIds = applications.map(app => app.id);
      const docsRes = await pool.query(
        'SELECT * FROM documents WHERE application_id IN (?) ORDER BY created_at DESC',
        [appIds]
      );
      documents = docsRes.rows;
      
      // Group documents by application_id
      const docsByApp = {};
      documents.forEach(d => {
        if (!docsByApp[d.application_id]) docsByApp[d.application_id] = [];
        docsByApp[d.application_id].push(d);
      });
      
      applications.forEach(a => {
        a.documents = docsByApp[a.id] || [];
      });
    }

    return { customer, applications, toolOrders };
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

  async getApplicationFiles(applicationId) {
    const docs = await pool.query('SELECT file_path FROM documents WHERE application_id = ?', [applicationId]);
    const reports = await pool.query('SELECT final_report_url, map_pdf_url, photos FROM survey_reports WHERE application_id = ?', [applicationId]);
    return { docs: docs.rows, reports: reports.rows };
  }

  async deleteApplication(applicationId) {
    const client = await pool.getConnection();
    try {
      await client.beginTransaction();

      // 1. Delete invoices
      await client.query('DELETE FROM invoices WHERE application_id = ?', [applicationId]);

      // 2. Delete payments
      await client.query('DELETE FROM payments WHERE application_id = ?', [applicationId]);

      // 3. Delete notifications
      await client.query('DELETE FROM notifications WHERE action_link LIKE ?', [`%${applicationId}%`]);

      // 4. Delete audit/activity logs
      await client.query('DELETE FROM activity_logs WHERE application_id = ?', [applicationId]);
      await client.query('DELETE FROM audit_logs WHERE entity_type = "application" AND entity_id = ?', [applicationId]);

      // 5. Delete assignments and survey reports
      await client.query('DELETE FROM survey_reports WHERE application_id = ?', [applicationId]);
      await client.query('DELETE FROM assignments WHERE application_id = ?', [applicationId]);

      // 6. Delete documents
      await client.query('DELETE FROM documents WHERE application_id = ?', [applicationId]);

      // 7. Finally delete application
      await client.query('DELETE FROM applications WHERE id = ?', [applicationId]);

      await client.commit();
    } catch (error) {
      await client.rollback();
      throw error;
    } finally {
      client.release();
    }
  }

  async getToolRequest(toolRequestId) {
    const res = await pool.query('SELECT * FROM tool_requests WHERE id = ?', [toolRequestId]);
    return res.rows[0];
  }

  async deleteToolRequest(toolRequestId) {
    await pool.query('DELETE FROM tool_requests WHERE id = ?', [toolRequestId]);
    await pool.query('DELETE FROM notifications WHERE action_link LIKE ?', [`%${toolRequestId}%`]);
  }

  async restoreToolStock(toolName, quantity) {
    await pool.query('UPDATE tools_inventory SET stock_quantity = stock_quantity + ? WHERE name = ?', [quantity, toolName]);
  }
}

module.exports = new AdminRepository();
