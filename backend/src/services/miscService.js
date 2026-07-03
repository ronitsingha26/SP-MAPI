const miscRepository = require('../repositories/miscRepository');
const { AppError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

class MiscService {
  async submitEnquiry(data, ip) {
    const { name, mobile, email, subject, message } = data;
    const id = uuidv4();
    return await miscRepository.createEnquiry(id, name, mobile, email, subject, message, ip);
  }

  async getAllEnquiries() {
    return await miscRepository.getAllEnquiries();
  }

  async getProfile(customerId) {
    const profile = await miscRepository.getCustomerProfile(customerId);
    if (!profile) throw new AppError('Profile not found.', 404);
    return profile;
  }

  async updateProfile(customerId, data) {
    return await miscRepository.updateCustomerProfile(customerId, data);
  }

  async getPayments(customerId) {
    return await miscRepository.getCustomerPayments(customerId);
  }

  async getDistricts() {
    return await miscRepository.getDistricts();
  }
}

module.exports = new MiscService();
