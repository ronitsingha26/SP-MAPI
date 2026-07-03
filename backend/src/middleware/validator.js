const { validationResult } = require('express-validator');
const { ErrorCodes, ErrorMessages } = require('../utils/errorCodes');
const { AppError } = require('./errorHandler');

const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors for consistency
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    // Send formatted validation error
    return res.status(422).json({
      success: false,
      error_code: ErrorCodes.VALIDATION_ERROR,
      message: ErrorMessages[ErrorCodes.VALIDATION_ERROR],
      errors: extractedErrors,
    });
  };
};

module.exports = {
  validate,
};
