const pool = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

class PricingService {
  async calculatePrice(serviceName, districtId, area) {
    // Get base service info
    const serviceResult = await pool.query(
      'SELECT id, base_price, unit_type, unit_price FROM service_types WHERE name = ? AND is_active = TRUE',
      [serviceName]
    );
    const service = serviceResult.rows[0];
    if (!service) throw new AppError('Service type not found or inactive.', 404);

    let price = parseFloat(service.base_price);

    // Calculate area cost
    if (service.unit_type !== 'fixed' && area > 0) {
      price += area * parseFloat(service.unit_price);
    }

    // Apply district modifiers if they exist
    if (districtId) {
      const rulesResult = await pool.query(
        'SELECT modifier_type, modifier_value FROM pricing_rules WHERE service_id = ? AND district_id = ?',
        [service.id, districtId]
      );
      
      for (const rule of rulesResult.rows) {
        const val = parseFloat(rule.modifier_value);
        if (rule.modifier_type === 'multiplier') {
          price *= val;
        } else if (rule.modifier_type === 'fixed_addition') {
          price += val;
        }
      }
    }

    // Also apply global modifiers for this service (district_id is NULL)
    const globalRulesResult = await pool.query(
      'SELECT modifier_type, modifier_value FROM pricing_rules WHERE service_id = ? AND district_id IS NULL',
      [service.id]
    );
    
    for (const rule of globalRulesResult.rows) {
      const val = parseFloat(rule.modifier_value);
      if (rule.modifier_type === 'multiplier') {
        price *= val;
      } else if (rule.modifier_type === 'fixed_addition') {
        price += val;
      }
    }

    return Math.round(price * 100) / 100; // Round to 2 decimal places
  }
}

module.exports = new PricingService();
