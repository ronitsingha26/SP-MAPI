const rbacService = require('../services/rbacService');

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await rbacService.getRoles();
    res.json({ success: true, roles });
  } catch (err) { next(err); }
};

exports.getRole = async (req, res, next) => {
  try {
    const role = await rbacService.getRole(req.params.id);
    res.json({ success: true, role });
  } catch (err) { next(err); }
};

exports.createRole = async (req, res, next) => {
  try {
    const role = await rbacService.createRole(req.body);
    res.status(201).json({ success: true, message: 'Role created', role });
  } catch (err) { next(err); }
};

exports.updateRole = async (req, res, next) => {
  try {
    const role = await rbacService.updateRole(req.params.id, req.body);
    res.json({ success: true, message: 'Role updated', role });
  } catch (err) { next(err); }
};

exports.deleteRole = async (req, res, next) => {
  try {
    await rbacService.deleteRole(req.params.id);
    res.json({ success: true, message: 'Role deleted' });
  } catch (err) { next(err); }
};

exports.getPermissions = async (req, res, next) => {
  try {
    const permissions = await rbacService.getPermissions();
    res.json({ success: true, permissions });
  } catch (err) { next(err); }
};

exports.createPermission = async (req, res, next) => {
  try {
    const permission = await rbacService.createPermission(req.body);
    res.status(201).json({ success: true, message: 'Permission created', permission });
  } catch (err) { next(err); }
};
