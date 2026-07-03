require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function migrate() {
  const sqlFilePath = path.join(__dirname, 'db', 'phase3_migration.sql');
  const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

  // Split by semicolon, but ignore empty statements
  const queries = sqlScript.split(';').map(q => q.trim()).filter(q => q.length > 0);

  const client = await pool.getConnection();
  try {
    await client.beginTransaction();
    console.log('Running Phase 3 DB Migration...');
    for (let i = 0; i < queries.length; i++) {
      console.log(`Executing query ${i+1}/${queries.length}...`);
      await client.query(queries[i]);
    }
    await client.commit();
    console.log('Migration completed successfully!');
  } catch (err) {
    await client.rollback();
    console.error('Migration failed:', err);
  } finally {
    await client.release();
    process.exit(0);
  }
}

migrate();
