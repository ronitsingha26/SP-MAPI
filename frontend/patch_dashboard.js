const fs = require('fs');

let content = fs.readFileSync('src/layouts/DashboardLayout.jsx', 'utf8');

// Find the start and end of navConfigs
const startIdx = content.indexOf('const navConfigs = {');
const endIdx = content.indexOf('export default function DashboardLayout');

if (startIdx > -1 && endIdx > -1) {
  const newConfig = `const navConfigs = {
  customer: {
    label: 'Customer Portal',
    color: 'brand-green',
    prefix: '/customer',
    links: [
      { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/customer/applications', label: 'My Applications', icon: FolderOpen },
      { to: '/customer/bookings', label: 'My Bookings', icon: MapPin },
      { to: '/customer/services', label: 'New Application', icon: Wrench },
      { to: '/customer/documents', label: 'Documents', icon: FileText },
      { to: '/customer/payments', label: 'Payments', icon: CreditCard },
      { to: '/customer/invoices', label: 'Invoices', icon: FileText },
      { to: '/customer/profile', label: 'Profile', icon: UserCircle },
    ]
  },
  admin: {
    label: 'Admin Panel',
    color: 'brand-green',
    prefix: '/admin',
    links: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/mapi', label: 'Mapi Applications', icon: ClipboardList },
      { to: '/admin/bantwara', label: 'Bantwara Applications', icon: GitBranch },
      { to: '/admin/map-requests', label: 'Map Requests', icon: Map },
      { to: '/admin/properties', label: 'Properties', icon: Building2 },
      { to: '/admin/bookings', label: 'Bookings', icon: CreditCard },
      { to: '/admin/customers', label: 'Customers', icon: Users },
      { to: '/admin/amins', label: 'Amins', icon: UserCheck },
      { to: '/admin/documents', label: 'Documents', icon: FileText },
      { to: '/admin/payments', label: 'Payments', icon: CreditCard },
      { to: '/admin/reports', label: 'Reports', icon: BarChart2 },
      { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
    ]
  },
  amin: {
    label: 'Amin Portal',
    color: 'brand-green',
    prefix: '/amin',
    links: [
      { to: '/amin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/amin/tasks', label: 'My Tasks', icon: ClipboardList },
      { to: '/amin/history', label: 'Task History', icon: BarChart2 },
    ]
  },
  superadmin: {
    label: 'Super Admin',
    color: 'brand-green',
    prefix: '/superadmin',
    links: [
      { to: '/superadmin/dashboard', label: 'Master Dashboard', icon: LayoutDashboard },
      { to: '/superadmin/enquiries', label: 'Enquiries', icon: Mail },
      { to: '/superadmin/properties', label: 'Properties', icon: Building2 },
      { to: '/superadmin/admins', label: 'Manage Admins', icon: Shield },
      { to: '/superadmin/districts', label: 'Districts', icon: MapPin },
      { to: '/superadmin/users', label: 'All Users', icon: Users },
      { to: '/superadmin/financials', label: 'Financial Reports', icon: BarChart2 },
      { to: '/superadmin/services', label: 'Service Config', icon: Settings },
      { to: '/superadmin/permissions', label: 'Permissions', icon: Shield },
      { to: '/superadmin/audit', label: 'Audit Logs', icon: FileText },
      { to: '/superadmin/broadcast', label: 'Broadcast', icon: Megaphone },
    ]
  }
};

`;
  
  content = content.substring(0, startIdx) + newConfig + content.substring(endIdx);
  
  // also add Mail import if missing
  if (!content.includes('Mail')) {
    content = content.replace('LogOut, Menu, X,', 'LogOut, Menu, X, Mail,');
  }

  fs.writeFileSync('src/layouts/DashboardLayout.jsx', content);
  console.log('Fixed DashboardLayout.jsx');
}
