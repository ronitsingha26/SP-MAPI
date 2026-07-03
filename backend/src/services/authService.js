const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const userRepository = require('../repositories/userRepository');
const { signToken } = require('../middleware/auth');
const pool = require('../config/db'); // for audit logs and blacklist for now
const { AppError } = require('../middleware/errorHandler');
const { ErrorCodes } = require('../utils/errorCodes');

class AuthService {
  async registerCustomer(data, ipAddress) {
    const {
      name, father_name, mobile, email, password,
      state, district, block, village, ward_number, panchayat,
      mouza, police_station, pincode, address, aadhaar_number
    } = data;
    const password_hash = await bcrypt.hash(password, 12);
    const id = uuidv4();

    const user = await userRepository.createCustomer({
      id, name, father_name, mobile, email, password_hash,
      state, district, block, village, ward_number, panchayat,
      mouza, police_station, pincode, address, aadhaar_number
    });

    const token = signToken({ id: user.id, role: 'customer', name: user.name, email: user.email });

    await pool.query(
      `INSERT INTO audit_logs (actor_id, actor_type, actor_name, action, entity_type, entity_id, ip_address)
       VALUES (?,'customer',?,'CUSTOMER_REGISTERED','customer',?,?)`,
      [user.id, user.name, user.id, ipAddress]
    );

    return { token, user };
  }

  async loginCustomer(mobile, email, password) {
    const user = await userRepository.findCustomerByMobileOrEmail(mobile, email);
    if (!user) throw new AppError('Invalid credentials.', 401);
    if (user.status === 'blocked') throw new AppError('Your account has been blocked. Contact support.', 403);

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) throw new AppError('Invalid credentials.', 401);

    await userRepository.updateCustomerLastLogin(user.id);
    const token = signToken({ id: user.id, role: 'customer', name: user.name, email: user.email });

    const { password_hash, otp_code, otp_expires_at, aadhaar_number, ...safeUser } = user;
    return { token, user: safeUser };
  }

  async adminLogin(email, password) {
    // Check super_admins first
    const sa = await userRepository.findSuperAdminByEmail(email);
    if (sa) {
      const match = await bcrypt.compare(password, sa.password_hash);
      if (!match) throw new AppError('Invalid credentials.', 401);

      await userRepository.updateLastLogin('super_admins', sa.id);
      const token = signToken({ id: sa.id, role: 'superadmin', name: sa.name, email: sa.email });
      const { password_hash, ...safeUser } = sa;
      return { token, user: { ...safeUser, role: 'superadmin' }, type: 'Super Admin' };
    }

    // Check admins
    const admin = await userRepository.findAdminByEmail(email);
    if (!admin) throw new AppError('Invalid credentials.', 401);

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) throw new AppError('Invalid credentials.', 401);

    await userRepository.updateLastLogin('admins', admin.id);
    const token = signToken({ id: admin.id, role: 'admin', name: admin.name, email: admin.email });
    const { password_hash, ...safeAdmin } = admin;
    return { token, user: { ...safeAdmin, role: 'admin' }, type: 'Admin' };
  }

  async aminLogin(mobile, password) {
    const amin = await userRepository.findAminByMobile(mobile);
    if (!amin) throw new AppError('Invalid credentials.', 401);

    const match = await bcrypt.compare(password, amin.password_hash);
    if (!match) throw new AppError('Invalid credentials.', 401);

    await userRepository.updateLastLogin('amins', amin.id);
    const token = signToken({ id: amin.id, role: 'amin', name: amin.name, mobile: amin.mobile });
    const { password_hash, ...safeAmin } = amin;
    return { token, user: { ...safeAmin, role: 'amin' } };
  }

  async logout(token) {
    if (token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7d
      await pool.query(
        'INSERT IGNORE INTO token_blacklist (token_hash, expires_at) VALUES (?, ?)',
        [tokenHash, expiresAt]
      );
    }
  }

  async getMe(id, role) {
    let query, result;

    if (role === 'customer') {
      result = await pool.query(
        `SELECT id, customer_id_display, name, father_name, mobile, email,
                state, district, block, village, ward_number, panchayat,
                mouza, police_station, pincode, address,
                status, is_email_verified, is_mobile_verified,
                profile_photo_url, primary_app_id, created_at
         FROM customers WHERE id=?`,
        [id]
      );
    } else if (role === 'admin') {
      result = await pool.query(
        `SELECT a.id,a.name,a.email,a.mobile,a.status,a.last_login_at,a.created_at,
                JSON_ARRAYAGG(d.name) AS districts
         FROM admins a
         LEFT JOIN admin_districts ad ON a.id = ad.admin_id
         LEFT JOIN districts d ON ad.district_id = d.id
         WHERE a.id=? GROUP BY a.id`,
        [id]
      );
    } else if (role === 'amin') {
      result = await pool.query(
        'SELECT id,name,mobile,email,district_name,license_number,status,tasks_completed,active_tasks,rating FROM amins WHERE id=?',
        [id]
      );
    } else if (role === 'superadmin') {
      result = await pool.query(
        'SELECT id,name,email,mobile,is_active,last_login_at,created_at FROM super_admins WHERE id=?',
        [id]
      );
    }

    const user = result?.rows[0];
    if (!user) throw new AppError('User not found.', 404);
    return { ...user, role };
  }
}

module.exports = new AuthService();
