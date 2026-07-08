const aminRepository = require('../repositories/aminRepository');
const adminRepository = require('../repositories/adminRepository');
const { AppError } = require('../middleware/errorHandler');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class AminService {
  async getTasks(aminId, query) {
    const { status } = query;
    let conditions = ['a.assigned_amin_id = ?', 'a.deleted_at IS NULL'];
    let params = [aminId];
    if (status) { conditions.push('a.status = ?'); params.push(status); }

    const tasks = await aminRepository.getTasks(aminId, conditions, params);

    if (tasks.length > 0) {
      const appIds = tasks.map(t => t.id);
      const docs = await adminRepository.getDocumentsForApplications(appIds);
      const docsByApp = {};
      docs.forEach(d => {
        if (!docsByApp[d.application_id]) docsByApp[d.application_id] = [];
        docsByApp[d.application_id].push(d);
      });
      tasks.forEach(t => {
        t.documents = docsByApp[t.id] || [];
      });
    }

    return tasks;
  }

  async updateTaskStatus(id, amin, status, remark) {
    const valid = ['assigned', 'in_progress', 'completed'];
    if (!valid.includes(status)) throw new AppError('Invalid status.', 400);

    const app = await aminRepository.getTaskById(id, amin.id);
    if (!app) throw new AppError('Task not found.', 404);

    const history = typeof app.status_history === 'string' ? JSON.parse(app.status_history) : (app.status_history || []);
    history.push({ status: app.status, date: new Date().toISOString(), remark: remark || '', changed_by: amin.name });

    await aminRepository.updateTaskStatus(id, status, history, remark);

    if (status === 'completed') {
      await aminRepository.updateAminStatsOnCompletion(amin.id);
    }
  }

  async uploadReport(id, aminId, file) {
    if (!file) throw new AppError('No file uploaded.', 400);

    const fileUrl = `/uploads/field_reports/${file.filename}`;
    await aminRepository.updateFieldReportUrl(id, aminId, fileUrl);

    const docId = uuidv4();
    await aminRepository.createDocument(
      docId, id, file.originalname, file.filename, file.path, fileUrl, file.size, file.mimetype
    );

    return fileUrl;
  }

  async getDashboard(aminId) {
    const amin = await aminRepository.getAminProfile(aminId);
    if (!amin) throw new AppError('Amin not found.', 404);

    const recentTasks = await aminRepository.getRecentTasks(aminId);
    return { amin, recent_tasks: recentTasks };
  }
}

module.exports = new AminService();
