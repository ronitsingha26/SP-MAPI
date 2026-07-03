const express    = require('express');
const router     = express.Router();
const miscCtrl   = require('../controllers/miscController');
const laCtrl     = require('../controllers/locationAdminController');
const propCtrl   = require('../controllers/propertyController');

// Public contact form submission
router.post('/', miscCtrl.submitEnquiry);
router.get('/districts', miscCtrl.getDistricts); // Or route this to laCtrl as well, but we'll leave it to miscCtrl if it already works

// Public location hierarchy endpoints
router.get('/blocks', laCtrl.getBlocks);
router.get('/panchayats', laCtrl.getPanchayats);
router.get('/villages', laCtrl.getVillages);

// Public properties endpoints
router.get('/properties', propCtrl.getAllProperties);
router.get('/properties/:id', propCtrl.getPropertyById);

module.exports = router;
// Removed duplicate routes
