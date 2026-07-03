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
    console.log('Adding block_id to applications...');
    await connection.query('ALTER TABLE applications ADD COLUMN block_id INT NULL AFTER block_name;');
    console.log('Successfully added block_id');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('block_id already exists.');
    } else {
      console.error(err);
    }
  }

  await connection.end();
}
run();
