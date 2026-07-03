const superAdminService = require('../services/superAdminService');
const { AppError } = require('../middleware/errorHandler');
const { jsonToCsv } = require('../utils/csvExport');

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await superAdminService.getDashboard();
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

exports.getEnquiries = async (req, res, next) => {
  try {
    const adminService = require('../services/adminService');
    const enquiries = await adminService.getEnquiries();
    res.json({ success: true, enquiries });
  } catch (err) { next(err); }
};

exports.getAdmins = async (req, res, next) => {
  try {
    const admins = await superAdminService.getAdmins();
    res.json({ success: true, admins });
  } catch (err) { next(err); }
};

exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !password || !mobile) {
      return next(new AppError('Name, email, mobile, and password are required.', 400));
    }
    const admin = await superAdminService.createAdmin(req.body, { ...req.user, ip: req.ip });
    res.status(201).json({ success: true, message: 'Admin created.', admin });
  } catch (err) { next(err); }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    await superAdminService.updateAdmin(req.params.id, req.body);
    res.json({ success: true, message: 'Admin updated.' });
  } catch (err) { next(err); }
};

exports.deleteAdmin = async (req, res, next) => {
  try {
    await superAdminService.deleteAdmin(req.params.id, { ...req.user, ip: req.ip });
    res.json({ success: true, message: 'Admin deactivated.' });
  } catch (err) { next(err); }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const data = await superAdminService.getAllUsers(req.query);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const data = await superAdminService.getAuditLogs(req.query);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

exports.getDistricts = async (req, res, next) => {
  try {
    const districts = await superAdminService.getDistricts();
    res.json({ success: true, districts });
  } catch (err) { next(err); }
};

exports.createDistrict = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return next(new AppError('District name is required.', 400));
    await superAdminService.createDistrict(req.body, { ...req.user, ip: req.ip });
    res.status(201).json({ success: true, message: 'District created.' });
  } catch (err) { next(err); }
};

exports.updateDistrict = async (req, res, next) => {
  try {
    await superAdminService.updateDistrict(req.params.id, req.body, { ...req.user, ip: req.ip });
    res.json({ success: true, message: 'District updated.' });
  } catch (err) { next(err); }
};

exports.getPayments = async (req, res, next) => {
  try {
    const payments = await superAdminService.getPayments(req.query);
    res.json({ success: true, payments });
  } catch (err) { next(err); }
};

exports.exportData = async (req, res, next) => {
  try {
    const type = req.params.type;
    let data = [];
    if (type === 'payments') {
      // Export all payments
      data = await superAdminService.getPayments({ limit: 10000, page: 1 });
    } else if (type === 'users') {
      const usersData = await superAdminService.getAllUsers({ limit: 10000, page: 1, type: 'customers' });
      data = usersData.users;
    } else {
      return next(new AppError('Invalid export type', 400));
    }
    
    const csv = jsonToCsv(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${type}_export_${Date.now()}.csv`);
    res.send(csv);
  } catch (err) { next(err); }
};
