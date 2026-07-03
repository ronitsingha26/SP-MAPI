import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages (eagerly loaded — above the fold)
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import UnderConstructionPage from './pages/public/UnderConstructionPage';

// ── Lazy-loaded New Service Registration Pages ──
const MapiRegistrationPage = lazy(() => import('./pages/public/services/MapiRegistrationPage'));
const BantwaraRegistrationPage = lazy(() => import('./pages/public/services/BantwaraRegistrationPage'));
const ProvideMapPage = lazy(() => import('./pages/public/services/ProvideMapPage'));

// ── Lazy-loaded Login Pages ──
const CustomerLoginPage = lazy(() => import('./pages/customer/CustomerLoginPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AminLoginPage = lazy(() => import('./pages/amin/AminLoginPage'));
const SuperAdminLoginPage = lazy(() => import('./pages/superadmin/SuperAdminLoginPage'));

// ── Lazy-loaded Customer Pages ──
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'));
const CustomerApplicationsPage = lazy(() => import('./pages/customer/CustomerApplicationsPage'));
const MapiApplicationsPage = lazy(() => import('./pages/customer/MapiApplicationsPage'));
const BantwaraApplicationsPage = lazy(() => import('./pages/customer/BantwaraApplicationsPage'));
const MapRequestsPage = lazy(() => import('./pages/customer/MapRequestsPage'));
const CustomerServicesPage = lazy(() => import('./pages/customer/CustomerServicesPage'));
const NewServiceRequestPage = lazy(() => import('./pages/customer/NewServiceRequestPage'));
const CustomerDocumentsPage = lazy(() => import('./pages/customer/CustomerDocumentsPage'));
const CustomerPaymentsPage = lazy(() => import('./pages/customer/CustomerPaymentsPage'));
const CustomerProfilePage = lazy(() => import('./pages/customer/CustomerProfilePage'));

// ── Lazy-loaded Admin Pages ──
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMapiPage = lazy(() => import('./pages/admin/AdminMapiPage'));
const AdminBantwaraPage = lazy(() => import('./pages/admin/AdminBantwaraPage'));
const AdminMapRequestsPage = lazy(() => import('./pages/admin/AdminMapRequestsPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminAminsPage = lazy(() => import('./pages/admin/AdminAminsPage'));
const AdminDocumentsPage = lazy(() => import('./pages/admin/AdminDocumentsPage'));
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'));

// ── Lazy-loaded Amin Pages ──
const AminDashboard = lazy(() => import('./pages/amin/AminDashboard'));
const AminTasksPage = lazy(() => import('./pages/amin/AminTasksPage'));

// ── Lazy-loaded Super Admin Pages ──
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'));
const SuperAdminAdminsPage = lazy(() => import('./pages/superadmin/SuperAdminAdminsPage'));

// Loading spinner for lazy-loaded routes
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-brand-green border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-brand-text-muted font-medium">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Routes ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/mapi" element={<MapiRegistrationPage />} />
            <Route path="/services/bantwara" element={<BantwaraRegistrationPage />} />
            <Route path="/services/provide-map" element={<ProvideMapPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/under-construction" element={<UnderConstructionPage />} />
          </Route>

          {/* ── Login Routes ── */}
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/amin/login" element={<AminLoginPage />} />
          <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />

          {/* ── Customer Dashboard Routes ── */}
          <Route element={<DashboardLayout role="customer" />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/applications" element={<CustomerApplicationsPage />} />
            <Route path="/customer/mapi" element={<MapiApplicationsPage />} />
            <Route path="/customer/bantwara" element={<BantwaraApplicationsPage />} />
            <Route path="/customer/map-requests" element={<MapRequestsPage />} />
            <Route path="/customer/services" element={<CustomerServicesPage />} />
            <Route path="/customer/services/new" element={<NewServiceRequestPage />} />
            <Route path="/customer/documents" element={<CustomerDocumentsPage />} />
            <Route path="/customer/payments" element={<CustomerPaymentsPage />} />
            <Route path="/customer/profile" element={<CustomerProfilePage />} />
          </Route>

          {/* ── Admin Dashboard Routes ── */}
          <Route element={<DashboardLayout role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/mapi" element={<AdminMapiPage />} />
            <Route path="/admin/bantwara" element={<AdminBantwaraPage />} />
            <Route path="/admin/map-requests" element={<AdminMapRequestsPage />} />
            <Route path="/admin/customers" element={<AdminCustomersPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/amins" element={<AdminAminsPage />} />
            <Route path="/admin/documents" element={<AdminDocumentsPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
          </Route>

          {/* ── Amin Dashboard Routes ── */}
          <Route element={<DashboardLayout role="amin" />}>
            <Route path="/amin/dashboard" element={<AminDashboard />} />
            <Route path="/amin/tasks" element={<AminTasksPage />} />
          </Route>

          {/* ── Super Admin Dashboard Routes ── */}
          <Route element={<DashboardLayout role="superadmin" userName="Super Admin" />}>
            <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/admins" element={<SuperAdminAdminsPage />} />
          </Route>

          {/* ── Redirect shortcuts ── */}
          <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/amin" element={<Navigate to="/amin/dashboard" replace />} />
          <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
