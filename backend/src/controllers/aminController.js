const aminService = require('../services/aminService');
const assignmentService = require('../services/assignmentService');
const surveyReportService = require('../services/surveyReportService');
const { AppError } = require('../middleware/errorHandler');
const path = require('path');

// ── Dashboard ──────────────────────────────────────────────
exports.getDashboard = async (req, res, next) => {
  try {
    const data = await aminService.getDashboard(req.user.id);
    // Also get today's assignments
    const allAssignments = await assignmentService.getAminAssignments(req.user.id);
    const today = new Date().toISOString().split('T')[0];
    const todaysSurveys = allAssignments.filter(a => a.survey_date && a.survey_date.toISOString?.().split('T')[0] === today);
    res.json({ success: true, ...data, assignments: allAssignments, todays_surveys: todaysSurveys });
  } catch (err) { next(err); }
};

// ── Assignments ────────────────────────────────────────────
exports.getAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAminAssignments(req.user.id, req.query.status);
    res.json({ success: true, assignments });
  } catch (err) { next(err); }
};

exports.acceptAssignment = async (req, res, next) => {
  try {
    const result = await assignmentService.updateAssignmentStatus(req.params.id, req.user.id, 'accepted', req.body.remarks);
    res.json({ success: true, message: 'Assignment accepted.', ...result });
  } catch (err) { next(err); }
};

exports.rejectAssignment = async (req, res, next) => {
  try {
    const result = await assignmentService.updateAssignmentStatus(req.params.id, req.user.id, 'rejected', req.body.remarks);
    res.json({ success: true, message: 'Assignment rejected.', ...result });
  } catch (err) { next(err); }
};

exports.startSurvey = async (req, res, next) => {
  try {
    const result = await assignmentService.updateAssignmentStatus(req.params.id, req.user.id, 'in_progress', req.body.remarks);
    res.json({ success: true, message: 'Survey started.', ...result });
  } catch (err) { next(err); }
};

exports.completeSurvey = async (req, res, next) => {
  try {
    const result = await assignmentService.updateAssignmentStatus(req.params.id, req.user.id, 'completed', req.body.remarks);
    res.json({ success: true, message: 'Survey completed.', ...result });
  } catch (err) { next(err); }
};

// ── Survey Report ──────────────────────────────────────────
exports.submitSurveyReport = async (req, res, next) => {
  try {
    const { gps_coordinates, survey_notes, remarks } = req.body;
    
    // Process uploaded files
    let final_report_url = null;
    let map_pdf_url = null;
    let photos = [];

    if (req.files?.final_report?.[0]) {
      final_report_url = `/uploads/${path.relative(process.env.UPLOAD_PATH || './uploads', req.files.final_report[0].path)}`;
    }
    if (req.files?.map_pdf?.[0]) {
      map_pdf_url = `/uploads/${path.relative(process.env.UPLOAD_PATH || './uploads', req.files.map_pdf[0].path)}`;
    }
    if (req.files?.photos) {
      photos = req.files.photos.map(f => `/uploads/${path.relative(process.env.UPLOAD_PATH || './uploads', f.path)}`);
    }

    // Get assignment to find application_id
    const assignments = await assignmentService.getAminAssignments(req.user.id);
    const assignment = assignments.find(a => a.id === req.params.id);
    if (!assignment) return next(new AppError('Assignment not found.', 404));

    const result = await surveyReportService.createSurveyReport({
      assignment_id: req.params.id,
      application_id: assignment.application_id,
      amin_id: req.user.id,
      gps_coordinates, survey_notes,
      final_report_url, map_pdf_url, photos, remarks
    });

    res.status(201).json({ success: true, message: 'Survey report submitted.', ...result });
  } catch (err) { next(err); }
};

// ── Legacy task endpoints (backward compat) ────────────────
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await aminService.getTasks(req.user.id, req.query);
    res.json({ success: true, tasks });
  } catch (err) { next(err); }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status, remark } = req.body;
    await aminService.updateTaskStatus(req.params.id, req.user, status, remark);
    res.json({ success: true, message: `Task status updated to ${status}.` });
  } catch (err) { next(err); }
};

exports.uploadReport = async (req, res, next) => {
  try {
    const file_url = await aminService.uploadReport(req.params.id, req.user.id, req.file);
    res.json({ success: true, message: 'Report uploaded.', file_url });
  } catch (err) { next(err); }
};
