// ── Global Error Handler ─────────────────────────────────────
module.exports = (err, req, res, next) => {
  console.error('[ERROR]', err.stack || err.message);

  // PostgreSQL unique violation
  if (err.code === '23505') {
    const detail = err.detail || '';
    let field = 'field';
    if (detail.includes('email'))  field = 'email';
    if (detail.includes('mobile')) field = 'mobile';
    if (detail.includes('license_number')) field = 'license number';
    return res.status(409).json({ success: false, message: `An account with this ${field} already exists.` });
  }

  // MySQL unique violation (ER_DUP_ENTRY)
  if (err.code === 'ER_DUP_ENTRY') {
    const msg = err.message || '';
    let field = 'field';
    if (msg.includes('email'))          field = 'email';
    if (msg.includes('mobile'))         field = 'mobile';
    if (msg.includes('license_number')) field = 'license number';
    return res.status(409).json({ success: false, message: `An account with this ${field} already exists.` });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ success: false, message: 'Related record not found.' });
  }

  // MySQL foreign key violation
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ success: false, message: 'Related record not found.' });
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    return res.status(400).json({ success: false, message: 'Invalid value provided.' });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
  }

  // Custom operational errors
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message || 'Internal server error.'
  });
};

// ── Custom Error Class ────────────────────────────────────────
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports.AppError = AppError;
