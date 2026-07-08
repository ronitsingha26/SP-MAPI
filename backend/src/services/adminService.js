const adminRepository = require('../repositories/adminRepository');
const applicationRepository = require('../repositories/applicationRepository');
const notificationService = require('./notificationService');
const superAdminService = require('./superAdminService');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middleware/errorHandler');
const pool = require('../config/db');

class AdminService {
  async getDashboard(adminId) {
    const districts = await adminRepository.getAdminDistricts(adminId);
    const hasDistricts = districts[0] !== '__NONE__';

    // If admin has no districts, use global stats
    if (!hasDistricts) {
      const stats = await adminRepository.getGlobalDashboardStats();
      const monthly_applications = await adminRepository.getGlobalMonthlyApplications();
      return { stats, monthly_applications, districts: [] };
    }

    const stats = await adminRepository.getDashboardStats(districts);
    const monthly_applications = await adminRepository.getMonthlyApplications(districts);
    return { stats, monthly_applications, districts };
  }

  async getApplications(adminId, query) {
    const { service_type, status, search, page = 1, limit = 20 } = query;
    const districts = await adminRepository.getAdminDistricts(adminId);
    const hasDistricts = districts[0] !== '__NONE__';
    
    // Build conditions — if no districts assigned, show ALL applications
    let conditions = ['a.deleted_at IS NULL'];
    let params = [];

    if (hasDistricts) {
      conditions.push('a.district IN (?)');
      params.push(districts);
    }

    if (service_type) { conditions.push(`a.service_type = ?`); params.push(service_type); }
    if (status)       { conditions.push(`a.status = ?`);       params.push(status); }
    if (search) {
      conditions.push(`(a.app_id LIKE ? OR a.applicant_name LIKE ? OR a.applicant_mobile LIKE ?)`);
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    const countParams = [...params];
    const offset = (page - 1) * limit;
    params.push(Number(limit), Number(offset));

    const applications = await adminRepository.getApplicationsAll(conditions, params);
    
    if (applications.length > 0) {
      const appIds = applications.map(a => a.id);
      const docs = await adminRepository.getDocumentsForApplications(appIds);
      const docsByApp = {};
      docs.forEach(d => {
        if (!docsByApp[d.application_id]) docsByApp[d.application_id] = [];
        docsByApp[d.application_id].push(d);
      });
      applications.forEach(a => {
        a.documents = docsByApp[a.id] || [];
      });
    }

    const total = await adminRepository.getApplicationsCount(conditions, countParams);

    return { applications, total, page: parseInt(page), limit: parseInt(limit) };
  }

  async updateApplicationStatus(id, status, remark, admin) {
    const app = await adminRepository.getApplicationById(id);
    if (!app) throw new AppError('Application not found.', 404);

    const history = typeof app.status_history === 'string' ? JSON.parse(app.status_history) : (app.status_history || []);
    history.push({ status: app.status, date: new Date().toISOString(), remark: app.admin_remark || '', changed_by: admin.name });

    await adminRepository.updateApplicationStatus(id, status, remark, history, admin.id);
    
    // Notify the Customer
    if (app.customer_id) {
      await notificationService.sendNotification(
        app.customer_id, 
        'customer', 
        'Application Status Updated', 
        `Your application ID ${app.app_id} status has been updated to "${status}".`,
        `/customer/applications`
      );
    }

    await adminRepository.logAudit(
      admin.id, admin.name, 'APPLICATION_STATUS_UPDATED', id,
      JSON.stringify({ status: app.status }), JSON.stringify({ status }), admin.ip
    );
  }

  async assignAmin(applicationId, aminId, admin) {
    const amin = await adminRepository.getAminById(aminId);
    if (!amin) throw new AppError('Amin not found or inactive.', 404);

    await adminRepository.assignAmin(applicationId, aminId);

    // Notify the Amin
    await notificationService.sendNotification(
      aminId, 
      'amin', 
      'New Application Assigned', 
      `You have been assigned to application ID ${applicationId}. Please check your task list.`,
      `/amin/tasks/${applicationId}`
    );

    await adminRepository.logAudit(
      admin.id, admin.name, 'AMIN_ASSIGNED', applicationId,
      null, JSON.stringify({ amin_id: aminId }), admin.ip
    );
  }

  async getCustomers(adminId, query) {
    const { search, status, page = 1, limit = 20 } = query;
    const districts = await adminRepository.getAdminDistricts(adminId);

    let conditions = ['district IN (?)', 'deleted_at IS NULL'];
    let params = [districts];

    if (status) { conditions.push(`status=?`); params.push(status); }
    if (search) {
      conditions.push(`(name LIKE ? OR mobile LIKE ? OR email LIKE ?)`);
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    const offset = (page - 1) * limit;
    params.push(Number(limit), Number(offset));

    return await adminRepository.getCustomers(conditions, params);
  }

  async getCustomerDetails(customerId) {
    return await adminRepository.getCustomerDetails(customerId);
  }


  async getAmins(adminId) {
    const districts = await adminRepository.getAdminDistricts(adminId);
    return await adminRepository.getAmins(districts);
  }

  async createAmin(data, adminId) {
    const { name, mobile, email, password, district, license_number } = data;
    const password_hash = await bcrypt.hash(password, 12);
    
    const distData = await applicationRepository.findDistrictByName(district);
    const district_id = distData?.id || null;
    const id = uuidv4();

    return await adminRepository.createAmin(id, name, mobile, email, password_hash, district_id, district, license_number, adminId);
  }

  async updateAmin(id, data) {
    const { name, mobile, email, district, license_number, status } = data;
    const distData = await applicationRepository.findDistrictByName(district);
    const district_id = distData?.id || null;

    await adminRepository.updateAmin(id, name, mobile, email, district_id, district, license_number, status);
  }

  async deleteAmin(id) {
    await adminRepository.deleteAmin(id);
  }

  async getPayments(adminId) {
    const districts = await adminRepository.getAdminDistricts(adminId);
    return await adminRepository.getPayments(districts);
  }

  async getEnquiries() {
    return await adminRepository.getEnquiries();
  }

  // ── Merged SuperAdmin Methods ─────────────────────────────────
  async getSuperDashboard() {
    return await superAdminService.getDashboard();
  }

  async getAdmins() {
    return await superAdminService.getAdmins();
  }

  async createAdmin(data, actor) {
    return await superAdminService.createAdmin(data, actor);
  }

  async updateAdmin(id, data) {
    return await superAdminService.updateAdmin(id, data);
  }

  async deleteAdmin(id, actor) {
    return await superAdminService.deleteAdmin(id, actor);
  }

  async getAllUsers(query) {
    return await superAdminService.getAllUsers(query);
  }

  async getAuditLogs(query) {
    return await superAdminService.getAuditLogs(query);
  }

  async getDistricts() {
    return await superAdminService.getDistricts();
  }

  async createDistrict(data, actor) {
    return await superAdminService.createDistrict(data, actor);
  }

  async updateDistrict(id, data, actor) {
    return await superAdminService.updateDistrict(id, data, actor);
  }

  async getAllPayments(query) {
    return await superAdminService.getPayments(query);
  }

  async broadcast({ title, message, target, actor }) {
    // Create a platform-wide notification
    // If notificationService supports broadcast, use it; else log it
    try {
      if (notificationService && typeof notificationService.broadcastNotification === 'function') {
        await notificationService.broadcastNotification({ title, message, target, actorId: actor?.id });
      } else {
        // Fallback: log to audit
        const superAdminRepository = require('../repositories/superAdminRepository');
        await superAdminRepository.logAudit(
          actor?.id, actor?.name || 'Admin',
          'BROADCAST_SENT', 'notification', null, actor?.ip
        );
      }
    } catch (err) {
      // Non-critical — don't fail the request
      console.error('[AdminService.broadcast] Error:', err.message);
    }
  }

  async deleteApplication(applicationId) {
    const fs = require('fs');
    const path = require('path');
    const { docs, reports } = await adminRepository.getApplicationFiles(applicationId);
    
    // Delete files
    const deleteFile = (filePath) => {
      if (!filePath) return;
      const fullPath = filePath.startsWith('/uploads') 
        ? path.join(process.env.UPLOAD_PATH || './uploads', filePath.replace('/uploads/', ''))
        : filePath;
      
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (e) { console.error('Failed to delete file:', fullPath, e); }
      }
    };

    docs.forEach(d => deleteFile(d.file_path));
    reports.forEach(r => {
      deleteFile(r.final_report_url);
      deleteFile(r.map_pdf_url);
      if (r.photos) {
        try {
          const photosArray = typeof r.photos === 'string' ? JSON.parse(r.photos) : r.photos;
          photosArray.forEach(p => deleteFile(p));
        } catch(e) {}
      }
    });

    await adminRepository.deleteApplication(applicationId);
  }

  async deleteToolRequest(toolRequestId) {
    const request = await adminRepository.getToolRequest(toolRequestId);
    if (!request) throw new Error('Tool request not found');

    if (request.status === 'approved' || request.status === 'dispatched') {
      try {
        const tools = typeof request.tools === 'string' ? JSON.parse(request.tools) : request.tools;
        for (const tool of tools) {
          await adminRepository.restoreToolStock(tool.name, tool.quantity);
        }
      } catch (e) { console.error('Failed to restore tool stock', e); }
    }

    await adminRepository.deleteToolRequest(toolRequestId);
  }
}

module.exports = new AdminService();
