const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('mobile').trim().notEmpty().withMessage('Mobile number is required').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit mobile number is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('district').trim().notEmpty().withMessage('District is required'),
  body('aadhaar_number').optional({ checkFalsy: true }).matches(/^[0-9]{12}$/).withMessage('Valid 12-digit Aadhaar number is required'),
];

const loginValidator = [
  body('mobile').optional().trim().matches(/^[0-9]{10}$/).withMessage('Valid 10-digit mobile number is required'),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  body().custom((value) => {
    if (!value.mobile && !value.email) {
      throw new Error('Either mobile or email is required for login');
    }
    return true;
  }),
];

const adminLoginValidator = [
  body('email').notEmpty().withMessage('Email or ID is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const aminLoginValidator = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
  registerValidator,
  loginValidator,
  adminLoginValidator,
  aminLoginValidator,
};
