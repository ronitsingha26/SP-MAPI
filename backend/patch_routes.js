const fs = require('fs');
const path = require('path');

// 1. admin.routes.js
let adminRoutes = fs.readFileSync('src/routes/admin.routes.js', 'utf8');
if (!adminRoutes.includes('propCtrl')) {
  adminRoutes = adminRoutes.replace("const adminCtrl    = require('../controllers/adminController');", 
    "const adminCtrl    = require('../controllers/adminController');\nconst propCtrl     = require('../controllers/propertyController');\nconst bookCtrl     = require('../controllers/bookingController');");
  
  adminRoutes += `
// --- Properties & Bookings ---
router.get('/properties',          propCtrl.getAllProperties);
router.post('/properties',         propCtrl.createProperty);
router.put('/properties/:id',      propCtrl.updateProperty);
router.delete('/properties/:id',   propCtrl.deleteProperty);

router.get('/bookings',            bookCtrl.getAdminBookings);
router.put('/bookings/:id/status', bookCtrl.updateBookingStatus);
`;
  fs.writeFileSync('src/routes/admin.routes.js', adminRoutes);
  console.log('Patched admin.routes.js');
}

// 2. public.routes.js
let publicRoutes = fs.readFileSync('src/routes/public.routes.js', 'utf8');
if (!publicRoutes.includes('propCtrl')) {
  publicRoutes = publicRoutes.replace("const laCtrl     = require('../controllers/locationAdminController');", 
    "const laCtrl     = require('../controllers/locationAdminController');\nconst propCtrl   = require('../controllers/propertyController');");
  
  publicRoutes += `
// --- Public Properties ---
router.get('/properties',          propCtrl.getAllProperties);
router.get('/properties/:id',      propCtrl.getPropertyById);
`;
  fs.writeFileSync('src/routes/public.routes.js', publicRoutes);
  console.log('Patched public.routes.js');
}

// 3. customer.routes.js
let customerRoutes = fs.readFileSync('src/routes/customer.routes.js', 'utf8');
if (!customerRoutes.includes('bookCtrl')) {
  customerRoutes = customerRoutes.replace("const custCtrl   = require('../controllers/customerController');", 
    "const custCtrl   = require('../controllers/customerController');\nconst bookCtrl   = require('../controllers/bookingController');");
  
  customerRoutes += `
// --- Plot Bookings ---
router.get('/bookings',            bookCtrl.getCustomerBookings);
router.post('/bookings',           bookCtrl.createBooking);
`;
  fs.writeFileSync('src/routes/customer.routes.js', customerRoutes);
  console.log('Patched customer.routes.js');
}

// 4. superadmin.routes.js
let saRoutes = fs.readFileSync('src/routes/superadmin.routes.js', 'utf8');
if (!saRoutes.includes('propCtrl')) {
  saRoutes = saRoutes.replace("const rbacCtrl  = require('../controllers/rbacController');", 
    "const rbacCtrl  = require('../controllers/rbacController');\nconst propCtrl  = require('../controllers/propertyController');\nconst bookCtrl  = require('../controllers/bookingController');");
  
  saRoutes += `
// --- Properties & Bookings ---
router.get('/properties',          propCtrl.getAllProperties);
router.get('/bookings',            bookCtrl.getAdminBookings);
`;
  fs.writeFileSync('src/routes/superadmin.routes.js', saRoutes);
  console.log('Patched superadmin.routes.js');
}

