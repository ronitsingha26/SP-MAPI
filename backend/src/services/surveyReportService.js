const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const activityLogService = require('./activityLogService');

class SurveyReportService {
  /**
   * Amin submits a survey report
   */
  async createSurveyReport({
    assignment_id, application_id, amin_id,
    gps_coordinates, survey_notes, final_report_url,
    map_pdf_url, photos, remarks
  }) {
    const id = uuidv4();

    await pool.query(
      `INSERT INTO survey_reports
         (id, assignment_id, application_id, amin_id, gps_coordinates, survey_notes,
          final_report_url, map_pdf_url, photos, remarks)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        id, assignment_id, application_id, amin_id,
        gps_coordinates || null, survey_notes || null,
        final_report_url || null, map_pdf_url || null,
        photos ? JSON.stringify(photos) : null, remarks || null
      ]
    );

    // Log activity
    await activityLogService.log({
      application_id,
      action: 'SURVEY_REPORT_SUBMITTED',
      performed_by: amin_id,
      performer_type: 'amin',
      remarks: remarks || 'Survey report submitted'
    });

    return { id, assignment_id, application_id };
  }

  /**
   * Admin verifies a survey report
   */
  async verifyReport(report_id, admin_id, status, rejection_reason) {
    const reportResult = await pool.query('SELECT * FROM survey_reports WHERE id = ?', [report_id]);
    const report = reportResult.rows[0];
    if (!report) throw new Error('Survey report not found.');

    await pool.query(
      `UPDATE survey_reports SET verification_status = ?, verified_by = ?, verified_at = NOW(), rejection_reason = ?
       WHERE id = ?`,
      [status, admin_id, rejection_reason || null, report_id]
    );

    // If approved, mark application as completed/delivered
    if (status === 'approved') {
      await pool.query(
        `UPDATE applications SET status = 'completed', completed_at = NOW(), completion_date = NOW(),
                field_report_url = ?, last_edited_by = ?, last_edited_at = NOW()
         WHERE id = ?`,
        [report.final_report_url, admin_id, report.application_id]
      );

      await activityLogService.log({
        application_id: report.application_id,
        action: 'SURVEY_VERIFIED_APPROVED',
        performed_by: admin_id,
        performer_type: 'admin',
        old_status: 'in_progress',
        new_status: 'completed',
        remarks: 'Survey report verified and approved by admin'
      });
    } else {
      await activityLogService.log({
        application_id: report.application_id,
        action: 'SURVEY_VERIFIED_REJECTED',
        performed_by: admin_id,
        performer_type: 'admin',
        remarks: rejection_reason || 'Survey report rejected'
      });
    }

    return { report_id, status };
  }

  /**
   * Get survey reports for an application
   */
  async getReportsByApplication(application_id) {
    const result = await pool.query(
      `SELECT sr.*, am.name AS amin_name
       FROM survey_reports sr
       LEFT JOIN amins am ON sr.amin_id = am.id
       WHERE sr.application_id = ?
       ORDER BY sr.submitted_at DESC`,
      [application_id]
    );
    return result.rows;
  }

  /**
   * Get survey reports for an amin
   */
  async getReportsByAmin(amin_id) {
    const result = await pool.query(
      `SELECT sr.*, a.app_id, a.service_type, a.applicant_name
       FROM survey_reports sr
       JOIN applications a ON sr.application_id = a.id
       WHERE sr.amin_id = ?
       ORDER BY sr.submitted_at DESC`,
      [amin_id]
    );
    return result.rows;
  }
}

module.exports = new SurveyReportService();
