const pool = require('../config/db');

class PricingAdminRepository {
  // --- Service Types ---
  
  async getServiceTypes() {
    const result = await pool.query('SELECT * FROM service_types ORDER BY created_at DESC');
    return result.rows;
  }
  
  async getServiceTypeById(id) {
    const result = await pool.query('SELECT * FROM service_types WHERE id = ?', [id]);
    return result.rows[0];
  }

  async createServiceType(id, name, displayName, description, basePrice, unitType, unitPrice, isActive) {
    await pool.query(
      `INSERT INTO service_types (id, name, display_name, description, base_price, unit_type, unit_price, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, displayName, description, basePrice, unitType, unitPrice, isActive]
    );
    return await this.getServiceTypeById(id);
  }

  async updateServiceType(id, name, displayName, description, basePrice, unitType, unitPrice, isActive) {
    await pool.query(
      `UPDATE service_types 
       SET name = COALESCE(?, name), 
           display_name = COALESCE(?, display_name), 
           description = COALESCE(?, description),
           base_price = COALESCE(?, base_price),
           unit_type = COALESCE(?, unit_type),
           unit_price = COALESCE(?, unit_price),
           is_active = COALESCE(?, is_active),
           updated_at = NOW()
       WHERE id = ?`,
      [name, displayName, description, basePrice, unitType, unitPrice, isActive, id]
    );
    return await this.getServiceTypeById(id);
  }

  async deleteServiceType(id) {
    await pool.query('DELETE FROM service_types WHERE id = ?', [id]);
  }

  // --- Tools Inventory ---

  async getTools() {
    const result = await pool.query('SELECT * FROM tools_inventory ORDER BY created_at DESC');
    return result.rows;
  }

  async getToolById(id) {
    const result = await pool.query('SELECT * FROM tools_inventory WHERE id = ?', [id]);
    return result.rows[0];
  }

  async createTool(id, name, description, stockQuantity, rentalPrice, isActive) {
    await pool.query(
      `INSERT INTO tools_inventory (id, name, description, stock_quantity, rental_price, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, description, stockQuantity, rentalPrice, isActive]
    );
    return await this.getToolById(id);
  }

  async updateTool(id, name, description, stockQuantity, rentalPrice, isActive) {
    await pool.query(
      `UPDATE tools_inventory 
       SET name = COALESCE(?, name), 
           description = COALESCE(?, description),
           stock_quantity = COALESCE(?, stock_quantity),
           rental_price = COALESCE(?, rental_price),
           is_active = COALESCE(?, is_active),
           updated_at = NOW()
       WHERE id = ?`,
      [name, description, stockQuantity, rentalPrice, isActive, id]
    );
    return await this.getToolById(id);
  }

  async deleteTool(id) {
    await pool.query('DELETE FROM tools_inventory WHERE id = ?', [id]);
  }

  // --- Pricing Rules ---

  async getPricingRules(serviceId) {
    let query = `
      SELECT pr.*, s.name as service_name, d.name as district_name 
      FROM pricing_rules pr
      JOIN service_types s ON pr.service_id = s.id
      LEFT JOIN districts d ON pr.district_id = d.id
    `;
    const params = [];
    
    if (serviceId) {
      query += ` WHERE pr.service_id = ?`;
      params.push(serviceId);
    }
    
    query += ` ORDER BY pr.created_at DESC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  async getPricingRuleById(id) {
    const result = await pool.query('SELECT * FROM pricing_rules WHERE id = ?', [id]);
    return result.rows[0];
  }

  async createPricingRule(id, serviceId, districtId, modifierType, modifierValue) {
    await pool.query(
      `INSERT INTO pricing_rules (id, service_id, district_id, modifier_type, modifier_value)
       VALUES (?, ?, ?, ?, ?)`,
      [id, serviceId, districtId, modifierType, modifierValue]
    );
    return await this.getPricingRuleById(id);
  }

  async updatePricingRule(id, modifierType, modifierValue) {
    await pool.query(
      `UPDATE pricing_rules 
       SET modifier_type = COALESCE(?, modifier_type),
           modifier_value = COALESCE(?, modifier_value)
       WHERE id = ?`,
      [modifierType, modifierValue, id]
    );
    return await this.getPricingRuleById(id);
  }

  async deletePricingRule(id) {
    await pool.query('DELETE FROM pricing_rules WHERE id = ?', [id]);
  }
}

module.exports = new PricingAdminRepository();
