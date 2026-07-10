const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sp_mapi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('Creating properties table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        district VARCHAR(100) NOT NULL,
        block_name VARCHAR(100) NOT NULL,
        area_sqft DECIMAL(10,2) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        plot_type ENUM('residential', 'commercial', 'agricultural') DEFAULT 'residential',
        status ENUM('available', 'booked', 'sold') DEFAULT 'available',
        images JSON,
        admin_id VARCHAR(36),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
        INDEX idx_prop_dist (district),
        INDEX idx_prop_status (status)
      );
    `);
    console.log('Created properties table.');

    console.log('Creating bookings table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36) NOT NULL,
        property_id VARCHAR(36) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        INDEX idx_booking_cust (customer_id),
        INDEX idx_booking_prop (property_id)
      );
    `);
    console.log('Created bookings table.');

    console.log('Creating amin_applications table...');
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
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_amin_app_mobile (mobile),
        INDEX idx_amin_app_email (email),
        INDEX idx_amin_app_id (app_id)
      );
    `);
    console.log('Created amin_applications table.');

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
