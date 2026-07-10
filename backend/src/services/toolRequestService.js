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
      `INSERT INTO tool_requests (id, app_id, customer_id, tools, remarks)
       VALUES (?,?,?,?,?)`,
      [id, app_id, customer_id, JSON.stringify(tools), remarks || null]
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

  async withdrawToolRequest(id, customer_id) {
    const { AppError } = require('../middleware/errorHandler');
    
    const client = await pool.getConnection();
    try {
      await client.beginTransaction();

      const { rows: trRows } = await client.query('SELECT * FROM tool_requests WHERE id = ? AND customer_id = ? FOR UPDATE', [id, customer_id]);
      if (trRows.length === 0) {
        throw new AppError('Tool request not found or not authorized.', 404);
      }

      const tr = trRows[0];
      if (tr.status === 'withdrawn') {
        throw new AppError('Application has already been withdrawn.', 409);
      }

      const eligibleStatuses = ['pending', 'approved', 'dispatched'];
      if (!eligibleStatuses.includes(tr.status)) {
        throw new AppError(`Cannot withdraw tool request with status: ${tr.status}.`, 400);
      }

      const oldStatus = tr.status;
      const withdrawReason = 'Withdrawn by customer';

      // Update status
      await client.query(`
        UPDATE tool_requests 
        SET status = 'withdrawn', 
            withdrawn_at = NOW(), 
            withdrawn_by = ?, 
            withdraw_reason = ? 
        WHERE id = ?
      `, [customer_id, withdrawReason, id]);

      // If approved or dispatched, restore inventory
      if (['approved', 'dispatched'].includes(oldStatus) && tr.tools) {
        const toolsArr = typeof tr.tools === 'string' ? JSON.parse(tr.tools) : tr.tools;
        for (const tool of toolsArr) {
          if (tool.name && tool.quantity) {
            await client.query('UPDATE tools_inventory SET stock_quantity = stock_quantity + ? WHERE name = ?', [tool.quantity, tool.name]);
          }
        }
      }

      // Fetch customer name for logs
      const { rows: cRows } = await client.query('SELECT name FROM customers WHERE id = ?', [customer_id]);
      const customerName = cRows[0]?.name || 'Customer';

      // Activity Log
      await client.query(`
        INSERT INTO activity_logs (tool_request_id, action, performed_by, performer_type, performer_name, old_status, new_status, remarks)
        VALUES (?, 'Tool Request Withdrawn', ?, 'customer', ?, ?, 'withdrawn', ?)
      `, [id, customer_id, customerName, oldStatus, withdrawReason]);

      // Audit Log
      await client.query(`
        INSERT INTO audit_logs (actor_id, actor_type, actor_name, action, entity_type, entity_id, old_value, new_value)
        VALUES (?, 'customer', ?, 'Tool Request Withdrawn', 'tool_requests', ?, ?, ?)
      `, [customer_id, customerName, id, JSON.stringify({ status: oldStatus }), JSON.stringify({ status: 'withdrawn', reason: withdrawReason })]);

      // Admin Notification
      await client.query(`
        INSERT INTO notifications (id, user_id, user_type, title, message, action_link)
        VALUES (UUID(), 'all', 'admin', 'Tool Request Withdrawn', ?, '/admin/tools-orders')
      `, [`Customer has withdrawn tool request ${tr.app_id}`]);

      // Customer Notification
      await client.query(`
        INSERT INTO notifications (id, user_id, user_type, title, message, action_link)
        VALUES (UUID(), ?, 'customer', 'Tool Request Withdrawn', ?, '/customer/dashboard')
      `, [customer_id, `Your tool request ${tr.app_id} has been successfully withdrawn.`]);

      await client.commit();
      return { success: true, app_id: tr.app_id };
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      client.release();
    }
  }

  async trackToolRequest(app_id) {
    const { rows } = await pool.query(
      `SELECT tr.app_id, tr.status, tr.created_at, tr.updated_at, tr.admin_remark, c.name AS applicant_name, c.district
       FROM tool_requests tr
       JOIN customers c ON tr.customer_id = c.id
       WHERE tr.app_id = ? LIMIT 1`,
      [app_id]
    );
    if (!rows[0]) return null;
    
    const app = rows[0];
    return {
      app_id: app.app_id,
      service_type: 'Tool Order',
      status: app.status,
      applicant_name: app.applicant_name,
      district: app.district,
      created_at: app.created_at,
      updated_at: app.updated_at,
      admin_remark: app.admin_remark
    };
  }
}

module.exports = new ToolRequestService();
