const fs = require('fs');
let content = fs.readFileSync('backend/src/repositories/adminRepository.js', 'utf8');

const newMethod = `
  async getCustomerDetails(customerId) {
    // 1. Customer profile
    const customerRes = await pool.query(
      'SELECT id, name, mobile, email, district, status, created_at, customer_id_display FROM customers WHERE id = ?',
      [customerId]
    );
    const customer = customerRes.rows[0];
    if (!customer) throw new Error('Customer not found');

    // 2. Applications (Mapi, Bantwara, Maps)
    const appsRes = await pool.query(
      \`SELECT a.*, 
              (SELECT name FROM amins am WHERE am.id = a.assigned_amin_id) AS amin_name,
              p.payment_status as payment_status
       FROM applications a
       LEFT JOIN payments p ON p.application_id = a.id AND p.payment_status = 'paid'
       WHERE a.customer_id = ? AND a.deleted_at IS NULL
       ORDER BY a.created_at DESC\`,
      [customerId]
    );
    const applications = appsRes.rows;

    // 3. Tool Orders
    const toolsRes = await pool.query(
      'SELECT * FROM tool_requests WHERE customer_id = ? ORDER BY created_at DESC',
      [customerId]
    );
    const toolOrders = toolsRes.rows;

    // 4. Documents & Reports
    let documents = [];
    if (applications.length > 0) {
      const appIds = applications.map(app => app.id);
      const docsRes = await pool.query(
        'SELECT * FROM documents WHERE application_id IN (?) ORDER BY created_at DESC',
        [appIds]
      );
      documents = docsRes.rows;
      
      // Group documents by application_id
      const docsByApp = {};
      documents.forEach(d => {
        if (!docsByApp[d.application_id]) docsByApp[d.application_id] = [];
        docsByApp[d.application_id].push(d);
      });
      
      applications.forEach(a => {
        a.documents = docsByApp[a.id] || [];
      });
    }

    return { customer, applications, toolOrders };
  }
`;

content = content.replace(
  /async getCustomers\(conditions, params\) \{[\s\S]*?return result\.rows;\n\s*\}/m,
  match => match + '\n' + newMethod
);

fs.writeFileSync('backend/src/repositories/adminRepository.js', content);
