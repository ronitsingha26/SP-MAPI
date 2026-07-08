import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, FileText, Wrench,
  CreditCard, BarChart2, Settings, LogOut, Menu, X,
  Search, UserCircle, Leaf, MapPin, Shield, ClipboardList,
  UserCheck, Megaphone, Map, GitBranch, FolderOpen, Mail
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import { useAuth } from '../context/AuthContext';

// Nav config per role
const navConfigs = {
  customer: {
    label: 'Customer Portal',
    color: 'brand-green',
    prefix: '/customer',
    groups: [
      {
        label: 'Overview',
        links: [
          { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/customer/profile', label: 'My Profile', icon: UserCircle },
        ]
      },
      {
        label: 'Apply for Services',
        links: [
          { to: '/customer/services/mapi', label: 'Apply for Mapi', icon: ClipboardList },
          { to: '/customer/services/bantwara', label: 'Apply for Batwara', icon: GitBranch },
          { to: '/customer/services/map', label: 'Apply for Map', icon: Map },
          { to: '/customer/services/tools', label: 'Apply for Amin Tools', icon: Wrench },
        ]
      },
      {
        label: 'Track & Manage',
        links: [
          { to: '/customer/applications', label: 'My Applications', icon: FolderOpen },
          { to: '/customer/documents', label: 'Documents', icon: FileText },
          { to: '/customer/payments', label: 'Payments', icon: CreditCard },
          { to: '/customer/invoices', label: 'Invoices', icon: FileText },
        ]
      }
    ]
  },
  admin: {
    label: 'Admin Panel',
    color: 'brand-green',
    prefix: '/admin',
    groups: [
      {
        label: 'Applications',
        links: [
          { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/mapi', label: 'Mapi', icon: ClipboardList },
          { to: '/admin/bantwara', label: 'Bantwara', icon: GitBranch },
          { to: '/admin/map-requests', label: 'Map Requests', icon: Map },
          { to: '/admin/tools-orders', label: 'Tool Orders', icon: Wrench },
        ]
      },
      {
        label: 'Management',
        links: [
          { to: '/admin/customers', label: 'Customers', icon: Users },
          { to: '/admin/amins', label: 'Amins', icon: UserCheck },
          { to: '/admin/documents', label: 'Documents', icon: FileText },
          { to: '/admin/payments', label: 'Payments', icon: CreditCard },
          { to: '/admin/reports', label: 'Reports', icon: BarChart2 },
          { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
        ]
      },
      {
        label: 'Administration',
        links: [
          { to: '/admin/admins', label: 'Manage Admins', icon: Shield },
          { to: '/admin/districts', label: 'Districts', icon: MapPin },
          { to: '/admin/users', label: 'All Users', icon: Users },
          { to: '/admin/financials', label: 'Financial Reports', icon: BarChart2 },
          { to: '/admin/services-config', label: 'Pricing & Tools', icon: Settings },
          { to: '/admin/permissions', label: 'Permissions', icon: Shield },
          { to: '/admin/audit', label: 'Audit Logs', icon: FileText },
          { to: '/admin/broadcast', label: 'Broadcast', icon: Megaphone },
        ]
      }
    ]
  },
  amin: {
    label: 'Amin Portal',
    color: 'brand-green',
    prefix: '/amin',
    links: [
      { to: '/amin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/amin/tasks', label: 'My Assignments', icon: ClipboardList },
      { to: '/amin/history', label: 'Completed Surveys', icon: BarChart2 },
    ]
  },
  // Superadmin role now uses same admin panel
  superadmin: {
    label: 'Admin Panel',
    color: 'brand-green',
    prefix: '/admin',
    groups: [
      {
        label: 'Applications',
        links: [
          { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/mapi', label: 'Mapi', icon: ClipboardList },
          { to: '/admin/bantwara', label: 'Bantwara', icon: GitBranch },
          { to: '/admin/map-requests', label: 'Map Requests', icon: Map },
          { to: '/admin/tools-orders', label: 'Tool Orders', icon: Wrench },
        ]
      },
      {
        label: 'Management',
        links: [
          { to: '/admin/customers', label: 'Customers', icon: Users },
          { to: '/admin/amins', label: 'Amins', icon: UserCheck },
          { to: '/admin/payments', label: 'Payments', icon: CreditCard },
          { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
        ]
      },
      {
        label: 'Administration',
        links: [
          { to: '/admin/admins', label: 'Manage Admins', icon: Shield },
          { to: '/admin/districts', label: 'Districts', icon: MapPin },
          { to: '/admin/users', label: 'All Users', icon: Users },
          { to: '/admin/financials', label: 'Financial Reports', icon: BarChart2 },
          { to: '/admin/services-config', label: 'Pricing & Tools', icon: Settings },
          { to: '/admin/audit', label: 'Audit Logs', icon: FileText },
          { to: '/admin/broadcast', label: 'Broadcast', icon: Megaphone },
        ]
      }
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
    if (role === 'admin' || role === 'superadmin') {
      navigate('/admin/login');
    } else if (role === 'amin') {
      navigate('/amin/login');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-brand-cream flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#112318] border-r border-[#1B3625] shadow-soft
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1B3625]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-gradient rounded-xl flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">SP MAPI</p>
              <p className="text-[10px] text-brand-green-light">{config.label}</p>
            </div>
          </div>
          <button className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {config.groups ? (
            // Grouped nav (admin/superadmin)
            <div className="space-y-5">
              {config.groups.map((group) => (
                <div key={group.label}>
                  <p className="px-3 mb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.links.map(({ to, label, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-brand-green text-white shadow-md'
                              : 'text-gray-300 hover:bg-[#1B3625] hover:text-white'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Flat nav (customer, amin)
            <div className="space-y-0.5">
              {(config.links || []).map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-green text-white shadow-md'
                        : 'text-gray-300 hover:bg-[#1B3625] hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </nav>


        {/* Logout */}
        <div className="p-4 border-t border-[#1B3625]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#1B3625] flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-brand-green-light" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              {userDistrict && <p className="text-xs text-gray-400 truncate">{userDistrict}</p>}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium border border-red-500/20"
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

          <div className="flex-1" />

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <NotificationBell />
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
