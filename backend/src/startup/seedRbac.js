const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const ROLES = [
  { name: 'superadmin', description: 'Full platform access' },
  { name: 'admin', description: 'District Admin' },
  { name: 'amin', description: 'Surveyor / Amin' },
  { name: 'customer', description: 'End User' }
];

const PERMISSIONS = [
  { name: 'manage_system', module: 'system' },
  { name: 'manage_users', module: 'users' },
  { name: 'manage_admins', module: 'users' },
  { name: 'manage_amins', module: 'users' },
  { name: 'view_all_applications', module: 'applications' },
  { name: 'view_district_applications', module: 'applications' },
  { name: 'update_application', module: 'applications' },
  { name: 'assign_amin', module: 'applications' },
  { name: 'upload_report', module: 'applications' },
  { name: 'view_payments', module: 'financials' }
];

async function seedRbac() {
  console.log('Checking RBAC setup...');
  
  // Create a raw connection from the pool wrapper we have
  // Wait, our db.js provides a simple wrapper. We can just use pool.query for everything since INSERT IGNORE handles duplicates.
  
  try {
    const roleIds = {};
    for (const r of ROLES) {
      const id = uuidv4();
      await pool.query('INSERT IGNORE INTO roles (id, name, description) VALUES (?, ?, ?)', [id, r.name, r.description]);
      
      const res = await pool.query('SELECT id FROM roles WHERE name = ?', [r.name]);
      roleIds[r.name] = res.rows[0].id;
    }

    const permIds = {};
    for (const p of PERMISSIONS) {
      const id = uuidv4();
      await pool.query('INSERT IGNORE INTO permissions (id, name, module) VALUES (?, ?, ?)', [id, p.name, p.module]);
      
      const res = await pool.query('SELECT id FROM permissions WHERE name = ?', [p.name]);
      permIds[p.name] = res.rows[0].id;
    }

    const assign = async (roleName, permName) => {
      if (roleIds[roleName] && permIds[permName]) {
        await pool.query('INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [roleIds[roleName], permIds[permName]]);
      }
    };

    // Super Admin gets everything
    for (const p of PERMISSIONS) {
      await assign('superadmin', p.name);
    }

    // Admin gets specific things
    await assign('admin', 'manage_users');
    await assign('admin', 'manage_amins');
    await assign('admin', 'view_district_applications');
    await assign('admin', 'update_application');
    await assign('admin', 'assign_amin');
    await assign('admin', 'view_payments');

    // Amin gets specific things
    await assign('amin', 'upload_report');
    await assign('amin', 'update_application');

    console.log('RBAC verified/seeded successfully.');
  } catch (err) {
    console.error('Error in seedRbac:', err.message);
  }
}

module.exports = seedRbac;
