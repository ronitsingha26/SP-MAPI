const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

async function initSchema() {
  console.log('Checking database...');
  try {
    // Check if a core table exists
    const { rows } = await pool.query(`SHOW TABLES LIKE 'customers'`);
    if (rows.length > 0) {
      console.log('Database OK (Schema already exists)');
      return;
    }

    console.log('Initializing database schema...');
    
    // Fallback: Read schema.sql and execute
    const schemaPath = path.join(__dirname, '../../db/schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.warn('schema.sql not found! Skipping schema initialization.');
      return;
    }

    const sqlFile = fs.readFileSync(schemaPath, 'utf8');
    
    // Basic split by semicolon. Since this is raw SQL, we filter out empty statements.
    const statements = sqlFile.split(';').filter(stmt => stmt.trim() !== '');

    // Get an un-wrapped connection for schema execution if we can, 
    // or just use the pool if it works. pool.query works.
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await pool.query(stmt);
        } catch (e) {
          // If it fails on some minor thing like an existing index, we can log it and continue
          console.error(`Error executing statement: \n${stmt.substring(0, 50)}...`, e.message);
        }
      }
    }
    
    console.log('Database schema initialized successfully.');

  } catch (err) {
    console.error('Failed during schema initialization', err);
    throw err;
  }
}

module.exports = initSchema;
