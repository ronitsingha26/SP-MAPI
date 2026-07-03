const { v4: uuidv4 } = require('uuid');
const propertyRepo = require('../repositories/propertyRepository');
const { AppError } = require('../middleware/errorHandler');

class PropertyService {
  async getAll(query) {
    let conditions = [];
    let params = [];
    
    if (query.district) {
      conditions.push('district = ?');
      params.push(query.district);
    }
    if (query.status) {
      conditions.push('status = ?');
      params.push(query.status);
    }
    if (query.admin_id) {
      conditions.push('admin_id = ?');
      params.push(query.admin_id);
    }

    return await propertyRepo.getAll(conditions, params);
  }

  async getById(id) {
    const property = await propertyRepo.getById(id);
    if (!property) throw new AppError('Property not found', 404);
    return property;
  }

  async create(data, adminId) {
    const id = uuidv4();
    const propertyData = {
      id,
      title: data.title,
      district: data.district,
      block_name: data.block_name,
      area_sqft: data.area_sqft,
      price: data.price,
      plot_type: data.plot_type || 'residential',
      status: data.status || 'available',
      images: data.images || [],
      admin_id: adminId
    };
    await propertyRepo.create(propertyData);
    return propertyData;
  }

  async update(id, data, user) {
    const property = await this.getById(id);
    if (user.role === 'admin' && property.admin_id !== user.id) {
      throw new AppError('Not authorized to update this property', 403);
    }

    const updatedData = {
      title: data.title || property.title,
      district: data.district || property.district,
      block_name: data.block_name || property.block_name,
      area_sqft: data.area_sqft || property.area_sqft,
      price: data.price || property.price,
      plot_type: data.plot_type || property.plot_type,
      status: data.status || property.status,
      images: data.images || property.images
    };

    await propertyRepo.update(id, updatedData);
    return { id, ...updatedData };
  }

  async delete(id, user) {
    const property = await this.getById(id);
    if (user.role === 'admin' && property.admin_id !== user.id) {
      throw new AppError('Not authorized to delete this property', 403);
    }
    await propertyRepo.delete(id);
  }
}

module.exports = new PropertyService();
