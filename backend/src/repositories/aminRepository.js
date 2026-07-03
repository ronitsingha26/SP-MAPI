const pool = require('../config/db');

class AminRepository {
  async getTasks(aminId, conditions, params) {
    const result = await pool.query(
      `SELECT a.id, a.app_id, a.service_type, a.status, a.district, a.village,
              a.applicant_name, a.applicant_mobile, a.amin_assigned_at, a.created_at,
              a.admin_remark
       FROM applications a
       WHERE ${conditions.join(' AND ')}
       ORDER BY a.amin_assigned_at DESC`,
      params
    );
    return result.rows;
  }

  async getTaskById(id, aminId) {
    const result = await pool.query(
      'SELECT * FROM applications WHERE id=? AND assigned_amin_id=? AND deleted_at IS NULL',
      [id, aminId]
    );
    return result.rows[0];
  }

  async updateTaskStatus(id, status, history, remark) {
    await pool.query(
      `UPDATE applications SET status=?, status_history=?, admin_remark=?, updated_at=NOW()
       ${status === 'completed' ? ', completed_at=NOW()' : ''}
       WHERE id=?`,
      [status, JSON.stringify(history), remark || null, id]
    );
  }

  async updateAminStatsOnCompletion(aminId) {
    await pool.query(
      'UPDATE amins SET tasks_completed=tasks_completed+1, active_tasks=GREATEST(active_tasks-1,0) WHERE id=?',
      [aminId]
    );
  }

  async updateFieldReportUrl(id, aminId, fileUrl) {
    await pool.query(
      'UPDATE applications SET field_report_url=?, updated_at=NOW() WHERE id=? AND assigned_amin_id=?',
      [fileUrl, id, aminId]
    );
  }

  async createDocument(docId, applicationId, originalName, storedName, filePath, fileUrl, fileSize, mimeType) {
    await pool.query(
      `INSERT INTO documents
         (id, application_id, doc_type, original_name, stored_name, file_path, file_url, file_size, mime_type, uploaded_by)
       VALUES (?,?,'field_report',?,?,?,?,?,?,'amin')`,
      [docId, applicationId, originalName, storedName, filePath, fileUrl, fileSize, mimeType]
    );
  }

  async getAminProfile(aminId) {
    const result = await pool.query(
      'SELECT id,name,mobile,district_name,license_number,status,tasks_completed,active_tasks,rating FROM amins WHERE id=?',
      [aminId]
    );
    return result.rows[0];
  }

  async getRecentTasks(aminId) {
    const result = await pool.query(
      `SELECT id,app_id,service_type,status,district,applicant_name,amin_assigned_at
       FROM applications WHERE assigned_amin_id=? AND deleted_at IS NULL
       ORDER BY amin_assigned_at DESC LIMIT 5`,
      [aminId]
    );
    return result.rows;
  }
}

module.exports = new AminRepository();
