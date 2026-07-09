const express  = require('express');
const router   = express.Router();
const appCtrl  = require('../controllers/applicationController');
const miscCtrl = require('../controllers/miscController');
const bookCtrl = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const upload   = require('../middleware/upload');

// ── All service submissions require customer login ──────────
router.post('/mapi',
  protect, authorize('customer'),
  upload.fields([
    { name: 'aadhaar_front', maxCount: 1 },
    { name: 'aadhaar_back',  maxCount: 1 },
    { name: 'land_document', maxCount: 1 },
    { name: 'other_document', maxCount: 1 },
  ]),
  appCtrl.submitMapi
);

router.post('/bantwara',
  protect, authorize('customer'),
  upload.fields([
    { name: 'aadhaar_front', maxCount: 1 },
    { name: 'aadhaar_back',  maxCount: 1 },
    { name: 'land_document', maxCount: 1 },
    { name: 'vanshawali',    maxCount: 1 },
    { name: 'khatiyan',      maxCount: 1 },
    { name: 'kewala',        maxCount: 1 },
    { name: 'other_document', maxCount: 1 },
  ]),
  appCtrl.submitBantwara
);

router.post('/map',
  protect, authorize('customer'),
  upload.fields([
    { name: 'aadhaar_front', maxCount: 1 },
    { name: 'aadhaar_back',  maxCount: 1 },
    { name: 'land_document', maxCount: 1 },
    { name: 'other_document', maxCount: 1 },
  ]),
  appCtrl.submitMap
);

// ── Tool Request (no file uploads, just JSON) ──────────────
router.post('/tools', protect, authorize('customer'), appCtrl.submitToolRequest);

// ── Customer authenticated routes ──────────────────────────
router.get('/customer/dashboard', protect, authorize('customer'), appCtrl.getCustomerDashboard);
router.get('/customer/profile',   protect, authorize('customer'), miscCtrl.getProfile);
router.put('/customer/profile',   protect, authorize('customer'), miscCtrl.updateProfile);
router.get('/customer/payments',  protect, authorize('customer'), miscCtrl.getPayments);

// ── Customer: get own applications list ──
router.get('/', protect, authorize('customer'), appCtrl.getMyApplications);

// ── Customer: get application timeline ──
router.get('/:id/timeline', protect, appCtrl.getApplicationTimeline);

// ── Customer: update own application (while still pending/submitted) ──
router.put('/:id', protect, authorize('customer'), appCtrl.updateApplication);

// ── Customer: withdraw application ──
router.put('/:id/withdraw', protect, authorize('customer'), appCtrl.withdrawApplication);
router.put('/tool-requests/:id/withdraw', protect, authorize('customer'), appCtrl.withdrawToolRequest);

// ── Customer: Plot Bookings ──
router.get('/customer/bookings', protect, authorize('customer'), bookCtrl.getCustomerBookings);
router.post('/customer/bookings', protect, authorize('customer'), bookCtrl.createBooking);

// ── Public: districts & tools ──
router.get('/public/districts', miscCtrl.getDistricts);
router.get('/public/tools', miscCtrl.getPublicTools);

// ── Public: Track Application by App ID ──
router.get('/track/:app_id', appCtrl.trackApplication);

// ── Get single application by id or app_id (must be last) ──
router.get('/:id', protect, appCtrl.getApplication);

module.exports = router;
