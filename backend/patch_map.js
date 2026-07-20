const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sp_mapi',
    port: process.env.DB_PORT || 3306
  });

  try {
    await connection.query('ALTER TABLE applications ADD COLUMN area_type VARCHAR(50) NULL AFTER no_of_days;');
    await connection.query('ALTER TABLE applications ADD COLUMN map_type VARCHAR(50) NULL AFTER area_type;');
    await connection.query('ALTER TABLE applications ADD COLUMN thana_municipal VARCHAR(100) NULL AFTER map_type;');
    await connection.query('ALTER TABLE applications ADD COLUMN mouja_ward VARCHAR(100) NULL AFTER thana_municipal;');
    await connection.query('ALTER TABLE applications ADD COLUMN no_of_sheets INT NULL AFTER mouja_ward;');
    console.log('Successfully added map columns');
  } catch (err) {
    console.log('Error (might already exist):', err.message);
  }

  await connection.end();
}
run();
