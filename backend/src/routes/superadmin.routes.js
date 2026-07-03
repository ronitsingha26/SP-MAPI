const express   = require('express');
const router    = express.Router();
const saCtrl    = require('../controllers/superAdminController');
const paCtrl    = require('../controllers/pricingAdminController');
const laCtrl    = require('../controllers/locationAdminController');
const rbacCtrl  = require('../controllers/rbacController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('superadmin'));

router.get('/dashboard',       saCtrl.getDashboard);
router.get('/enquiries',       saCtrl.getEnquiries);
router.get('/admins',          saCtrl.getAdmins);
router.post('/admins',         saCtrl.createAdmin);
router.put('/admins/:id',      saCtrl.updateAdmin);
router.delete('/admins/:id',   saCtrl.deleteAdmin);
router.get('/users',           saCtrl.getAllUsers);
router.get('/audit-logs',      saCtrl.getAuditLogs);
router.get('/districts',       saCtrl.getDistricts);
router.post('/districts',      saCtrl.createDistrict);
router.put('/districts/:id',   saCtrl.updateDistrict);
router.get('/payments',        saCtrl.getPayments);
router.get('/export/:type',    saCtrl.exportData);

// --- Services & Pricing ---
router.get('/services',            paCtrl.getServiceTypes);
router.post('/services',           paCtrl.createServiceType);
router.put('/services/:id',        paCtrl.updateServiceType);
router.delete('/services/:id',     paCtrl.deleteServiceType);

router.get('/pricing-rules',       paCtrl.getPricingRules);
router.post('/pricing-rules',      paCtrl.createPricingRule);
router.put('/pricing-rules/:id',   paCtrl.updatePricingRule);
router.delete('/pricing-rules/:id',paCtrl.deletePricingRule);

// --- Location Hierarchy ---
router.get('/blocks',              laCtrl.getBlocks);
router.post('/blocks',             laCtrl.createBlock);
router.put('/blocks/:id',          laCtrl.updateBlock);
router.delete('/blocks/:id',       laCtrl.deleteBlock);

router.get('/panchayats',          laCtrl.getPanchayats);
router.post('/panchayats',         laCtrl.createPanchayat);
router.put('/panchayats/:id',      laCtrl.updatePanchayat);
router.delete('/panchayats/:id',   laCtrl.deletePanchayat);

router.get('/villages',            laCtrl.getVillages);
router.post('/villages',           laCtrl.createVillage);
router.put('/villages/:id',        laCtrl.updateVillage);
router.delete('/villages/:id',     laCtrl.deleteVillage);

// --- RBAC (Roles & Permissions) ---
router.get('/roles',               rbacCtrl.getRoles);
router.get('/roles/:id',           rbacCtrl.getRole);
router.post('/roles',              rbacCtrl.createRole);
router.put('/roles/:id',           rbacCtrl.updateRole);
router.delete('/roles/:id',        rbacCtrl.deleteRole);

router.get('/permissions',         rbacCtrl.getPermissions);
router.post('/permissions',        rbacCtrl.createPermission);

module.exports = router;

