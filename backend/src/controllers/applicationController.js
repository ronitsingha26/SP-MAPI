const applicationService = require('../services/applicationService');
const toolRequestService = require('../services/toolRequestService');
const activityLogService = require('../services/activityLogService');
const { AppError } = require('../middleware/errorHandler');

exports.submitMapi = async (req, res, next) => {
  try {
    // customer_id comes from auth middleware now
    req.body.customer_id = req.user.id;
    const result = await applicationService.submitMapi(req.body, req.files);

    res.status(201).json({
      success: true,
      message: 'Mapi application submitted successfully.',
      app_id: result.app_id,
      application_id: result.application_id,
      application: result.application
    });
  } catch (err) {
    next(err);
  }
};

exports.submitBantwara = async (req, res, next) => {
  try {
    req.body.customer_id = req.user.id;
    const result = await applicationService.submitBantwara(req.body, req.files);

    res.status(201).json({ 
      success: true, 
      message: 'Bantwara application submitted.', 
      app_id: result.app_id, 
      application: result.application 
    });
  } catch (err) {
    next(err);
  }
};

exports.submitMap = async (req, res, next) => {
  try {
    req.body.customer_id = req.user.id;
    const result = await applicationService.submitMap(req.body, req.files);

    res.status(201).json({ 
      success: true, 
      message: 'Map request submitted.', 
      app_id: result.app_id, 
      application: result.application 
    });
  } catch (err) {
    next(err);
  }
};

exports.submitToolRequest = async (req, res, next) => {
  try {
    const { tools, remarks } = req.body;
    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return next(new AppError('Please select at least one tool.', 400));
    }
    const result = await toolRequestService.createToolRequest(req.user.id, tools, remarks);
    res.status(201).json({
      success: true,
      message: 'Tool request submitted successfully.',
      app_id: result.app_id,
      tool_request_id: result.id
    });
  } catch (err) {
    next(err);
  }
};

exports.getApplication = async (req, res, next) => {
  try {
    const application = await applicationService.getApplication(req.params.id);
    res.json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getMyApplications(req.user.id);
    const toolRequests = await toolRequestService.getToolRequestsByCustomer(req.user.id);
    res.json({ success: true, applications, tool_requests: toolRequests });
  } catch (err) {
    next(err);
  }
};

exports.withdrawApplication = async (req, res, next) => {
  try {
    const result = await applicationService.withdrawApplication(req.params.id, req.user.id);
    res.json({ success: true, data: result, message: 'Application withdrawn successfully' });
  } catch (err) {
    if (err.message === 'Application has already been withdrawn.') {
      return res.status(409).json({ success: false, message: err.message });
    }
    next(err);
  }
};

exports.withdrawToolRequest = async (req, res, next) => {
  try {
    const result = await toolRequestService.withdrawToolRequest(req.params.id, req.user.id);
    res.json({ success: true, data: result, message: 'Tool request withdrawn successfully' });
  } catch (err) {
    if (err.message === 'Application has already been withdrawn.') {
      return res.status(409).json({ success: false, message: err.message });
    }
    next(err);
  }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const application = await applicationService.updateApplication(req.params.id, req.user.id, req.body);
    res.json({ success: true, message: 'Application updated.', application });
  } catch (err) {
    next(err);
  }
};

exports.trackApplication = async (req, res, next) => {
  try {
    const application = await applicationService.trackApplication(req.params.app_id);
    // Also get timeline
    if (application) {
      application.timeline = await activityLogService.getTimeline(application.id);
    }
    res.json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

exports.getApplicationTimeline = async (req, res, next) => {
  try {
    const timeline = await activityLogService.getTimeline(req.params.id);
    res.json({ success: true, timeline });
  } catch (err) {
    next(err);
  }
};

exports.getCustomerDashboard = async (req, res, next) => {
  try {
    const data = await applicationService.getCustomerDashboard(req.user.id);
    res.json({
      success: true,
      stats: data.stats,
      recent_applications: data.recent_applications
    });
  } catch (err) {
    next(err);
  }
};
