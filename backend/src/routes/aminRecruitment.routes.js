const express = require('express');
const router = express.Router();
const controller = require('../controllers/aminRecruitmentController');
const upload = require('../middleware/upload');

router.post('/apply', upload.fields([
  { name: 'aadhaar_front', maxCount: 1 },
  { name: 'aadhaar_back', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'educational_certificate', maxCount: 1 },
  { name: 'experience_certificate', maxCount: 1 },
  { name: 'passport_photo', maxCount: 1 }
]), controller.apply);

router.get('/application/:id', controller.getApplication);

module.exports = router;
