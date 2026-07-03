const pool = require('../config/db');

class ApplicationRepository {
  async findDistrictByName(name) {
    const result = await pool.query('SELECT id FROM districts WHERE name = ?', [name]);
    return result.rows[0];
  }

  async createApplication(data, client = pool) {
    const {
      id, app_id, service_type, customer_id, applicant_name, applicant_mobile, applicant_email,
      father_name, state, district, district_id, panchayat, police_station, village,
      ward_name, mouja_name, khata_number, block_name, block_id, pincode, land_area, payment_required,
      co_owners = null, court_case_number = null, vanshawali_details = null,
      khasra_number = null, map_purpose = null
    } = data;

    await client.query(
      `INSERT INTO applications
         (id, app_id, service_type, customer_id, applicant_name, applicant_mobile, applicant_email,
          father_name, state, district, district_id, panchayat, police_station, village,
          ward_name, mouza_name, khata_number, block_name, block_id, pincode, land_area, payment_required, 
          co_owners, court_case_number, vanshawali_details, khasra_number, map_purpose, status_history)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id, app_id, service_type, customer_id || null, applicant_name, applicant_mobile, applicant_email || null,
        father_name || null, state || 'Bihar', district || null, district_id || null, panchayat || null, police_station || null, village || null,
        ward_name || null, mouja_name || null, khata_number || null, block_name || null, block_id || null, pincode || null, land_area || null, payment_required || 0,
        co_owners ? JSON.stringify(co_owners) : null, court_case_number || null, vanshawali_details || null, khasra_number || null, map_purpose || null,
        JSON.stringify([])
      ]
    );

    const result = await client.query('SELECT * FROM applications WHERE id=?', [id]);
    return result.rows[0];
  }

  async createDocument(data, client = pool) {
    const { id, application_id, customer_id, doc_type, original_name, stored_name, file_path, file_url, file_size, mime_type } = data;
    await client.query(
      `INSERT INTO documents
         (id, application_id, customer_id, doc_type, original_name, stored_name, file_path, file_url, file_size, mime_type)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [id, application_id, customer_id || null, doc_type, original_name, stored_name, file_path, file_url, file_size, mime_type]
    );
  }

  async updateCustomerPrimaryApp(customer_id, app_id, client = pool) {
    await client.query(
      `UPDATE customers SET primary_app_id = COALESCE(primary_app_id, ?) WHERE id = ?`,
      [app_id, customer_id]
    );
  }

  async getApplicationByIdOrAppId(id) {
    const result = await pool.query(
      `SELECT a.*,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', d.id, 'doc_type', d.doc_type, 'original_name', d.original_name, 'file_url', d.file_url
                )
              ) AS documents,
              am.name AS amin_name, am.mobile AS amin_mobile
       FROM applications a
       LEFT JOIN documents d ON a.id = d.application_id
       LEFT JOIN amins am ON a.assigned_amin_id = am.id
       WHERE (a.id = ? OR a.app_id = ?) AND a.deleted_at IS NULL
       GROUP BY a.id, am.name, am.mobile`,
      [id, id]
    );
    return result.rows[0];
  }

  async getApplicationsByCustomerId(customer_id) {
    const result = await pool.query(
      `SELECT a.id, a.app_id, a.service_type, a.status, a.district,
              a.applicant_name, a.applicant_mobile, a.applicant_email,
              a.payment_status, a.payment_required, a.admin_remark,
              a.created_at, a.updated_at,
              am.name AS amin_name
       FROM applications a
       LEFT JOIN amins am ON a.assigned_amin_id = am.id
       WHERE a.customer_id = ? AND a.deleted_at IS NULL
       ORDER BY a.created_at DESC`,
      [customer_id]
    );
    const apps = result.rows;
    for (const app of apps) {
      const docResult = await pool.query(
        `SELECT id, original_name, doc_type, file_url, file_size, verification_status, created_at 
         FROM documents 
         WHERE application_id = ?`,
        [app.id]
      );
      app.documents = docResult.rows;
    }
    return apps;
  }

  async getApplicationByCustomerAndId(id, customer_id) {
    const result = await pool.query(
      'SELECT * FROM applications WHERE id = ? AND customer_id = ? AND deleted_at IS NULL',
      [id, customer_id]
    );
    return result.rows[0];
  }

  async updateApplication(id, data) {
    const {
      panchayat, police_station, village, ward_name, mouja_name,
      khata_number, block_name, pincode, land_area, khasra_number, map_purpose
    } = data;

    await pool.query(
      `UPDATE applications SET
         panchayat = COALESCE(?, panchayat),
         police_station = COALESCE(?, police_station),
         village = COALESCE(?, village),
         ward_name = COALESCE(?, ward_name),
         mouza_name = COALESCE(?, mouza_name),
         khata_number = COALESCE(?, khata_number),
         block_name = COALESCE(?, block_name),
         pincode = COALESCE(?, pincode),
         land_area = COALESCE(?, land_area),
         khasra_number = COALESCE(?, khasra_number),
         map_purpose = COALESCE(?, map_purpose),
         updated_at = NOW()
       WHERE id = ? AND deleted_at IS NULL`,
      [
        panchayat || null, police_station || null, village || null,
        ward_name || null, mouja_name || null, khata_number || null,
        block_name || null, pincode || null,
        land_area ? parseFloat(land_area) : null,
        khasra_number || null, map_purpose || null,
        id
      ]
    );

    const updated = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
    return updated.rows[0];
  }

  async getCustomerDashboardStats(customer_id) {
    const result = await pool.query(
      `SELECT
         COUNT(*) AS total,
         COUNT(CASE WHEN status IN ('submitted','verification','processing','map_preparation') THEN 1 END) AS pending,
         COUNT(CASE WHEN status IN ('approved','ready','delivered') THEN 1 END) AS approved,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed
       FROM applications
       WHERE customer_id = ? AND deleted_at IS NULL`,
      [customer_id]
    );
    
    const recentResult = await pool.query(
      `SELECT id, app_id, service_type, status, district, created_at
       FROM applications WHERE customer_id = ? AND deleted_at IS NULL
       ORDER BY created_at DESC LIMIT 5`,
      [customer_id]
    );
    
    return {
      stats: result.rows[0],
      recent_applications: recentResult.rows
    };
  }
}

module.exports = new ApplicationRepository();
