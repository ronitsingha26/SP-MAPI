const express    = require('express');
const router     = express.Router();
const adminCtrl  = require('../controllers/adminController');
const paCtrl     = require('../controllers/pricingAdminController');
const laCtrl     = require('../controllers/locationAdminController');
const rbacCtrl   = require('../controllers/rbacController');
const propCtrl   = require('../controllers/propertyController');
const bookCtrl   = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { jsonToCsv } = require('../utils/csvExport');
const upload     = require('../middleware/upload');

// All admin routes require authentication + admin OR superadmin role
router.use(protect, authorize('admin', 'superadmin'));

// ── Core Admin Routes ──
router.get('/dashboard',                       adminCtrl.getDashboard);
router.get('/applications',                    adminCtrl.getApplications);
router.put('/applications/:id/status',         adminCtrl.updateApplicationStatus);
router.delete('/applications/:id',             adminCtrl.deleteApplication);
router.post('/applications/:id/assign-amin',   adminCtrl.assignAmin);
router.get('/applications/:id/timeline',       adminCtrl.getApplicationTimeline);
router.get('/customers',                       adminCtrl.getCustomers);
router.get('/customers/:id/details',           adminCtrl.getCustomerDetails);
router.get('/amins',                           adminCtrl.getAmins);
router.post('/amins',                          adminCtrl.createAmin);
router.post('/amins/onboard',                  upload.fields([
  { name: 'aadhaar_front', maxCount: 1 },
  { name: 'aadhaar_back', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'educational_certificate', maxCount: 1 },
  { name: 'experience_certificate', maxCount: 1 },
  { name: 'passport_photo', maxCount: 1 }
]), adminCtrl.onboardAmin);
router.put('/amins/:id',                       adminCtrl.updateAmin);
router.delete('/amins/:id',                    adminCtrl.deleteAmin);

router.get('/amin-applications',               adminCtrl.getAminApplications);
router.put('/amin-applications/:id/status',    adminCtrl.reviewAminApplication);
router.delete('/amin-applications/:id',        adminCtrl.deleteAminApplication);
router.get('/payments',                        adminCtrl.getPayments);
router.get('/enquiries',                       adminCtrl.getEnquiries);
router.get('/export/:type',                    adminCtrl.exportData);

// ── Tool Requests Management ──
router.get('/tool-requests',                   adminCtrl.getToolRequests);
router.put('/tool-requests/:id/status',        adminCtrl.updateToolRequestStatus);
router.delete('/tool-requests/:id',            adminCtrl.deleteToolRequest);

// ── Properties & Bookings ──
router.get('/properties',           propCtrl.getAllProperties);
router.post('/properties',          propCtrl.createProperty);
router.put('/properties/:id',       propCtrl.updateProperty);
router.delete('/properties/:id',    propCtrl.deleteProperty);

router.get('/bookings',             bookCtrl.getAdminBookings);
router.put('/bookings/:id/status',  bookCtrl.updateBookingStatus);

// ── Merged SuperAdmin Routes (all now accessible to admin role) ──

// Master dashboard (full platform stats)
router.get('/super-dashboard',      authorize('superadmin'), adminCtrl.getSuperDashboard);

// Manage Admins
router.get('/admins',               authorize('superadmin'), adminCtrl.getAdmins);
router.post('/admins',              authorize('superadmin'), adminCtrl.createAdmin);
router.put('/admins/:id',           authorize('superadmin'), adminCtrl.updateAdmin);
router.delete('/admins/:id',        authorize('superadmin'), adminCtrl.deleteAdmin);

// All Users
router.get('/users',                authorize('superadmin'), adminCtrl.getAllUsers);

// Audit Logs
router.get('/audit-logs',           authorize('superadmin'), adminCtrl.getAuditLogs);

// Districts
router.get('/districts',            authorize('superadmin'), adminCtrl.getDistricts);
router.post('/districts',           authorize('superadmin'), adminCtrl.createDistrict);
router.put('/districts/:id',        authorize('superadmin'), adminCtrl.updateDistrict);

// All Payments (platform-wide)
router.get('/all-payments',         authorize('superadmin'), adminCtrl.getAllPayments);

