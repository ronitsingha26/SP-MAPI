const { v4: uuidv4 } = require('uuid');
const bookingRepo = require('../repositories/bookingRepository');
const propertyRepo = require('../repositories/propertyRepository');
const { AppError } = require('../middleware/errorHandler');

class BookingService {
  async getAll(query) {
    let conditions = [];
    let params = [];
    
    if (query.customer_id) {
      conditions.push('b.customer_id = ?');
      params.push(query.customer_id);
    }
    if (query.status) {
      conditions.push('b.status = ?');
      params.push(query.status);
    }
    
    return await bookingRepo.getAll(conditions, params);
  }

  async getById(id) {
    const booking = await bookingRepo.getById(id);
    if (!booking) throw new AppError('Booking not found', 404);
    return booking;
  }

  async createBooking(customerId, propertyId) {
    const property = await propertyRepo.getById(propertyId);
    if (!property) throw new AppError('Property not found', 404);
    if (property.status !== 'available') throw new AppError('Property is not available for booking', 400);

    const bookingId = uuidv4();
    // In actual Razorpay integration, amount might be a flat booking token (e.g. 5000), 
    // but for now let's set amount = property.price OR a fixed token amount.
    // Assuming 5000 for token.
    const tokenAmount = 5000;
    
    await bookingRepo.create({
      id: bookingId,
      customer_id: customerId,
      property_id: propertyId,
      amount: tokenAmount
    });

    // Optionally update property status to 'booked' temporarily or wait for admin approval
    await propertyRepo.update(propertyId, { status: 'booked' });

    return { id: bookingId, property, amount: tokenAmount };
  }

  async updateBookingStatus(id, status) {
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new AppError('Invalid status', 400);
    }
    await bookingRepo.updateStatus(id, status);
    
    if (status === 'rejected') {
      const booking = await this.getById(id);
      await propertyRepo.update(booking.property_id, { status: 'available' });
    }
  }
}

module.exports = new BookingService();
