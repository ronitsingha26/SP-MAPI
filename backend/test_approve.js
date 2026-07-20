const pool = require('./src/config/db');
const { v4: uuidv4 } = require('uuid');

async function test() {
  try {
    const result = await pool.query("SELECT * FROM amin_applications LIMIT 1");
    if (result.rows.length === 0) {
      console.log("No applications.");
      process.exit(0);
    }
    const app = result.rows[0];
    console.log("Testing approval for:", app.name);
    
    // Look up district
    let district_id = null;
    const distResult = await pool.query("SELECT id FROM districts WHERE name = ? LIMIT 1", [app.district]);
    if (distResult.rows.length > 0) district_id = distResult.rows[0].id;
    
    const license_number = `LIC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    console.log("Inserting into amins...");
    await pool.query(
      `INSERT INTO amins (id, name, mobile, email, password_hash, district_id, district_name, license_number, created_by)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), app.name, app.mobile, app.email || null, app.password_hash || null, district_id, app.district || null, license_number || null, null]
    );
    console.log("Success!");
  } catch (err) {
    console.error("Error during insertion:", err);
  } finally {
    process.exit(0);
  }
}

test();
