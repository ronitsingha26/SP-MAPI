const fs = require('fs');
let content = fs.readFileSync('backend/src/services/adminService.js', 'utf8');

const newMethod = `
  async getCustomerDetails(customerId) {
    return await adminRepository.getCustomerDetails(customerId);
  }
`;

// Insert it right after getCustomers
content = content.replace(
  /async getCustomers\(adminId, query\) \{[\s\S]*?return await adminRepository\.getCustomers\(conditions, params\);\n\s*\}/m,
  match => match + '\n' + newMethod
);

fs.writeFileSync('backend/src/services/adminService.js', content);
