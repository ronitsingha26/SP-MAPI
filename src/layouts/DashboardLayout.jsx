import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, FileText, Wrench,
  CreditCard, BarChart2, Settings, LogOut, Menu, X,
  Bell, Search, UserCircle, Leaf, MapPin, Shield, ClipboardList,
  UserCheck, Megaphone, Map, GitBranch, FolderOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Nav config per role
const navConfigs = {
  customer: {
    label: 'Customer Portal',
    color: 'brand-green',
    prefix: '/customer',
    links: [
      { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/customer/applications', label: 'My Applications', icon: FolderOpen },
      { to: '/customer/mapi', label: 'Mapi (Land Meas.)', icon: ClipboardList },
      { to: '/customer/bantwara', label: 'Bantwara (Div.)', icon: GitBranch },
      { to: '/customer/map-requests', label: 'Map Requests', icon: Map },
      { to: '/customer/documents', label: 'My Documents', icon: FileText },
      { to: '/customer/payments', label: 'Payments', icon: CreditCard },
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
      { to: '/admin/customers', label: 'Customers', icon: Users },
      { to: '/admin/amins', label: 'Amins', icon: UserCheck },
      { to: '/admin/documents', label: 'Documents', icon: FileText },
      { to: '/admin/payments', label: 'Payments', icon: CreditCard },
      { to: '/admin/reports', label: 'Reports', icon: BarChart2 },
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

export default function DashboardLayout({ role = 'customer' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const config = navConfigs[role];

  // Dynamic values
  const userName = currentUser?.name || 'User';
  const userDistrict = currentUser?.district || '';

  const handleLogout = () => {
    logout();
    if (role === 'admin') {
      navigate('/admin/login');
    } else if (role === 'amin') {
      navigate('/amin/login');
    } else if (role === 'superadmin') {
      navigate('/superadmin/login');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-brand-cream flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-brand-green-pale shadow-soft
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-brand-green-pale">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-gradient rounded-xl flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-brand-text text-sm">SP MAPI</p>
              <p className="text-[10px] text-brand-text-muted">{config.label}</p>
            </div>
          </div>
          <button className="lg:hidden p-1.5 hover:bg-brand-green-pale rounded-lg" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {config.links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-brand-green-pale">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-green-pale flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-brand-green" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-brand-text truncate">{userName}</p>
              {userDistrict && <p className="text-[10px] text-brand-text-muted truncate">{userDistrict}</p>}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-brand-green-pale flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-30 shadow-soft">
          <button
            className="lg:hidden p-2 hover:bg-brand-green-pale rounded-xl transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-brand-text" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden sm:flex items-center gap-2 bg-brand-green-pale rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-brand-text-muted" />
            <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none text-brand-text placeholder:text-brand-text-muted flex-1" />
          </div>

          <div className="flex-1 sm:flex-none" />

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-brand-green-pale rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-brand-text-muted" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-green rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-brand-green-pale">
              <div className="w-8 h-8 rounded-full bg-brand-yellow-pale flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-brand-text hidden sm:block">{userName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
