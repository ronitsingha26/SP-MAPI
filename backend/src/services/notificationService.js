const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

class NotificationService {
  async sendNotification(user_id, user_type, title, message, action_link = null) {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO notifications (id, user_id, user_type, title, message, action_link)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, user_id, user_type, title, message, action_link]
    );
    // Real-time events (Socket.io) can be emitted here later
    return id;
  }

  async getNotifications(user_id, user_type) {
    const result = await pool.query(
      `SELECT id, title, message, is_read, action_link, created_at 
       FROM notifications 
       WHERE user_id = ? AND user_type = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [user_id, user_type]
    );
    return result.rows;
  }

  async markAsRead(notification_id, user_id) {
    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?`,
      [notification_id, user_id]
    );
  }

  async markAllAsRead(user_id, user_type) {
    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND user_type = ?`,
      [user_id, user_type]
    );
  }
}

module.exports = new NotificationService();
