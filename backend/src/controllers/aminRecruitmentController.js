const bcrypt = require('bcryptjs');
const service = require('../services/aminRecruitmentService');
const { AppError } = require('../middleware/errorHandler');

exports.apply = async (req, res, next) => {
  try {
    const files = req.files || {};
    
    // File size limits in MB
    const limits = {
      aadhaar_front: 3,
      aadhaar_back: 3,
      pan: 3,
      educational_certificate: 5,
      experience_certificate: 5,
      passport_photo: 2
    };

    // Validate sizes
    for (const [fieldname, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray[0]) {
        const file = fileArray[0];
        const maxMB = limits[fieldname];
        if (maxMB && file.size > maxMB * 1024 * 1024) {
          throw new AppError(`File size exceeds ${maxMB}MB limit for ${fieldname.replace('_', ' ')}.`, 400);
        }
      }
    }

    let password_hash = null;
    if (req.body.password) {
      password_hash = await bcrypt.hash(req.body.password, 10);
    }
    
    const payload = { ...req.body, password_hash };

    const result = await service.submitApplication(payload, files);
    res.status(201).json({
      success: true,
      message: 'Application Submitted Successfully',
      app_id: result.app_id
    });
  } catch (err) {
    next(err);
  }
};

exports.getApplication = async (req, res, next) => {
  try {
    const app = await service.getFullApplication(req.params.id);
    res.json({ success: true, application: app });
  } catch (err) {
    next(err);
  }
};
