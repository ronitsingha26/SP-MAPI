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
    // Ensure the user owns this invoice if they are a customer
    if (req.user.role === 'customer' && invoice.customer_id !== req.user.id) {
      throw new AppError('Not authorized to view this invoice', 403);
    }
    res.json({ success: true, invoice });
  } catch (err) { next(err); }
};

exports.getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
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
