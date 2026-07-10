const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createAminApplication = async (data) => {
  const {
    app_id, name, father_name, mobile, email, dob, gender, state, district, block_name, village, pin_code, highest_qualification, experience_years, previous_organization, documents
  } = data;
  const id = uuidv4();

  await pool.query(
    `INSERT INTO amin_applications (id, app_id, name, father_name, mobile, email, dob, gender, state, district, block_name, village, pin_code, highest_qualification, experience_years, previous_organization, documents)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, app_id, name, father_name || null, mobile, email, dob, gender, state, district, block_name, village, pin_code, highest_qualification, experience_years || 0, previous_organization || null, JSON.stringify(documents)]
  );

  return { id, app_id };
};

exports.findApplicationByEmailOrMobile = async (email, mobile) => {
  const result = await pool.query(
    `SELECT * FROM amin_applications WHERE email = ? OR mobile = ? LIMIT 1`,
    [email, mobile]
  );
  return result.rows[0];
};

exports.getApplicationByAppId = async (app_id) => {
  const result = await pool.query(
    `SELECT * FROM amin_applications WHERE app_id = ? LIMIT 1`,
    [app_id]
  );
  return result.rows[0];
};

exports.getApplicationById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM amin_applications WHERE id = ? LIMIT 1`,
    [id]
  );
  return result.rows[0];
};

exports.getAllApplications = async () => {
  const result = await pool.query(
    `SELECT a.*, 
     EXISTS(SELECT 1 FROM amins u WHERE u.mobile = a.mobile OR (u.email = a.email AND u.email IS NOT NULL AND u.email != '')) as is_amin_created
     FROM amin_applications a 
     ORDER BY a.created_at DESC`
  );
  return result.rows;
};

exports.updateApplicationStatus = async (id, status, admin_remark) => {
  await pool.query(
    `UPDATE amin_applications SET status = ?, admin_remark = ? WHERE id = ?`,
    [status, admin_remark || null, id]
  );
};

exports.deleteApplication = async (id) => {
  await pool.query(`DELETE FROM amin_applications WHERE id = ?`, [id]);
};
