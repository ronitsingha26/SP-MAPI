require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const morgan        = require('morgan');
const path          = require('path');
const rateLimit     = require('express-rate-limit');
const errorHandler  = require('./src/middleware/errorHandler');

// ── Initialize DB ─────────────────────────────────────────────
require('./src/config/db');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ───────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate Limiting ─────────────────────────────────────────────
const isDev = process.env.NODE_ENV !== 'production';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  skip: () => isDev, // Skip rate limiting in development
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again in 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: () => isDev, // Skip rate limiting in development
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// ── Logging ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Body Parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static File Serving (Uploads) ────────────────────────────
const uploadDir = path.join(__dirname, process.env.UPLOAD_PATH || 'uploads');
app.use('/uploads', express.static(uploadDir));
app.use('/api/uploads', express.static(uploadDir));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',         require('./src/routes/auth.routes'));
app.use('/api/applications', require('./src/routes/application.routes'));
app.use('/api/admin',        require('./src/routes/admin.routes'));
app.use('/api/superadmin',   require('./src/routes/superadmin.routes'));
app.use('/api/amin',         require('./src/routes/amin.routes'));
app.use('/api/public',       require('./src/routes/public.routes'));
app.use('/api/invoices',     require('./src/routes/invoice.routes'));
app.use('/api/notifications', require('./src/routes/notification.routes'));
app.use('/api/customer/payments', require('./src/routes/payment.routes'));

// ── Customer routes (re-mapped from application controller) ──
const { protect, authorize } = require('./src/middleware/auth');
const miscCtrl = require('./src/controllers/miscController');
app.get('/api/customer/profile',  protect, authorize('customer'), miscCtrl.getProfile);
app.put('/api/customer/profile',  protect, authorize('customer'), miscCtrl.updateProfile);
app.get('/api/customer/payments', protect, authorize('customer'), miscCtrl.getPayments);

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SP MAPI API is running.', timestamp: new Date().toISOString() });
});

// ── 404 Handler for API routes ──────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found.` });
});

// ── Serve Frontend ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 SP MAPI Backend running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API Base URL: http://localhost:${PORT}/api\n`);
});

module.exports = app;
