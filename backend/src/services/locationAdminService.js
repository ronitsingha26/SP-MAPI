const locationAdminRepository = require('../repositories/locationAdminRepository');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middleware/errorHandler');

class LocationAdminService {
  // --- Blocks ---
  async getBlocks(districtId) {
    return await locationAdminRepository.getBlocks(districtId);
  }

  async createBlock(data) {
    const { district_id, name, is_active = true } = data;
    if (!district_id || !name) throw new AppError('District ID and Block name are required', 400);
    const id = uuidv4();
    return await locationAdminRepository.createBlock(id, district_id, name, is_active);
  }

  async updateBlock(id, data) {
    const { name, is_active } = data;
    const block = await locationAdminRepository.getBlockById(id);
    if (!block) throw new AppError('Block not found', 404);
    return await locationAdminRepository.updateBlock(id, name, is_active);
  }

  async deleteBlock(id) {
    const block = await locationAdminRepository.getBlockById(id);
    if (!block) throw new AppError('Block not found', 404);
    await locationAdminRepository.deleteBlock(id);
  }

  // --- Panchayats ---
  async getPanchayats(blockId) {
    return await locationAdminRepository.getPanchayats(blockId);
  }

  async createPanchayat(data) {
    const { block_id, name, is_active = true } = data;
    if (!block_id || !name) throw new AppError('Block ID and Panchayat name are required', 400);
    const id = uuidv4();
    return await locationAdminRepository.createPanchayat(id, block_id, name, is_active);
  }

  async updatePanchayat(id, data) {
    const { name, is_active } = data;
    const panchayat = await locationAdminRepository.getPanchayatById(id);
    if (!panchayat) throw new AppError('Panchayat not found', 404);
    return await locationAdminRepository.updatePanchayat(id, name, is_active);
  }

  async deletePanchayat(id) {
    const panchayat = await locationAdminRepository.getPanchayatById(id);
    if (!panchayat) throw new AppError('Panchayat not found', 404);
    await locationAdminRepository.deletePanchayat(id);
  }

  // --- Villages ---
  async getVillages(panchayatId) {
    return await locationAdminRepository.getVillages(panchayatId);
  }

  async createVillage(data) {
    const { panchayat_id, name, is_active = true } = data;
    if (!panchayat_id || !name) throw new AppError('Panchayat ID and Village name are required', 400);
    const id = uuidv4();
    return await locationAdminRepository.createVillage(id, panchayat_id, name, is_active);
  }

  async updateVillage(id, data) {
    const { name, is_active } = data;
    const village = await locationAdminRepository.getVillageById(id);
    if (!village) throw new AppError('Village not found', 404);
    return await locationAdminRepository.updateVillage(id, name, is_active);
  }

  async deleteVillage(id) {
    const village = await locationAdminRepository.getVillageById(id);
    if (!village) throw new AppError('Village not found', 404);
    await locationAdminRepository.deleteVillage(id);
  }
}

module.exports = new LocationAdminService();
