const pricingAdminRepository = require('../repositories/pricingAdminRepository');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middleware/errorHandler');

class PricingAdminService {
  async getServiceTypes() {
    return await pricingAdminRepository.getServiceTypes();
  }

  async createServiceType(data) {
    const { name, display_name, description, base_price, unit_type, unit_price, is_active = true } = data;
    if (!name || !display_name) {
      throw new AppError('Name and display name are required', 400);
    }
    const id = uuidv4();
    return await pricingAdminRepository.createServiceType(
      id, name, display_name, description, base_price, unit_type, unit_price, is_active
    );
  }

  async updateServiceType(id, data) {
    const { name, display_name, description, base_price, unit_type, unit_price, is_active } = data;
    const service = await pricingAdminRepository.getServiceTypeById(id);
    if (!service) throw new AppError('Service type not found', 404);

    return await pricingAdminRepository.updateServiceType(
      id, name, display_name, description, base_price, unit_type, unit_price, is_active
    );
  }

  async deleteServiceType(id) {
    const service = await pricingAdminRepository.getServiceTypeById(id);
    if (!service) throw new AppError('Service type not found', 404);
    await pricingAdminRepository.deleteServiceType(id);
  }

  // --- Tools Inventory ---

  async getTools() {
    return await pricingAdminRepository.getTools();
  }

  async createTool(data) {
    const { name, description, stock_quantity, rental_price, is_active = true } = data;
    if (!name) throw new AppError('Tool name is required', 400);
    const id = uuidv4();
    return await pricingAdminRepository.createTool(
      id, name, description, stock_quantity || 0, rental_price || 0, is_active
    );
  }

  async updateTool(id, data) {
    const { name, description, stock_quantity, rental_price, is_active } = data;
    const tool = await pricingAdminRepository.getToolById(id);
    if (!tool) throw new AppError('Tool not found', 404);
    return await pricingAdminRepository.updateTool(
      id, name, description, stock_quantity, rental_price, is_active
    );
  }

  async deleteTool(id) {
    const tool = await pricingAdminRepository.getToolById(id);
    if (!tool) throw new AppError('Tool not found', 404);
    await pricingAdminRepository.deleteTool(id);
  }

  // --- Pricing Rules ---

  async getPricingRules(serviceId) {
    return await pricingAdminRepository.getPricingRules(serviceId);
  }
  async createPricingRule(data) {
    const { service_id, district_id, modifier_type, modifier_value } = data;
    if (!service_id || !modifier_type || modifier_value === undefined) {
      throw new AppError('Service ID, modifier type and modifier value are required', 400);
    }
    const id = uuidv4();
    return await pricingAdminRepository.createPricingRule(
      id, service_id, district_id || null, modifier_type, modifier_value
    );
  }

  async updatePricingRule(id, data) {
    const { modifier_type, modifier_value } = data;
    const rule = await pricingAdminRepository.getPricingRuleById(id);
    if (!rule) throw new AppError('Pricing rule not found', 404);

    return await pricingAdminRepository.updatePricingRule(
      id, modifier_type, modifier_value
    );
  }

  async deletePricingRule(id) {
    const rule = await pricingAdminRepository.getPricingRuleById(id);
    if (!rule) throw new AppError('Pricing rule not found', 404);
    await pricingAdminRepository.deletePricingRule(id);
  }
}

module.exports = new PricingAdminService();
