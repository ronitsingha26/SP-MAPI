require('dotenv').config({ path: './backend/.env' });
const pool = require('./backend/src/config/db.js');
pool.query('SELECT COUNT(*) as c FROM blocks').then(res => { 
  console.log('Blocks:', res.rows[0].c); 
  process.exit(0); 
}).catch(e => { console.error(e); process.exit(1); });
