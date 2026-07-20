const pool = require('../config/db');

async function patchDatabase() {
  console.log('Checking foreign keys...');
  
  try {
    // 1. Check if admins.created_by FK exists. If not, add it.
    try {
      const { rows: fkRows } = await pool.query(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'admins' 
          AND COLUMN_NAME = 'created_by' 
          AND REFERENCED_TABLE_NAME = 'admins';
      `);
      
      if (fkRows.length === 0) {
        await pool.query('ALTER TABLE admins ADD CONSTRAINT fk_admins_created_by FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL;');
        console.log('✅ Added fk_admins_created_by');
      } else {
        console.log('Foreign keys for admins already exist.');
      }
    } catch(e) {
      console.log('Could not add fk_admins_created_by:', e.message);
    }

    // 2. Check and fix invoices foreign keys. We want ON DELETE CASCADE/SET NULL.
    // If the old RESTRICT constraints exist, we drop them and add new ones.
    const { rows: invFkRows } = await pool.query(`
      SELECT CONSTRAINT_NAME, DELETE_RULE
      FROM information_schema.REFERENTIAL_CONSTRAINTS 
      WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'invoices';
    `);

    // Check if any invoice constraint is RESTRICT/NO ACTION, meaning they are the old un-patched ones.
    const needsPatch = invFkRows.some(row => row.DELETE_RULE === 'RESTRICT' || row.DELETE_RULE === 'NO ACTION');
    
    if (needsPatch) {
      // Drop all existing FKs on invoices
      const { rows: allKeys } = await pool.query(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'invoices' AND REFERENCED_TABLE_NAME IS NOT NULL;
      `);
      
      for (const row of allKeys) {
        await pool.query(`ALTER TABLE invoices DROP FOREIGN KEY ${row.CONSTRAINT_NAME}`);
      }

      // Add proper ones
      await pool.query('ALTER TABLE invoices ADD CONSTRAINT fk_inv_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE;');
      await pool.query('ALTER TABLE invoices ADD CONSTRAINT fk_inv_pay FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;');
      await pool.query('ALTER TABLE invoices ADD CONSTRAINT fk_inv_cust FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;');
      console.log('✅ Patched ON DELETE constraints for invoices');
    } else {
      console.log('Foreign keys for invoices are up to date.');
    }

  } catch (err) {
    console.error('Failed during patchDatabase:', err);
    // Non-fatal, just log it
  }
}

module.exports = patchDatabase;
