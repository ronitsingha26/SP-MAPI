const pool = require('../config/db');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const applicationRepository = require('../repositories/applicationRepository');
const invoiceService = require('./invoiceService');
const { AppError } = require('../middleware/errorHandler');
const pricingService = require('./pricingService');

class ApplicationService {
  generateAppId(prefix) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${prefix.toUpperCase()}-${dateStr}-${rand}`;
  }

  async processDocuments(files, application_id, customer_id, client) {
    if (!files) return;
    for (const [fieldname, fileArr] of Object.entries(files)) {
      const file = Array.isArray(fileArr) ? fileArr[0] : fileArr;
      if (!file) continue;
      
      let docType = 'other';
      if (fieldname.includes('aadhaar_front')) docType = 'aadhaar_front';
      else if (fieldname.includes('aadhaar_back')) docType = 'aadhaar_back';
      else if (fieldname.includes('vanshawali')) docType = 'vanshawali';
      else if (fieldname.includes('khatiyan')) docType = 'khatiyan';
      else if (fieldname.includes('kewala')) docType = 'kewala';
      else if (fieldname.includes('original_deed')) docType = 'original_deed';
      else if (fieldname.includes('land')) docType = 'land_document';
      else if (fieldname.includes('other')) docType = 'other';
      
      const fileUrl = `/uploads/${path.relative(process.env.UPLOAD_PATH || './uploads', file.path).replace(/\\/g, '/')}`;
      const docId = uuidv4();
      
      await applicationRepository.createDocument({
        id: docId,
        application_id,
        customer_id,
        doc_type: docType,
        original_name: file.originalname,
        stored_name: file.filename,
        file_path: file.path,
        file_url: fileUrl,
        file_size: file.size,
        mime_type: file.mimetype
      }, client);
    }
  }

  async submitMapi(data, files) {
    const client = await pool.getConnection();
    try {
      await client.beginTransaction();
      
      const app_id = this.generateAppId('MAPI');
      const id = uuidv4();
      const distData = await applicationRepository.findDistrictByName(data.district);
      
      const parsedLandArea = data.land_area ? parseFloat(data.land_area) : 0;
      const payment_required = await pricingService.calculatePrice('mapi', distData?.id, parsedLandArea);

      const application = await applicationRepository.createApplication({
        ...data,
        id,
        app_id,
        service_type: 'mapi',
        applicant_name: data.name,
        applicant_mobile: data.mobile,
        applicant_email: data.email,
        district_id: distData?.id,
        payment_required,
        land_area: parsedLandArea || null
      }, client);

      await this.processDocuments(files, id, data.customer_id, client);

      if (data.customer_id) {
        await applicationRepository.updateCustomerPrimaryApp(data.customer_id, app_id, client);
        await invoiceService.generateInvoice(id, data.customer_id, payment_required, null, 'unpaid', client);
      }

      await client.commit();
      return { app_id, application_id: id, application };
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      await client.release();
    }
  }

  async submitBantwara(data, files) {
    const client = await pool.getConnection();
    try {
      await client.beginTransaction();
      
      const app_id = this.generateAppId('BANTWARA');
      const id = uuidv4();
      const distData = await applicationRepository.findDistrictByName(data.district);
      
      const parsedLandArea = data.land_area ? parseFloat(data.land_area) : 0;
      const payment_required = await pricingService.calculatePrice('bantwara', distData?.id, parsedLandArea);

      const application = await applicationRepository.createApplication({
        ...data,
        id,
        app_id,
        service_type: 'bantwara',
        applicant_name: data.name,
        applicant_mobile: data.mobile,
        applicant_email: data.email,
        district_id: distData?.id,
        payment_required,
        land_area: parsedLandArea || null
      }, client);

      await this.processDocuments(files, id, data.customer_id, client);
      
      if (data.customer_id) {
        await applicationRepository.updateCustomerPrimaryApp(data.customer_id, app_id, client);
        await invoiceService.generateInvoice(id, data.customer_id, payment_required, null, 'unpaid', client);
      }

      await client.commit();
      return { app_id, application_id: id, application };
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      await client.release();
    }
  }

  async submitMap(data, files) {
    const client = await pool.getConnection();
    try {
      await client.beginTransaction();
      
      const app_id = this.generateAppId('MAP');
      const id = uuidv4();
      const distData = await applicationRepository.findDistrictByName(data.district);

      const payment_required = await pricingService.calculatePrice('map', distData?.id, 0);

      const application = await applicationRepository.createApplication({
        ...data,
        id,
        app_id,
        service_type: 'map',
        applicant_name: data.name,
        applicant_mobile: data.mobile,
        applicant_email: data.email,
        district_id: distData?.id,
        payment_required
      }, client);

      await this.processDocuments(files, id, data.customer_id, client);
      
      if (data.customer_id) {
        await applicationRepository.updateCustomerPrimaryApp(data.customer_id, app_id, client);
        await invoiceService.generateInvoice(id, data.customer_id, payment_required, null, 'unpaid', client);
      }

      await client.commit();
      return { app_id, application_id: id, application };
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      await client.release();
    }
  }

  async getApplication(id, actor) {
    const app = await applicationRepository.getApplicationByIdOrAppId(id);
    if (!app) throw new AppError('Application not found.', 404);

    if (actor) {
      if (actor.role === 'customer' && app.customer_id !== actor.id) {
        throw new AppError('Unauthorized access to application.', 403);
      }
      if (actor.role === 'amin' && app.assigned_amin_id !== actor.id) {
        throw new AppError('Unauthorized access to application.', 403);
      }
      if (actor.role === 'admin') {
        const adminRepository = require('../repositories/adminRepository');
        const districts = await adminRepository.getAdminDistricts(actor.id);
        if (districts[0] !== '__NONE__' && !districts.includes(app.district)) {
          throw new AppError('Unauthorized access to application in another district.', 403);
        }
      }
    }
    return app;
  }

  async getMyApplications(customer_id) {
    const toolRequestService = require('./toolRequestService');
    const apps = await applicationRepository.getApplicationsByCustomerId(customer_id);
    const toolRequests = await toolRequestService.getToolRequestsByCustomer(customer_id);

    const formattedTools = toolRequests.map(tr => ({
        id: tr.id,
        app_id: tr.app_id,
        service_type: 'tools',
        status: tr.status,
        district: 'N/A',
        applicant_name: null,
        applicant_mobile: null,
        applicant_email: null,
        payment_status: 'unpaid',
        payment_required: 0,
        admin_remark: tr.admin_remark,
        created_at: tr.created_at,
        updated_at: tr.updated_at,
        amin_name: null,
        documents: [],
        tools: typeof tr.tools === 'string' ? JSON.parse(tr.tools || '[]') : (tr.tools || []),
        remarks: tr.remarks
    }));

    return [...apps, ...formattedTools].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async updateApplication(id, customer_id, data) {
    // First verify ownership
    const app = await applicationRepository.getApplicationByCustomerAndId(id, customer_id);
    if (!app) throw new AppError('Application not found or not authorized.', 404);
    
    // Only allow editing if status is submitted or pending
    const editableStatuses = ['submitted', 'pending'];
    if (!editableStatuses.includes(app.status)) {
      throw new AppError(`Cannot edit application with status: ${app.status}. Only submitted/pending applications can be edited.`, 400);
    }

    return await applicationRepository.updateApplication(id, data);
  }

  async withdrawApplication(id, customer_id) {
    const client = await pool.getConnection();
    try {
      await client.beginTransaction();

      const { rows: appRows } = await client.query('SELECT * FROM applications WHERE id = ? AND customer_id = ? FOR UPDATE', [id, customer_id]);
      if (appRows.length === 0) {
        throw new AppError('Application not found or not authorized.', 404);
      }

      const app = appRows[0];
      if (app.status === 'withdrawn') {
        throw new AppError('Application has already been withdrawn.', 409);
      }

      const eligibleStatuses = ['pending', 'assigned'];
      if (!eligibleStatuses.includes(app.status)) {
        throw new AppError(`Cannot withdraw application with status: ${app.status}. Only pending or assigned applications can be withdrawn.`, 400);
      }

      const oldStatus = app.status;
      const withdrawReason = 'Withdrawn by customer';

      // Update application
      await client.query(`
        UPDATE applications 
        SET status = 'withdrawn', 
            withdrawn_at = NOW(), 
            withdrawn_by = ?, 
            withdraw_reason = ? 
        WHERE id = ?
      `, [customer_id, withdrawReason, id]);

      // Update assignment if exists
      if (app.assigned_amin_id) {
        await client.query(`
          UPDATE assignments 
          SET status = 'withdrawn' 
          WHERE application_id = ? AND status = 'pending'
        `, [id]);
      }

      // Activity Log
      await client.query(`
        INSERT INTO activity_logs (application_id, action, performed_by, performer_type, performer_name, old_status, new_status, remarks)
        VALUES (?, 'Application Withdrawn', ?, 'customer', ?, ?, 'withdrawn', ?)
      `, [id, customer_id, app.applicant_name, oldStatus, withdrawReason]);

      // Audit Log
      await client.query(`
        INSERT INTO audit_logs (actor_id, actor_type, actor_name, action, entity_type, entity_id, old_value, new_value)
        VALUES (?, 'customer', ?, 'Application Withdrawn', 'applications', ?, ?, ?)
      `, [customer_id, app.applicant_name, id, JSON.stringify({ status: oldStatus }), JSON.stringify({ status: 'withdrawn', reason: withdrawReason })]);

      // Admin Notification
      await client.query(`
        INSERT INTO notifications (id, user_id, user_type, title, message, action_link)
        VALUES (UUID(), 'all', 'admin', 'Application Withdrawn', ?, '/admin/applications')
      `, [`Customer has withdrawn application ${app.app_id}`]);

      // Amin Notification
      if (app.assigned_amin_id) {
        await client.query(`
          INSERT INTO notifications (id, user_id, user_type, title, message, action_link)
          VALUES (UUID(), ?, 'amin', 'Application Withdrawn', ?, '/amin/dashboard')
        `, [app.assigned_amin_id, `Application ${app.app_id} has been withdrawn by the customer.`]);
      }
      
      // Customer Notification
      await client.query(`
        INSERT INTO notifications (id, user_id, user_type, title, message, action_link)
        VALUES (UUID(), ?, 'customer', 'Application Withdrawn', ?, '/customer/dashboard')
      `, [customer_id, `Your application ${app.app_id} has been successfully withdrawn.`]);

      await client.commit();
      return { success: true, app_id: app.app_id };
    } catch (err) {
      await client.rollback();
      throw err;
    } finally {
      client.release();
    }
  }

  async trackApplication(app_id) {
    const app = await applicationRepository.getApplicationByIdOrAppId(app_id);
    if (!app) throw new AppError('Application not found. Please check the Application ID.', 404);
    // Return limited public info
    return {
      app_id: app.app_id,
      service_type: app.service_type,
      status: app.status,
      applicant_name: app.applicant_name,
      district: app.district,
      created_at: app.created_at,
      updated_at: app.updated_at,
      admin_remark: app.admin_remark,
      amin_name: app.amin_name
    };
  }

  async getCustomerDashboard(customer_id) {
    return await applicationRepository.getCustomerDashboardStats(customer_id);
  }
}

module.exports = new ApplicationService();
