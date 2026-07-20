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
    console.log('Renaming mouza to mouja in customers...');
    await connection.query('ALTER TABLE customers CHANGE mouza mouja VARCHAR(100) NULL;');
    console.log('Successfully renamed in customers');
  } catch (err) {
    console.log('Error in customers (might already be renamed):', err.message);
  }

  try {
    console.log('Renaming mouza_name to mouja_name in applications...');
    await connection.query('ALTER TABLE applications CHANGE mouza_name mouja_name VARCHAR(100) NULL;');
    console.log('Successfully renamed in applications');
  } catch (err) {
    console.log('Error in applications (might already be renamed):', err.message);
  }

  await connection.end();
}
run();
