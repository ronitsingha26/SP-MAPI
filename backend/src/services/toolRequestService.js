const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const activityLogService = require('./activityLogService');

class ToolRequestService {
  generateAppId() {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `TOOLS-${dateStr}-${rand}`;
  }

  async createToolRequest(customer_id, tools, remarks) {
    const id = uuidv4();
    const app_id = this.generateAppId();

    // Calculate total price
    let total_price = 0;
    const { rows: inventoryRows } = await pool.query('SELECT name, rental_price FROM tools_inventory');
    const inventoryMap = {};
    inventoryRows.forEach(row => {
      inventoryMap[row.name] = Number(row.rental_price) || 0;
    });

    tools.forEach(t => {
      const pricePerUnit = inventoryMap[t.name] || 0;
      total_price += (pricePerUnit * (t.quantity || 1));
    });

    await pool.query(
      `INSERT INTO tool_requests (id, app_id, customer_id, tools, remarks, payment_required)
       VALUES (?,?,?,?,?,?)`,
      [id, app_id, customer_id, JSON.stringify(tools), remarks || null, total_price]
    );

    // Log activity
    await activityLogService.log({
      tool_request_id: id,
      action: 'TOOL_REQUEST_SUBMITTED',
      performed_by: customer_id,
      performer_type: 'customer',
      new_status: 'pending',
      remarks: `Tool request submitted: ${tools.map(t => `${t.name} x${t.quantity}`).join(', ')}`
    });

    return { id, app_id };
  }

  async getToolRequestsByCustomer(customer_id) {
    const result = await pool.query(
      `SELECT id, app_id, tools, remarks, status, admin_remark, created_at, updated_at
       FROM tool_requests
       WHERE customer_id = ?
       ORDER BY created_at DESC`,
      [customer_id]
    );
    return result.rows;
  }

  async getAllToolRequests(filters = {}) {
    let query = `SELECT tr.*, c.name AS customer_name, c.mobile AS customer_mobile, c.district AS customer_district,
                 c.address AS customer_address, c.block AS customer_block, c.village AS customer_village
                 FROM tool_requests tr
                 LEFT JOIN customers c ON tr.customer_id = c.id
                 WHERE 1=1`;
    const params = [];

    if (filters.status) {
      query += ` AND tr.status = ?`;
      params.push(filters.status);
    }

    query += ` ORDER BY tr.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  async updateToolRequestStatus(id, status, admin_remark, admin_id) {
    const oldResult = await pool.query('SELECT status FROM tool_requests WHERE id = ?', [id]);
    const oldStatus = oldResult.rows[0]?.status;

    await pool.query(
      `UPDATE tool_requests SET status = ?, admin_remark = ?, processed_by = ?, processed_at = NOW() WHERE id = ?`,
      [status, admin_remark || null, admin_id, id]
    );

    // Log activity
    await activityLogService.log({
      tool_request_id: id,
      action: `TOOL_REQUEST_${status.toUpperCase()}`,
      performed_by: admin_id,
      performer_type: 'admin',
      old_status: oldStatus,
      new_status: status,
      remarks: admin_remark
    });
  }
}

module.exports = new ToolRequestService();
