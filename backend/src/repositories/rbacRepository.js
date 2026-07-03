const pool = require('../config/db');

class RbacRepository {
  // --- Roles ---
  async getRoles() {
    const result = await pool.query('SELECT * FROM roles ORDER BY name ASC');
    return result.rows;
  }

  async getRoleById(id) {
    const result = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
    return result.rows[0];
  }

  async createRole(id, name, description) {
    await pool.query('INSERT INTO roles (id, name, description) VALUES (?, ?, ?)', [id, name, description]);
    return await this.getRoleById(id);
  }

  async updateRole(id, name, description) {
    await pool.query('UPDATE roles SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?', [name, description, id]);
    return await this.getRoleById(id);
  }

  async deleteRole(id) {
    await pool.query('DELETE FROM roles WHERE id = ?', [id]);
  }

  // --- Permissions ---
  async getPermissions() {
    const result = await pool.query('SELECT * FROM permissions ORDER BY module, name');
    return result.rows;
  }

  async getPermissionById(id) {
    const result = await pool.query('SELECT * FROM permissions WHERE id = ?', [id]);
    return result.rows[0];
  }

  async createPermission(id, name, module) {
    await pool.query('INSERT INTO permissions (id, name, module) VALUES (?, ?, ?)', [id, name, module]);
    return await this.getPermissionById(id);
  }

  // --- Role Permissions ---
  async getPermissionsForRole(roleId) {
    const result = await pool.query(`
      SELECT p.* 
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `, [roleId]);
    return result.rows;
  }

  async assignPermissionToRole(roleId, permissionId, client = pool) {
    await client.query('INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [roleId, permissionId]);
  }

  async removePermissionFromRole(roleId, permissionId, client = pool) {
    await client.query('DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?', [roleId, permissionId]);
  }

  async clearPermissionsForRole(roleId, client = pool) {
    await client.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);
  }
}

module.exports = new RbacRepository();
