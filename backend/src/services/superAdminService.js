const superAdminRepository = require('../repositories/superAdminRepository');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

class SuperAdminService {
  async getDashboard() {
    return await superAdminRepository.getDashboardStats();
  }

  async getAdmins() {
    const admins = await superAdminRepository.getAdmins();
    return admins.map(admin => {
      admin.districts = Array.isArray(admin.districts) ? admin.districts.filter(Boolean) : [];
      return admin;
    });
  }

  async createAdmin(data, superAdmin) {
    const client = await pool.getConnection();
    try {
      await client.beginTransaction();
      const { name, email, mobile, password, districts = [] } = data;
      
      const password_hash = await bcrypt.hash(password, 12);
      const id = uuidv4();

      const admin = await superAdminRepository.createAdmin(id, name, email, password_hash, mobile, superAdmin.id, client);

      for (const districtName of districts) {
        await superAdminRepository.assignAdminDistrict(admin.id, districtName, client);
      }

      await superAdminRepository.logAudit(superAdmin.id, superAdmin.name, 'ADMIN_CREATED', 'admin', admin.id, superAdmin.ip, client);

      await client.commit();
      const { password_hash: _ph, ...safeAdmin } = admin;
      return safeAdmin;
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      await client.release();
    }
  }

  async updateAdmin(id, data) {
    const client = await pool.getConnection();
    try {
      await client.beginTransaction();
      const { name, mobile, status, districts = [] } = data;

      await superAdminRepository.updateAdmin(id, name, mobile, status, client);

      if (districts.length > 0) {
        await superAdminRepository.clearAdminDistricts(id, client);
        for (const districtName of districts) {
          await superAdminRepository.assignAdminDistrict(id, districtName, client);
        }
      }

      await client.commit();
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      await client.release();
    }
  }

  async deleteAdmin(id, superAdmin) {
    await superAdminRepository.deleteAdmin(id);
    await superAdminRepository.logAudit(superAdmin.id, superAdmin.name, 'ADMIN_DELETED', 'admin', id, superAdmin.ip);
  }

  async getAllUsers(query) {
    const { type = 'customers', page = 1, limit = 30, search } = query;
    const offset = (page - 1) * limit;
    const users = await superAdminRepository.getAllUsers(type, search, limit, offset);
    return { users, type };
  }

  async getAuditLogs(query) {
    const { page = 1, limit = 50 } = query;
    const offset = (page - 1) * limit;
    return await superAdminRepository.getAuditLogs(limit, offset);
  }

  async getDistricts() {
    return await superAdminRepository.getDistricts();
  }

  async createDistrict(data, superAdmin) {
    const { name, state = 'Bihar' } = data;
    await superAdminRepository.createDistrict(name.trim(), state.trim());
    await superAdminRepository.logAudit(superAdmin.id, superAdmin.name, 'DISTRICT_CREATED', 'district', null, superAdmin.ip);
  }

  async updateDistrict(id, data, superAdmin) {
    const { name, state, is_active } = data;
    await superAdminRepository.updateDistrict(id, name, state, is_active);
    await superAdminRepository.logAudit(superAdmin.id, superAdmin.name, 'DISTRICT_UPDATED', 'district', id, superAdmin.ip);
  }

  async getPayments(query) {
    const { page = 1, limit = 30 } = query;
    const offset = (page - 1) * limit;
    return await superAdminRepository.getPayments(limit, offset);
  }
}

module.exports = new SuperAdminService();
