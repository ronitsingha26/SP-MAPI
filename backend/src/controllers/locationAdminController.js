const locationAdminService = require('../services/locationAdminService');

// --- Blocks ---
exports.getBlocks = async (req, res, next) => {
  try {
    const blocks = await locationAdminService.getBlocks(req.query.district_id);
    res.json({ success: true, blocks });
  } catch (err) { next(err); }
};

exports.createBlock = async (req, res, next) => {
  try {
    const block = await locationAdminService.createBlock(req.body);
    res.status(201).json({ success: true, message: 'Block created', block });
  } catch (err) { next(err); }
};

exports.updateBlock = async (req, res, next) => {
  try {
    const block = await locationAdminService.updateBlock(req.params.id, req.body);
    res.json({ success: true, message: 'Block updated', block });
  } catch (err) { next(err); }
};

exports.deleteBlock = async (req, res, next) => {
  try {
    await locationAdminService.deleteBlock(req.params.id);
    res.json({ success: true, message: 'Block deleted' });
  } catch (err) { next(err); }
};

// --- Panchayats ---
exports.getPanchayats = async (req, res, next) => {
  try {
    const panchayats = await locationAdminService.getPanchayats(req.query.block_id);
    res.json({ success: true, panchayats });
  } catch (err) { next(err); }
};

exports.createPanchayat = async (req, res, next) => {
  try {
    const panchayat = await locationAdminService.createPanchayat(req.body);
    res.status(201).json({ success: true, message: 'Panchayat created', panchayat });
  } catch (err) { next(err); }
};

exports.updatePanchayat = async (req, res, next) => {
  try {
    const panchayat = await locationAdminService.updatePanchayat(req.params.id, req.body);
    res.json({ success: true, message: 'Panchayat updated', panchayat });
  } catch (err) { next(err); }
};

exports.deletePanchayat = async (req, res, next) => {
  try {
    await locationAdminService.deletePanchayat(req.params.id);
    res.json({ success: true, message: 'Panchayat deleted' });
  } catch (err) { next(err); }
};

// --- Villages ---
exports.getVillages = async (req, res, next) => {
  try {
    const villages = await locationAdminService.getVillages(req.query.panchayat_id);
    res.json({ success: true, villages });
  } catch (err) { next(err); }
};

exports.createVillage = async (req, res, next) => {
  try {
    const village = await locationAdminService.createVillage(req.body);
    res.status(201).json({ success: true, message: 'Village created', village });
  } catch (err) { next(err); }
};

exports.updateVillage = async (req, res, next) => {
  try {
    const village = await locationAdminService.updateVillage(req.params.id, req.body);
    res.json({ success: true, message: 'Village updated', village });
  } catch (err) { next(err); }
};

exports.deleteVillage = async (req, res, next) => {
  try {
    await locationAdminService.deleteVillage(req.params.id);
    res.json({ success: true, message: 'Village deleted' });
  } catch (err) { next(err); }
};