// Broadcast
router.post('/broadcast',           authorize('superadmin'), adminCtrl.broadcast);

// Super export (CSV)
router.get('/super-export/:type', authorize('superadmin'), async (req, res, next) => {
  try {
    const superAdminService = require('../services/superAdminService');
    const type = req.params.type;
    let data = [];
    if (type === 'payments') {
      const result = await superAdminService.getPayments({ limit: 10000, page: 1 });
      data = result.payments || result || [];
    } else if (type === 'users') {
      const usersData = await superAdminService.getAllUsers({ limit: 10000, page: 1, type: 'customers' });
      data = usersData.users || [];
    } else {
      return next(require('../middleware/errorHandler').AppError('Invalid export type', 400));
    }
    const csv = jsonToCsv(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${type}_export_${Date.now()}.csv`);
    res.send(csv);
  } catch (err) { next(err); }
});

// ── Tools Orders ──
router.get('/tools-orders',          adminCtrl.getToolsOrders);
router.put('/tools-orders/:id',      adminCtrl.updateToolsOrderStatus);

// ── Contact Enquiries ──
router.get('/enquiries',             adminCtrl.getEnquiries);

// ── Services & Pricing ──
router.get('/services',              authorize('superadmin'), paCtrl.getServiceTypes);
router.post('/services',             authorize('superadmin'), paCtrl.createServiceType);
router.put('/services/:id',          authorize('superadmin'), paCtrl.updateServiceType);
router.delete('/services/:id',       authorize('superadmin'), paCtrl.deleteServiceType);

router.get('/tools',                 authorize('superadmin'), paCtrl.getTools);
router.post('/tools',                authorize('superadmin'), paCtrl.createTool);
router.put('/tools/:id',             authorize('superadmin'), paCtrl.updateTool);
router.delete('/tools/:id',          authorize('superadmin'), paCtrl.deleteTool);

router.get('/pricing-rules',         authorize('superadmin'), paCtrl.getPricingRules);
router.post('/pricing-rules',        authorize('superadmin'), paCtrl.createPricingRule);
router.put('/pricing-rules/:id',     authorize('superadmin'), paCtrl.updatePricingRule);
router.delete('/pricing-rules/:id',  authorize('superadmin'), paCtrl.deletePricingRule);

// ── Location Hierarchy ──
router.get('/blocks',                authorize('superadmin'), laCtrl.getBlocks);
router.post('/blocks',               authorize('superadmin'), laCtrl.createBlock);
router.put('/blocks/:id',            authorize('superadmin'), laCtrl.updateBlock);
router.delete('/blocks/:id',         authorize('superadmin'), laCtrl.deleteBlock);

router.get('/panchayats',            authorize('superadmin'), laCtrl.getPanchayats);
router.post('/panchayats',           authorize('superadmin'), laCtrl.createPanchayat);
router.put('/panchayats/:id',        authorize('superadmin'), laCtrl.updatePanchayat);
router.delete('/panchayats/:id',     authorize('superadmin'), laCtrl.deletePanchayat);

router.get('/villages',              authorize('superadmin'), laCtrl.getVillages);
router.post('/villages',             authorize('superadmin'), laCtrl.createVillage);
router.put('/villages/:id',          authorize('superadmin'), laCtrl.updateVillage);
router.delete('/villages/:id',       authorize('superadmin'), laCtrl.deleteVillage);

// ── RBAC (Roles & Permissions) ──
router.get('/roles',                 authorize('superadmin'), rbacCtrl.getRoles);
router.get('/roles/:id',             authorize('superadmin'), rbacCtrl.getRole);
router.post('/roles',                authorize('superadmin'), rbacCtrl.createRole);
router.put('/roles/:id',             authorize('superadmin'), rbacCtrl.updateRole);
router.delete('/roles/:id',          authorize('superadmin'), rbacCtrl.deleteRole);

router.get('/permissions',           authorize('superadmin'), rbacCtrl.getPermissions);
router.post('/permissions',          authorize('superadmin'), rbacCtrl.createPermission);

module.exports = router;
