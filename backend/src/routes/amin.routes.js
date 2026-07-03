const express    = require('express');
const router     = express.Router();
const aminCtrl   = require('../controllers/aminController');
const { protect, authorize } = require('../middleware/auth');
const upload     = require('../middleware/upload');

router.use(protect, authorize('amin'));

// Dashboard
router.get('/dashboard',               aminCtrl.getDashboard);

// Assignments
router.get('/assignments',             aminCtrl.getAssignments);
router.put('/assignments/:id/accept',  aminCtrl.acceptAssignment);
router.put('/assignments/:id/reject',  aminCtrl.rejectAssignment);
router.put('/assignments/:id/start',   aminCtrl.startSurvey);
router.put('/assignments/:id/complete', aminCtrl.completeSurvey);

// Survey report
router.post('/assignments/:id/report',
  upload.fields([
    { name: 'final_report', maxCount: 1 },
    { name: 'map_pdf', maxCount: 1 },
    { name: 'photos', maxCount: 10 },
  ]),
  aminCtrl.submitSurveyReport
);

// Legacy task routes (backward compat)
router.get('/tasks',                   aminCtrl.getTasks);
router.put('/tasks/:id/status',        aminCtrl.updateTaskStatus);
router.post('/tasks/:id/upload',       upload.single('report'), aminCtrl.uploadReport);

module.exports = router;
