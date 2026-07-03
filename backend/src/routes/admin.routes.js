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

// All admin routes require authentication + admin OR superadmin role
router.use(protect, authorize('admin', 'superadmin'));

// ── Core Admin Routes ──
router.get('/dashboard',                       adminCtrl.getDashboard);
router.get('/applications',                    adminCtrl.getApplications);
router.put('/applications/:id/status',         adminCtrl.updateApplicationStatus);
router.post('/applications/:id/assign-amin',   adminCtrl.assignAmin);
router.get('/applications/:id/timeline',       adminCtrl.getApplicationTimeline);
router.get('/customers',                       adminCtrl.getCustomers);
router.get('/amins',                           adminCtrl.getAmins);
router.post('/amins',                          adminCtrl.createAmin);
router.put('/amins/:id',                       adminCtrl.updateAmin);
router.delete('/amins/:id',                    adminCtrl.deleteAmin);
router.get('/payments',                        adminCtrl.getPayments);
router.get('/enquiries',                       adminCtrl.getEnquiries);
router.get('/export/:type',                    adminCtrl.exportData);

// ── Tool Requests Management ──
router.get('/tool-requests',                   adminCtrl.getToolRequests);
router.put('/tool-requests/:id/status',        adminCtrl.updateToolRequestStatus);

// ── Properties & Bookings ──
router.get('/properties',           propCtrl.getAllProperties);
router.post('/properties',          propCtrl.createProperty);
router.put('/properties/:id',       propCtrl.updateProperty);
router.delete('/properties/:id',    propCtrl.deleteProperty);

router.get('/bookings',             bookCtrl.getAdminBookings);
router.put('/bookings/:id/status',  bookCtrl.updateBookingStatus);

// ── Merged SuperAdmin Routes (all now accessible to admin role) ──

// Master dashboard (full platform stats)
router.get('/super-dashboard',      adminCtrl.getSuperDashboard);

// Manage Admins
router.get('/admins',               adminCtrl.getAdmins);
router.post('/admins',              adminCtrl.createAdmin);
router.put('/admins/:id',           adminCtrl.updateAdmin);
router.delete('/admins/:id',        adminCtrl.deleteAdmin);

// All Users
router.get('/users',                adminCtrl.getAllUsers);

// Audit Logs
router.get('/audit-logs',           adminCtrl.getAuditLogs);

// Districts
router.get('/districts',            adminCtrl.getDistricts);
router.post('/districts',           adminCtrl.createDistrict);
router.put('/districts/:id',        adminCtrl.updateDistrict);

// All Payments (platform-wide)
router.get('/all-payments',         adminCtrl.getAllPayments);

// Broadcast
router.post('/broadcast',           adminCtrl.broadcast);

// Super export (CSV)
router.get('/super-export/:type', async (req, res, next) => {
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
router.get('/services',              paCtrl.getServiceTypes);
router.post('/services',             paCtrl.createServiceType);
router.put('/services/:id',          paCtrl.updateServiceType);
router.delete('/services/:id',       paCtrl.deleteServiceType);

router.get('/tools',                 paCtrl.getTools);
router.post('/tools',                paCtrl.createTool);
router.put('/tools/:id',             paCtrl.updateTool);
router.delete('/tools/:id',          paCtrl.deleteTool);

router.get('/pricing-rules',         paCtrl.getPricingRules);
router.post('/pricing-rules',        paCtrl.createPricingRule);
router.put('/pricing-rules/:id',     paCtrl.updatePricingRule);
router.delete('/pricing-rules/:id',  paCtrl.deletePricingRule);

// ── Location Hierarchy ──
router.get('/blocks',                laCtrl.getBlocks);
router.post('/blocks',               laCtrl.createBlock);
router.put('/blocks/:id',            laCtrl.updateBlock);
router.delete('/blocks/:id',         laCtrl.deleteBlock);

router.get('/panchayats',            laCtrl.getPanchayats);
router.post('/panchayats',           laCtrl.createPanchayat);
router.put('/panchayats/:id',        laCtrl.updatePanchayat);
router.delete('/panchayats/:id',     laCtrl.deletePanchayat);

router.get('/villages',              laCtrl.getVillages);
router.post('/villages',             laCtrl.createVillage);
router.put('/villages/:id',          laCtrl.updateVillage);
router.delete('/villages/:id',       laCtrl.deleteVillage);

// ── RBAC (Roles & Permissions) ──
router.get('/roles',                 rbacCtrl.getRoles);
router.get('/roles/:id',             rbacCtrl.getRole);
router.post('/roles',                rbacCtrl.createRole);
router.put('/roles/:id',             rbacCtrl.updateRole);
router.delete('/roles/:id',          rbacCtrl.deleteRole);

router.get('/permissions',           rbacCtrl.getPermissions);
router.post('/permissions',          rbacCtrl.createPermission);

module.exports = router;
