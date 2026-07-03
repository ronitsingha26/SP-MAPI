const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME     || 'spmapi_db',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create a wrapper to make it slightly more compatible with existing pg-like queries where possible
// Note: We still need to rewrite queries from $1, $2 to ? and handle RETURNING separately.
const db = {
  async query(sql, params) {
    const [rows, fields] = await pool.query(sql, params);
    return { rows, fields, rowCount: rows.length || rows.affectedRows };
  },
  async getConnection() {
    const conn = await pool.getConnection();
    // Wrapper for connection
    const originalQuery = conn.query.bind(conn);
    const originalExecute = conn.execute.bind(conn);
    
    return {
      async query(sql, params) {
        const [rows, fields] = await originalQuery(sql, params);
        return { rows, fields, rowCount: rows.length || rows.affectedRows };
      },
      async release() {
        conn.release();
      },
      // mysql2 uses beginTransaction, commit, rollback
      async beginTransaction() {
        await conn.beginTransaction();
      },
      async commit() {
        await conn.commit();
      },
      async rollback() {
        await conn.rollback();
      }
    };
  }
};

// Test connection on startup
(async () => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('[DB] ✅ MySQL connected at', rows[0].now);
  } catch (err) {
    console.error('[DB] ❌ Connection failed:', err.message);
  }
})();

module.exports = db;
