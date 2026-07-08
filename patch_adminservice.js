const fs = require('fs');
let content = fs.readFileSync('backend/src/services/adminService.js', 'utf8');

const newMethods = `
  async deleteApplication(applicationId) {
    const fs = require('fs');
    const path = require('path');
    const { docs, reports } = await adminRepository.getApplicationFiles(applicationId);
    
    // Delete files
    const deleteFile = (filePath) => {
      if (!filePath) return;
      // Convert URL to local path if needed, though file_path for docs is usually absolute/relative path
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
`;

content = content.replace('module.exports = new AdminService();', newMethods + '\n}\n\nmodule.exports = new AdminService();');

fs.writeFileSync('backend/src/services/adminService.js', content);
