const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const TOOLS = [
  { name: 'Book / किताब', icon: '📕', price: 100 },
  { name: 'Guniya / गुनिया', icon: '📐', price: 100 },
  { name: 'Drafting Compass / ड्राफ्टिंग कम्पास', icon: '🧭', price: 100 },
  { name: 'Tape / फीता', icon: '📏', price: 100 },
  { name: 'Chain / कड़ी', icon: '⛓️', price: 100 },
  { name: 'Feet / फीट', icon: '📏', price: 100 },
  { name: 'Taak / टाँका', icon: '📍', price: 100 },
  { name: 'Pencil, Pen / पेन्सिल, पेन', icon: '✏️', price: 100 },
  { name: 'Scale / स्केल', icon: '📏', price: 100 },
  { name: 'Jhanda / झंडा', icon: '🚩', price: 100 },
  { name: 'Diagonal Scale / विकर्ण मापक', icon: '📐', price: 100 },
  { name: 'ETS Machine / ETS मशीन', icon: '🔭', price: 100 },
];

async function seedTools() {
  console.log('Checking tools inventory...');
  try {
    const { rows: existingTools } = await pool.query('SELECT name FROM tools_inventory');
    const existingNames = existingTools.map(t => t.name);

    // If the table is completely empty, insert everything
    if (existingNames.length === 0) {
      for (const t of TOOLS) {
        await pool.query(
          'INSERT INTO tools_inventory (id, name, description, stock_quantity, rental_price, is_active) VALUES (?, ?, ?, ?, ?, ?)',
          [uuidv4(), t.name, t.icon + ' ' + t.name, 100, t.price, true]
        );
        console.log(`Added tool: ${t.name}`);
      }
    } else {
      // If table has tools, ensure these specific ones exist
      for (const t of TOOLS) {
        if (!existingNames.includes(t.name)) {
          await pool.query(
            'INSERT INTO tools_inventory (id, name, description, stock_quantity, rental_price, is_active) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), t.name, t.icon + ' ' + t.name, 100, t.price, true]
          );
          console.log(`Added missing tool: ${t.name}`);
        } else {
          // You could optionally update prices here, but the user requested: 
          // "bad me admin khud se update kar lega" (admin will update it later).
          // Overwriting here on every boot would destroy admin's manual price changes.
          // So we safely skip.
        }
      }
      console.log('Tools inventory verified.');
    }
  } catch (err) {
    console.error('Error in seedTools:', err.message);
  }
}

module.exports = seedTools;
