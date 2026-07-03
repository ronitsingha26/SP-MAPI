require('dotenv').config();
const pool = require('./src/config/db');
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

async function seed() {
  const client = await pool.getConnection();
  try {
    await client.beginTransaction();

    console.log('Seeding Roles...');
    const roleIds = {};
    for (const r of ROLES) {
      const id = uuidv4();
      await client.query('INSERT IGNORE INTO roles (id, name, description) VALUES (?, ?, ?)', [id, r.name, r.description]);
      
      const res = await client.query('SELECT id FROM roles WHERE name = ?', [r.name]);
      roleIds[r.name] = res.rows[0].id;
    }

    console.log('Seeding Permissions...');
    const permIds = {};
    for (const p of PERMISSIONS) {
      const id = uuidv4();
      await client.query('INSERT IGNORE INTO permissions (id, name, module) VALUES (?, ?, ?)', [id, p.name, p.module]);
      
      const res = await client.query('SELECT id FROM permissions WHERE name = ?', [p.name]);
      permIds[p.name] = res.rows[0].id;
    }

    console.log('Assigning Permissions to Roles...');
    const assign = async (roleName, permName) => {
      await client.query('INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [roleIds[roleName], permIds[permName]]);
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

    await client.commit();
    console.log('RBAC Seeding Complete!');
  } catch (err) {
    await client.rollback();
    console.error('Error seeding:', err);
  } finally {
    await client.release();
    process.exit(0);
  }
}

seed();
