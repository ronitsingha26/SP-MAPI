const pool = require('./src/config/db');

async function patch() {
  try {
    console.log("Creating amin_applications table if it doesn't exist...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS amin_applications (
        id VARCHAR(36) PRIMARY KEY,
        app_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        father_name VARCHAR(100) NULL,
        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        dob DATE NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        block_name VARCHAR(100) NOT NULL,
        village VARCHAR(100) NOT NULL,
        pin_code VARCHAR(10) NOT NULL,
        highest_qualification VARCHAR(100) NOT NULL,
        experience_years INT DEFAULT 0,
        previous_organization VARCHAR(255),
        documents JSON,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        admin_remark TEXT,
        password_hash VARCHAR(255) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_amin_app_mobile (mobile),
        INDEX idx_amin_app_email (email),
        INDEX idx_amin_app_id (app_id)
      )
    `);
    console.log("Table created.");
  } catch (err) {
    console.error(err);
  }
  process.exit();
}
patch();
