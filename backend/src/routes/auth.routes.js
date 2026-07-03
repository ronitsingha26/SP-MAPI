const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { 
  registerValidator, 
  loginValidator, 
  adminLoginValidator, 
  aminLoginValidator 
} = require('../validators/auth.validator');

router.post('/register',      validate(registerValidator), auth.register);
router.post('/login',         validate(loginValidator), auth.login);
router.post('/admin/login',   validate(adminLoginValidator), auth.adminLogin);
router.post('/amin/login',    validate(aminLoginValidator), auth.aminLogin);
router.post('/logout',        protect, auth.logout);
router.get('/me',             protect, auth.getMe);

module.exports = router;
