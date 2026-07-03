const rbacRepository = require('../repositories/rbacRepository');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middleware/errorHandler');
const pool = require('../config/db');

class RbacService {
  async getRoles() {
    return await rbacRepository.getRoles();
  }

  async getRole(id) {
    const role = await rbacRepository.getRoleById(id);
    if (!role) throw new AppError('Role not found', 404);
    const permissions = await rbacRepository.getPermissionsForRole(id);
    return { ...role, permissions };
  }

  async createRole(data) {
    const { name, description, permissions = [] } = data;
    if (!name) throw new AppError('Role name is required', 400);

    const client = await pool.getConnection();
    try {
      await client.beginTransaction();
      
      const id = uuidv4();
      const role = await rbacRepository.createRole(id, name, description, client);

      for (const permId of permissions) {
        await rbacRepository.assignPermissionToRole(id, permId, client);
      }

      await client.commit();
      return role;
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      await client.release();
    }
  }

  async updateRole(id, data) {
    const { name, description, permissions } = data;
    const client = await pool.getConnection();
    try {
      await client.beginTransaction();
      
      const role = await rbacRepository.updateRole(id, name, description, client);
      if (!role) throw new AppError('Role not found', 404);

      if (permissions !== undefined) {
        await rbacRepository.clearPermissionsForRole(id, client);
        for (const permId of permissions) {
          await rbacRepository.assignPermissionToRole(id, permId, client);
        }
      }

      await client.commit();
      return role;
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      await client.release();
    }
  }

  async deleteRole(id) {
    const role = await rbacRepository.getRoleById(id);
    if (!role) throw new AppError('Role not found', 404);
    await rbacRepository.deleteRole(id);
  }

  async getPermissions() {
    return await rbacRepository.getPermissions();
  }

  async createPermission(data) {
    const { name, module } = data;
    if (!name || !module) throw new AppError('Name and module are required', 400);
    const id = uuidv4();
    return await rbacRepository.createPermission(id, name, module);
  }
}

module.exports = new RbacService();
