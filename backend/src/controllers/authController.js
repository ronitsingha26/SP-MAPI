const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { token, user } = await authService.registerCustomer(req.body, req.ip);
    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { mobile, email, password } = req.body;
    const { token, user } = await authService.loginCustomer(mobile, email, password);
    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user, type } = await authService.adminLogin(email, password);
    return res.json({ success: true, message: `${type} login successful.`, token, user });
  } catch (err) {
    next(err);
  }
};

exports.aminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.aminLogin(email, password);
    return res.json({ success: true, message: 'Amin login successful.', token, user });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    await authService.logout(token);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id, req.user.role);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
