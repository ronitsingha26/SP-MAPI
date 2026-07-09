const invoiceService = require('../services/invoiceService');
const applicationService = require('../services/applicationService');
const { AppError } = require('../middleware/errorHandler');

exports.getCustomerInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getInvoicesByCustomer(req.user.id);
    res.json({ success: true, invoices });
  } catch (err) { next(err); }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    
    if (req.user.role === 'customer' && invoice.customer_id !== req.user.id) {
      throw new AppError('Not authorized to view this invoice', 403);
    }
    if (req.user.role === 'amin') {
      throw new AppError('Not authorized to view invoices', 403);
    }
    if (req.user.role === 'admin') {
      const applicationService = require('../services/applicationService');
      const app = await applicationService.getApplication(invoice.application_id, req.user);
      if (!app) throw new AppError('Not authorized', 403);
    }

    res.json({ success: true, invoice });
  } catch (err) { next(err); }
};

exports.getAllInvoices = async (req, res, next) => {
  try {
    let adminDistricts = null;
    if (req.user.role === 'admin') {
       const adminRepository = require('../repositories/adminRepository');
       adminDistricts = await adminRepository.getAdminDistricts(req.user.id);
    }
    const invoices = await invoiceService.getAllInvoices(adminDistricts);
    res.json({ success: true, invoices });
  } catch (err) { next(err); }
};

// Endpoint to generate an invoice for a specific application explicitly if not generated
exports.generateInvoiceForApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.body;
    const application = await applicationService.getApplicationById(applicationId);
    
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    // Usually, invoices are generated when payment is created, but for legacy ones we might need this
    const totalAmount = application.payment_required;
    const invoice = await invoiceService.generateInvoice(application.id, application.customer_id, totalAmount);

    res.status(201).json({ success: true, message: 'Invoice generated', invoice });
  } catch (err) { next(err); }
};
