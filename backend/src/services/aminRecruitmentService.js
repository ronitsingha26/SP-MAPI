const repository = require('../repositories/aminRecruitmentRepository');
const { AppError } = require('../middleware/errorHandler');

exports.submitApplication = async (data, files) => {
  // Check duplicates
  const existing = await repository.findApplicationByEmailOrMobile(data.email, data.mobile);
  if (existing) {
    throw new AppError('You have already submitted an Amin Application.', 409);
  }

  // Generate ID
  const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const app_id = `AMIN-${dateStr}-${randomNum}`;

  // Process documents
  const documents = [];
  if (files) {
    const fileFields = ['aadhaar_front', 'aadhaar_back', 'pan', 'educational_certificate', 'experience_certificate', 'passport_photo'];
    fileFields.forEach(field => {
      if (files[field] && files[field][0]) {
        documents.push({
          doc_type: field,
          original_name: files[field][0].originalname,
          file_url: `/uploads/${files[field][0].filename}`
        });
      }
    });
  }

  const payload = {
    ...data,
    app_id,
    documents
  };

  const result = await repository.createAminApplication(payload);
  return result;
};

exports.trackAminApplication = async (app_id) => {
  const app = await repository.getApplicationByAppId(app_id);
  if (!app) throw new AppError('Application not found. Please check the Application ID.', 404);
  
  return {
    app_id: app.app_id,
    service_type: 'Amin Recruitment',
    status: app.status,
    applicant_name: app.name,
    mobile: app.mobile,
    district: app.district,
    created_at: app.created_at,
    updated_at: app.updated_at,
    admin_remark: app.admin_remark
  };
};

exports.getFullApplication = async (app_id) => {
  const app = await repository.getApplicationByAppId(app_id);
  if (!app) throw new AppError('Application not found.', 404);
  
  // Omit documents if needed, but we don't need to do anything since the requirement is to return fields
  return app;
};

exports.getAllApplications = async () => {
  return await repository.getAllApplications();
};

exports.reviewApplication = async (id, status, admin_remark) => {
  if (!['approved', 'rejected'].includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const app = await repository.getApplicationById(id);
  if (!app) throw new AppError('Application not found', 404);

  if (app.status !== 'pending') {
    throw new AppError('Application has already been processed and cannot be edited.', 400);
  }

  await repository.updateApplicationStatus(id, status, admin_remark);

  if (status === 'approved') {
    // Look up the district ID
    const appRepoInstance = require('../repositories/applicationRepository');
    let district_id = null;
    const distRecord = await appRepoInstance.findDistrictByName(app.district);
    if (distRecord) district_id = distRecord.id;

    // Insert into amins table
    const adminRepoInstance = require('../repositories/adminRepository');
    const { v4: uuidv4 } = require('uuid');
    
    // license number can be generated or just left null, we'll generate one
    const license_number = `LIC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    await adminRepoInstance.createAmin(
      uuidv4(),
      app.name,
      app.mobile,
      app.email,
      app.password_hash || null,
      district_id,
      app.district,
      license_number,
      null // created_by admin id (we don't pass it here currently)
    );
  }
  
  return { success: true, message: `Application ${status} successfully.` };
};

exports.deleteApplication = async (id) => {
  const app = await repository.getApplicationById(id);
  if (!app) throw new AppError('Application not found', 404);
  await repository.deleteApplication(id);
};
