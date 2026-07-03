const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/auth');

// Customer routes
router.get('/my-invoices', protect, authorize('customer'), invoiceController.getCustomerInvoices);
router.get('/:id', protect, invoiceController.getInvoiceById);

// Admin / SuperAdmin routes
router.get('/', protect, authorize('admin', 'superadmin'), invoiceController.getAllInvoices);
router.post('/generate', protect, authorize('superadmin'), invoiceController.generateInvoiceForApplication);

module.exports = router;
