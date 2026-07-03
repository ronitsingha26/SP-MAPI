const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await pool.query("ALTER TABLE tool_requests ADD COLUMN payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid';");
    console.log("Added payment_status");
  } catch(e) { console.log(e.message) }

  try {
    await pool.query("ALTER TABLE tool_requests ADD COLUMN payment_required DECIMAL(10,2) DEFAULT 0.00;");
    console.log("Added payment_required");
  } catch(e) { console.log(e.message) }
  
  process.exit();
}
run();
