const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const activityLogService = require('./activityLogService');

class AssignmentService {
  /**
   * Admin assigns an Amin to an application
   */
  async createAssignment({ application_id, amin_id, assigned_by, survey_date, survey_time, priority, remarks }) {
    const id = uuidv4();

    const client = await pool.getConnection();
    try {
      await client.beginTransaction();

      // Create assignment record
      await client.query(
        `INSERT INTO assignments (id, application_id, amin_id, assigned_by, survey_date, survey_time, priority, remarks)
         VALUES (?,?,?,?,?,?,?,?)`,
        [id, application_id, amin_id, assigned_by, survey_date || null, survey_time || null, priority || 'normal', remarks || null]
      );

      // Update application status to 'assigned'
      await client.query(
        `UPDATE applications SET status = 'assigned', assigned_amin_id = ?, amin_assigned_at = NOW(),
                visit_date = ?, visit_time = ?, last_edited_by = ?, last_edited_at = NOW()
         WHERE id = ?`,
        [amin_id, survey_date || null, survey_time || null, assigned_by, application_id]
      );

      // Increment amin's active tasks
      await client.query(
        `UPDATE amins SET active_tasks = active_tasks + 1 WHERE id = ?`,
        [amin_id]
      );

      await client.commit();

      // Log activity
      await activityLogService.log({
        application_id,
        action: 'AMIN_ASSIGNED',
        performed_by: assigned_by,
        performer_type: 'admin',
        old_status: 'approved',
        new_status: 'assigned',
        remarks: remarks || 'Amin assigned to application'
      });

      return { id, application_id, amin_id };
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      await client.release();
    }
  }

  /**
   * Amin accepts/rejects an assignment
   */
  async updateAssignmentStatus(assignment_id, amin_id, status, remarks) {
    const assResult = await pool.query(
      'SELECT * FROM assignments WHERE id = ? AND amin_id = ?',
      [assignment_id, amin_id]
    );
    const assignment = assResult.rows[0];
    if (!assignment) throw new Error('Assignment not found.');

    const oldStatus = assignment.status;

    const updates = { status };
    if (status === 'accepted') updates.accepted_at = new Date();
    if (status === 'in_progress') updates.started_at = new Date();
    if (status === 'completed') updates.completed_at = new Date();

    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);

    await pool.query(
      `UPDATE assignments SET ${setClauses} WHERE id = ?`,
      [...values, assignment_id]
    );

    // Update application status accordingly
    let appStatus = null;
    if (status === 'accepted') appStatus = 'assigned';
    if (status === 'in_progress') appStatus = 'in_progress';
    if (status === 'completed') appStatus = 'completed';

    if (appStatus) {
      await pool.query(
        'UPDATE applications SET status = ? WHERE id = ?',
        [appStatus, assignment.application_id]
      );
    }

    // If completed, update amin stats
    if (status === 'completed') {
      await pool.query(
        `UPDATE amins SET tasks_completed = tasks_completed + 1, active_tasks = GREATEST(active_tasks - 1, 0) WHERE id = ?`,
        [amin_id]
      );
    }

    // Log activity
    await activityLogService.log({
      application_id: assignment.application_id,
      action: `ASSIGNMENT_${status.toUpperCase()}`,
      performed_by: amin_id,
      performer_type: 'amin',
      old_status: oldStatus,
      new_status: status,
      remarks
    });

    return { assignment_id, status };
  }

  /**
   * Get assignments for an amin
   */
  async getAminAssignments(amin_id, status_filter = null) {
    let query = `SELECT ass.*,
                        a.app_id, a.service_type, a.applicant_name, a.applicant_mobile,
                        a.district, a.village, a.mouza_name, a.khata_number, a.plot_number,
                        a.land_area, a.remarks AS app_remarks, a.status AS app_status,
                        c.name AS customer_name, c.mobile AS customer_mobile, c.address AS customer_address
                 FROM assignments ass
                 JOIN applications a ON ass.application_id = a.id
                 LEFT JOIN customers c ON a.customer_id = c.id
                 WHERE ass.amin_id = ?`;
    const params = [amin_id];

    if (status_filter) {
      query += ` AND ass.status = ?`;
      params.push(status_filter);
    }

    query += ` ORDER BY ass.survey_date ASC, ass.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Get assignments for an application
   */
  async getApplicationAssignments(application_id) {
    const result = await pool.query(
      `SELECT ass.*, am.name AS amin_name, am.mobile AS amin_mobile, am.license_number
       FROM assignments ass
       JOIN amins am ON ass.amin_id = am.id
       WHERE ass.application_id = ?
       ORDER BY ass.created_at DESC`,
      [application_id]
    );
    return result.rows;
  }
}

module.exports = new AssignmentService();
