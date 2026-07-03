const propertyService = require('../services/propertyService');

exports.getAllProperties = async (req, res, next) => {
  try {
    const query = req.query;
    // For admin, they might want to see only their properties
    if (req.user && req.user.role === 'admin') {
      // If admin only wants to see properties they added, uncomment below:
      // query.admin_id = req.user.id;
    }
    const properties = await propertyService.getAll(query);
    res.json({ success: true, properties });
  } catch (err) { next(err); }
};

exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await propertyService.getById(req.params.id);
    res.json({ success: true, property });
  } catch (err) { next(err); }
};

exports.createProperty = async (req, res, next) => {
  try {
    const property = await propertyService.create(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Property created.', property });
  } catch (err) { next(err); }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const property = await propertyService.update(req.params.id, req.body, req.user);
    res.json({ success: true, message: 'Property updated.', property });
  } catch (err) { next(err); }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    await propertyService.delete(req.params.id, req.user);
    res.json({ success: true, message: 'Property deleted.' });
  } catch (err) { next(err); }
};
