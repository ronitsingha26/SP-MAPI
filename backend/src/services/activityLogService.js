const pool = require('../config/db');

class ActivityLogService {
  /**
   * Log an application lifecycle event for timeline tracking
   */
  async log({
    application_id = null,
    tool_request_id = null,
    action,
    performed_by = null,
    performer_type = null,
    performer_name = null,
    old_status = null,
    new_status = null,
    remarks = null
  }, client = null) {
    const db = client || pool;
    await db.query(
      `INSERT INTO activity_logs
         (application_id, tool_request_id, action, performed_by, performer_type, performer_name, old_status, new_status, remarks)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [application_id, tool_request_id, action, performed_by, performer_type, performer_name, old_status, new_status, remarks]
    );
  }

  /**
   * Get timeline for an application
   */
  async getTimeline(application_id) {
    const result = await pool.query(
      `SELECT id, action, performed_by, performer_type, performer_name,
              old_status, new_status, remarks, created_at
       FROM activity_logs
       WHERE application_id = ?
       ORDER BY created_at ASC`,
      [application_id]
    );
    return result.rows;
  }

  /**
   * Get timeline for a tool request
   */
  async getToolTimeline(tool_request_id) {
    const result = await pool.query(
      `SELECT id, action, performed_by, performer_type, performer_name,
              old_status, new_status, remarks, created_at
       FROM activity_logs
       WHERE tool_request_id = ?
       ORDER BY created_at ASC`,
      [tool_request_id]
    );
    return result.rows;
  }
}

module.exports = new ActivityLogService();
