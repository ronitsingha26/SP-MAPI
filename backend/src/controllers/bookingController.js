const bookingService = require('../services/bookingService');

exports.getCustomerBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAll({ customer_id: req.user.id });
    res.json({ success: true, bookings });
  } catch (err) { next(err); }
};

exports.getAdminBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAll(req.query);
    res.json({ success: true, bookings });
  } catch (err) { next(err); }
};

exports.createBooking = async (req, res, next) => {
  try {
    const { property_id } = req.body;
    const booking = await bookingService.createBooking(req.user.id, property_id);
    res.status(201).json({ success: true, message: 'Plot booked successfully.', booking });
  } catch (err) { next(err); }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    await bookingService.updateBookingStatus(req.params.id, status);
    res.json({ success: true, message: 'Booking status updated.' });
  } catch (err) { next(err); }
};
