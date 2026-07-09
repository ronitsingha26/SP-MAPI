const invoiceRepository = require('../repositories/invoiceRepository');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middleware/errorHandler');

class InvoiceService {
  async generateInvoice(applicationId, customerId, totalAmount, paymentId = null, status = 'unpaid', client = undefined) {
    // Generate a unique invoice number like INV-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
    const randomHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
    const invoiceNumber = `INV-${dateStr}-${randomHex}`;

    // Calculate subtotal and tax (assuming 18% GST is included in the totalAmount for now)
    // Formula: Subtotal + (Subtotal * 0.18) = Total => Subtotal = Total / 1.18
    const GST_RATE = 0.18;
    const subtotal = (totalAmount / (1 + GST_RATE)).toFixed(2);
    const taxAmount = (totalAmount - subtotal).toFixed(2);

    const id = uuidv4();
    
    return await invoiceRepository.createInvoice(
      id,
      invoiceNumber,
      applicationId,
      paymentId,
      customerId,
      parseFloat(subtotal),
      parseFloat(taxAmount),
      totalAmount,
      status,
      client
    );
  }

  async getInvoiceById(id) {
    const invoice = await invoiceRepository.getInvoiceById(id);
    if (!invoice) throw new AppError('Invoice not found', 404);
    return invoice;
  }

  async getInvoicesByCustomer(customerId) {
    return await invoiceRepository.getInvoicesByCustomer(customerId);
  }

  async getAllInvoices(adminDistricts = null) {
    return await invoiceRepository.getAllInvoices(adminDistricts);
  }

  async markAsPaid(id, paymentId) {
    return await invoiceRepository.markInvoiceAsPaid(id, paymentId);
  }
}

module.exports = new InvoiceService();
