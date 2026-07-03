const express = require('express');
const router = express.Router();
const notificationCtrl = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect); // Any authenticated user can access their notifications

router.get('/', notificationCtrl.getNotifications);
router.put('/read-all', notificationCtrl.markAllAsRead);
router.put('/:id/read', notificationCtrl.markAsRead);

module.exports = router;
