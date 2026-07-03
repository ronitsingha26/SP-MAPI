const fs = require('fs');

let appRoutes = fs.readFileSync('src/routes/application.routes.js', 'utf8');
if (!appRoutes.includes('bookCtrl')) {
  appRoutes = appRoutes.replace("const miscCtrl = require('../controllers/miscController');", 
    "const miscCtrl = require('../controllers/miscController');\nconst bookCtrl = require('../controllers/bookingController');");
  
  const insertIndex = appRoutes.indexOf("// ── Customer: get own applications list ──");
  if (insertIndex > -1) {
    const before = appRoutes.substring(0, insertIndex);
    const after = appRoutes.substring(insertIndex);
    appRoutes = before + `// ── Customer: Plot Bookings ──\nrouter.get('/customer/bookings', protect, authorize('customer'), bookCtrl.getCustomerBookings);\nrouter.post('/customer/bookings', protect, authorize('customer'), bookCtrl.createBooking);\n\n` + after;
  }
  
  fs.writeFileSync('src/routes/application.routes.js', appRoutes);
  console.log('Patched application.routes.js');
}

