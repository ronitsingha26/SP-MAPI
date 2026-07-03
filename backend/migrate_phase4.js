const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');

async function migrate() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'db', 'phase4_migration.sql'), 'utf-8');
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    const conn = await db.getConnection();
    try {
      for (const stmt of statements) {
        if (stmt.trim()) {
          console.log('Executing:', stmt.substring(0, 50) + '...');
          await conn.query(stmt);
        }
      }
      console.log('Phase 4 migration completed successfully!');
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

migrate();
