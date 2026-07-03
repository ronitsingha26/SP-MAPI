const adminService = require('../services/adminService');
const assignmentService = require('../services/assignmentService');
const toolRequestService = require('../services/toolRequestService');
const activityLogService = require('../services/activityLogService');
const { AppError } = require('../middleware/errorHandler');
const { jsonToCsv } = require('../utils/csvExport');

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getDashboard(req.user.id);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

exports.getApplications = async (req, res, next) => {
  try {
    const data = await adminService.getApplications(req.user.id, req.query);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remark } = req.body;
    await adminService.updateApplicationStatus(req.params.id, status, remark, { ...req.user, ip: req.ip });
    res.json({ success: true, message: `Application status updated to ${status}.` });
  } catch (err) { next(err); }
};

exports.assignAmin = async (req, res, next) => {
  try {
    const { amin_id, survey_date, survey_time, priority, remarks } = req.body;
    if (!amin_id) return next(new AppError('Amin ID is required.', 400));

    // Use enhanced assignment service
    const result = await assignmentService.createAssignment({
      application_id: req.params.id,
      amin_id,
      assigned_by: req.user.id,
      survey_date, survey_time, priority, remarks
    });

    res.json({ success: true, message: 'Amin assigned successfully.', assignment: result });
  } catch (err) { next(err); }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await adminService.getCustomers(req.user.id, req.query);
    res.json({ success: true, customers });
  } catch (err) { next(err); }
};

exports.getAmins = async (req, res, next) => {
  try {
    const amins = await adminService.getAmins(req.user.id);
    res.json({ success: true, amins });
  } catch (err) { next(err); }
};

exports.createAmin = async (req, res, next) => {
  try {
    const { name, mobile, password } = req.body;
    if (!name || !mobile || !password) return next(new AppError('Name, mobile, and password are required.', 400));
    const amin = await adminService.createAmin(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Amin created successfully.', amin });
  } catch (err) { next(err); }
};

exports.updateAmin = async (req, res, next) => {
  try {
    await adminService.updateAmin(req.params.id, req.body);
    res.json({ success: true, message: 'Amin updated.' });
  } catch (err) { next(err); }
};

exports.deleteAmin = async (req, res, next) => {
  try {
    await adminService.deleteAmin(req.params.id);
    res.json({ success: true, message: 'Amin deactivated.' });
  } catch (err) { next(err); }
};

exports.getPayments = async (req, res, next) => {
  try {
    const payments = await adminService.getPayments(req.user.id);
    res.json({ success: true, payments });
  } catch (err) { next(err); }
};

exports.getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await adminService.getEnquiries();
    res.json({ success: true, enquiries });
  } catch (err) { next(err); }
};

exports.exportData = async (req, res, next) => {
  try {
    const type = req.params.type;
    let data = [];
    if (type === 'applications') {
      const appsData = await adminService.getApplications(req.user.id, { limit: 10000 });
      data = appsData.applications || [];
    } else if (type === 'customers') {
      data = await adminService.getCustomers(req.user.id, { limit: 10000 });
    } else {
      return next(new AppError('Invalid export type', 400));
    }
    
    const csv = jsonToCsv(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${type}_export_${Date.now()}.csv`);
    res.send(csv);
  } catch (err) { next(err); }
};

// ── Tool Orders ────────────────────────────────────────────────
exports.getToolsOrders = async (req, res, next) => {
  try {
    const toolRequestService = require('../services/toolRequestService');
    const orders = await toolRequestService.getAllToolRequests(req.query);
    res.json({ success: true, count: orders.length, orders });
  } catch (err) { next(err); }
};

exports.updateToolsOrderStatus = async (req, res, next) => {
  try {
    const { status, admin_remark } = req.body;
    if (!status) return next(new AppError('Status is required', 400));
    
    const toolRequestService = require('../services/toolRequestService');
    await toolRequestService.updateToolRequestStatus(req.params.id, status, admin_remark, req.user.id);
    res.json({ success: true, message: 'Tool order status updated.' });
  } catch (err) { next(err); }
};

// ── Contact Enquiries ──────────────────────────────────────────
exports.getEnquiries = async (req, res, next) => {
  try {
    const miscService = require('../services/miscService');
    const enquiries = await miscService.getAllEnquiries();
    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (err) { next(err); }
};

// ── Merged SuperAdmin Methods ─────────────────────────────────

exports.getSuperDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getSuperDashboard();
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

exports.getAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getAdmins();
    res.json({ success: true, admins });
  } catch (err) { next(err); }
};

exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !password || !mobile) return next(new AppError('Name, email, mobile, and password are required.', 400));
    const admin = await adminService.createAdmin(req.body, { ...req.user, ip: req.ip });
    res.status(201).json({ success: true, message: 'Admin created.', admin });
  } catch (err) { next(err); }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    await adminService.updateAdmin(req.params.id, req.body);
    res.json({ success: true, message: 'Admin updated.' });
  } catch (err) { next(err); }
};

exports.deleteAdmin = async (req, res, next) => {
  try {
    await adminService.deleteAdmin(req.params.id, { ...req.user, ip: req.ip });
    res.json({ success: true, message: 'Admin deactivated.' });
  } catch (err) { next(err); }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const data = await adminService.getAllUsers(req.query);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const data = await adminService.getAuditLogs(req.query);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

exports.getDistricts = async (req, res, next) => {
  try {
    const districts = await adminService.getDistricts();
    res.json({ success: true, districts });
  } catch (err) { next(err); }
};

exports.createDistrict = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return next(new AppError('District name is required.', 400));
    await adminService.createDistrict(req.body, { ...req.user, ip: req.ip });
    res.status(201).json({ success: true, message: 'District created.' });
  } catch (err) { next(err); }
};

exports.updateDistrict = async (req, res, next) => {
  try {
    await adminService.updateDistrict(req.params.id, req.body, { ...req.user, ip: req.ip });
    res.json({ success: true, message: 'District updated.' });
  } catch (err) { next(err); }
};

exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await adminService.getAllPayments(req.query);
    res.json({ success: true, payments });
  } catch (err) { next(err); }
};

exports.broadcast = async (req, res, next) => {
  try {
    // Store broadcast notification for all target users
    const { title, message, target = 'all' } = req.body;
    if (!title || !message) return next(new AppError('Title and message are required.', 400));
    // Use notification service to broadcast
    await adminService.broadcast({ title, message, target, actor: req.user });
    res.json({ success: true, message: 'Broadcast sent successfully.' });
  } catch (err) { next(err); }
};

// ── Tool Requests ──────────────────────────────────────────
exports.getToolRequests = async (req, res, next) => {
  try {
    const requests = await toolRequestService.getAllToolRequests(req.query);
    res.json({ success: true, tool_requests: requests });
  } catch (err) { next(err); }
};

exports.updateToolRequestStatus = async (req, res, next) => {
  try {
    const { status, admin_remark } = req.body;
    if (!status) return next(new AppError('Status is required.', 400));
    await toolRequestService.updateToolRequestStatus(req.params.id, status, admin_remark, req.user.id);
    res.json({ success: true, message: `Tool request status updated to ${status}.` });
  } catch (err) { next(err); }
};

// ── Application Timeline ───────────────────────────────────
exports.getApplicationTimeline = async (req, res, next) => {
  try {
    const timeline = await activityLogService.getTimeline(req.params.id);
    res.json({ success: true, timeline });
  } catch (err) { next(err); }
};
