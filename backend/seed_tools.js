const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config(); // it will use backend/.env since we run it in backend

const TOOLS = [
  { name: 'Survey Book', icon: '📕', price: 0 },
  { name: 'Compass', icon: '🧭', price: 0 },
  { name: 'Chain', icon: '⛓️', price: 0 },
  { name: 'Measuring Tape', icon: '📏', price: 0 },
  { name: 'Scale', icon: '📐', price: 0 },
  { name: 'Diagonal Scale', icon: '📐', price: 0 },
  { name: 'Feet Scale', icon: '📏', price: 0 },
  { name: 'Pencil', icon: '✏️', price: 0 },
  { name: 'Pen', icon: '🖊️', price: 0 },
  { name: 'ETS Machine', icon: '🔭', price: 0 },
  { name: 'GPS Device', icon: '📡', price: 0 },
  { name: 'Tripod', icon: '🔩', price: 0 },
  { name: 'Other', icon: '🛠️', price: 0 },
];

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  for (const t of TOOLS) {
    const [rows] = await pool.query('SELECT id FROM tools_inventory WHERE name = ?', [t.name]);
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO tools_inventory (id, name, description, stock_quantity, rental_price, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), t.name, t.icon + ' ' + t.name, 100, t.price, true]
      );
      console.log('Inserted:', t.name);
    } else {
      console.log('Already exists:', t.name);
    }
  }
  process.exit();
}
seed().catch(console.error);
