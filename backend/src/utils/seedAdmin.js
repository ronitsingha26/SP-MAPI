#!/usr/bin/env node
/**
 * Seed Super Admin account
 * Run: node src/utils/seedAdmin.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('../config/db');
const { v4: uuidv4 } = require('uuid');

async function seedSuperAdmin() {
  const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SUPER_ADMIN_NAME, SUPER_ADMIN_MOBILE } = process.env;

  if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
    console.error('❌ Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  try {
    const checkResult = await pool.query(
      'SELECT id FROM super_admins WHERE email=?', [SUPER_ADMIN_EMAIL]
    );

    if (checkResult.rows.length === 0) {
      const id = uuidv4();
      const password_hash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);
      
      await pool.query(
        `INSERT INTO super_admins (id, name, email, password_hash, mobile)
         VALUES (?,?,?,?,?)`,
        [id, SUPER_ADMIN_NAME || 'Super Admin', SUPER_ADMIN_EMAIL, password_hash, SUPER_ADMIN_MOBILE || '9999999999']
      );
      console.log('✅ Super admin seeded:', SUPER_ADMIN_EMAIL);
      console.log('   Password:', SUPER_ADMIN_PASSWORD, '← CHANGE AFTER FIRST LOGIN');
    } else {
      console.log('ℹ️  Super admin already exists:', SUPER_ADMIN_EMAIL);
    }
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  }
  process.exit(0);
}

seedSuperAdmin();
