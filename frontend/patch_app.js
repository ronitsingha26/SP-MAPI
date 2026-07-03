const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// Add imports
if (!content.includes('AdminEnquiriesPage')) {
  const adminImportAnchor = "import AdminReportsPage from './pages/admin/AdminReportsPage';";
  content = content.replace(adminImportAnchor, adminImportAnchor + "\nimport AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';");
}
if (!content.includes('SuperAdminEnquiriesPage')) {
  const saImportAnchor = "import SuperAdminFinancialsPage from './pages/superadmin/SuperAdminFinancialsPage';";
  content = content.replace(saImportAnchor, saImportAnchor + "\nimport SuperAdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';"); 
  // Just reusing the same page for superadmin since it's the exact same view
}

// Add routes
if (!content.includes('path="/admin/enquiries"')) {
  const adminRouteAnchor = '<Route path="/admin/reports" element={<AdminReportsPage />} />';
  content = content.replace(adminRouteAnchor, adminRouteAnchor + '\n            <Route path="/admin/enquiries" element={<AdminEnquiriesPage />} />');
}
if (!content.includes('path="/superadmin/enquiries"')) {
  const saRouteAnchor = '<Route path="/superadmin/admins" element={<SuperAdminAdminsPage />} />';
  content = content.replace(saRouteAnchor, saRouteAnchor + '\n            <Route path="/superadmin/enquiries" element={<SuperAdminEnquiriesPage />} />');
}

fs.writeFileSync('src/App.jsx', content);
console.log('Patched App.jsx');
