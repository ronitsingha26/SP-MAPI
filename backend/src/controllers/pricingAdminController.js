const pricingAdminService = require('../services/pricingAdminService');

// --- Service Types ---

exports.getServiceTypes = async (req, res, next) => {
  try {
    const services = await pricingAdminService.getServiceTypes();
    res.json({ success: true, services });
  } catch (err) { next(err); }
};

exports.createServiceType = async (req, res, next) => {
  try {
    const service = await pricingAdminService.createServiceType(req.body);
    res.status(201).json({ success: true, message: 'Service type created', service });
  } catch (err) { next(err); }
};

exports.updateServiceType = async (req, res, next) => {
  try {
    const service = await pricingAdminService.updateServiceType(req.params.id, req.body);
    res.json({ success: true, message: 'Service type updated', service });
  } catch (err) { next(err); }
};

exports.deleteServiceType = async (req, res, next) => {
  try {
    await pricingAdminService.deleteServiceType(req.params.id);
    res.json({ success: true, message: 'Service type deleted' });
  } catch (err) { next(err); }
};

// --- Tools Inventory ---

exports.getTools = async (req, res, next) => {
  try {
    const tools = await pricingAdminService.getTools();
    res.json({ success: true, tools });
  } catch (err) { next(err); }
};

exports.createTool = async (req, res, next) => {
  try {
    const tool = await pricingAdminService.createTool(req.body);
    res.status(201).json({ success: true, message: 'Tool created', tool });
  } catch (err) { next(err); }
};

exports.updateTool = async (req, res, next) => {
  try {
    const tool = await pricingAdminService.updateTool(req.params.id, req.body);
    res.json({ success: true, message: 'Tool updated', tool });
  } catch (err) { next(err); }
};

exports.deleteTool = async (req, res, next) => {
  try {
    await pricingAdminService.deleteTool(req.params.id);
    res.json({ success: true, message: 'Tool deleted' });
  } catch (err) { next(err); }
};

// --- Pricing Rules ---

exports.getPricingRules = async (req, res, next) => {
  try {
    const { service_id } = req.query;
    const rules = await pricingAdminService.getPricingRules(service_id);
    res.json({ success: true, rules });
  } catch (err) { next(err); }
};

exports.createPricingRule = async (req, res, next) => {
  try {
    const rule = await pricingAdminService.createPricingRule(req.body);
    res.status(201).json({ success: true, message: 'Pricing rule created', rule });
  } catch (err) { next(err); }
};

exports.updatePricingRule = async (req, res, next) => {
  try {
    const rule = await pricingAdminService.updatePricingRule(req.params.id, req.body);
    res.json({ success: true, message: 'Pricing rule updated', rule });
  } catch (err) { next(err); }
};

exports.deletePricingRule = async (req, res, next) => {
  try {
    await pricingAdminService.deletePricingRule(req.params.id);
    res.json({ success: true, message: 'Pricing rule deleted' });
  } catch (err) { next(err); }
};
