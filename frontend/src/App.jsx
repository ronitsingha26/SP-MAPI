import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages (eagerly loaded — above the fold)
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import PropertiesPage from './pages/public/PropertiesPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';

// ── Lazy-loaded Login/Register Pages ──
const CustomerLoginPage = lazy(() => import('./pages/customer/CustomerLoginPage'));
const CustomerRegisterPage = lazy(() => import('./pages/customer/CustomerRegisterPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AminLoginPage = lazy(() => import('./pages/amin/AminLoginPage'));
const AminApplicationPage = lazy(() => import('./pages/public/AminApplicationPage'));
const AminApplicationSuccessPage = lazy(() => import('./pages/public/AminApplicationSuccessPage'));

// ── Lazy-loaded Customer Pages ──
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'));
const CustomerApplicationsPage = lazy(() => import('./pages/customer/CustomerApplicationsPage'));
const CustomerServicesPage = lazy(() => import('./pages/customer/CustomerServicesPage'));
const CustomerDocumentsPage = lazy(() => import('./pages/customer/CustomerDocumentsPage'));
const CustomerPaymentsPage = lazy(() => import('./pages/customer/CustomerPaymentsPage'));
const CustomerInvoicesPage = lazy(() => import('./pages/customer/CustomerInvoicesPage'));
const CustomerProfilePage = lazy(() => import('./pages/customer/CustomerProfilePage'));
const CustomerBookingsPage = lazy(() => import('./pages/customer/CustomerBookingsPage'));
// Customer portal service forms
const CustomerMapiForm = lazy(() => import('./pages/customer/services/CustomerMapiForm'));
const CustomerBantwaraForm = lazy(() => import('./pages/customer/services/CustomerBantwaraForm'));
const CustomerMapForm = lazy(() => import('./pages/customer/services/CustomerMapForm'));
const CustomerToolsForm = lazy(() => import('./pages/customer/services/CustomerToolsForm'));

// ── Lazy-loaded Admin Pages ──
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMapiPage = lazy(() => import('./pages/admin/AdminMapiPage'));
const AdminBantwaraPage = lazy(() => import('./pages/admin/AdminBantwaraPage'));
const AdminMapRequestsPage = lazy(() => import('./pages/admin/AdminMapRequestsPage'));
const AdminToolsOrdersPage = lazy(() => import('./pages/admin/AdminToolsOrdersPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminAminsPage = lazy(() => import('./pages/admin/AdminAminsPage'));
const AdminDocumentsPage = lazy(() => import('./pages/admin/AdminDocumentsPage'));
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'));
const AdminEnquiriesPage = lazy(() => import('./pages/admin/AdminEnquiriesPage'));
const AdminPropertiesPage = lazy(() => import('./pages/admin/AdminPropertiesPage'));
const AdminBookingsPage = lazy(() => import('./pages/admin/AdminBookingsPage'));

// ── Admin — Merged SuperAdmin pages ──
const AdminDistrictsPage = lazy(() => import('./pages/admin/AdminDistrictsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminFinancialsPage = lazy(() => import('./pages/admin/AdminFinancialsPage'));
const AdminServicesConfigPage = lazy(() => import('./pages/admin/AdminServicesConfigPage'));
const AdminAuditPage = lazy(() => import('./pages/admin/AdminAuditPage'));
const AdminBroadcastPage = lazy(() => import('./pages/admin/AdminBroadcastPage'));
const AdminAdminsPage = lazy(() => import('./pages/admin/AdminAdminsPage'));
const AdminPermissionsPage = lazy(() => import('./pages/admin/AdminPermissionsPage'));

// ── Lazy-loaded Amin Pages ──
const AminDashboard = lazy(() => import('./pages/amin/AminDashboard'));
const AminTasksPage = lazy(() => import('./pages/amin/AminTasksPage'));
const AminHistoryPage = lazy(() => import('./pages/amin/AminHistoryPage'));

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

// Redirect logged-in users away from login/register pages
function AuthRoute({ children }) {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  if (!currentUser) return children;

  // If there's a redirect param, go there after login
  if (redirect) return <Navigate to={redirect} replace />;

  const role = currentUser.role || 'customer';
  if (role === 'admin' || role === 'superadmin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to={`/${role}/dashboard`} replace />;
}

// Protect dashboard routes — redirect to login if not authenticated
function ProtectedRoute({ role, children }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    const loginMap = { admin: '/admin/login', amin: '/amin/login', superadmin: '/admin/login' };
    return <Navigate to={loginMap[role] || '/login'} replace />;
  }
  // Allow both admin and superadmin to access admin routes
  if (role === 'admin' && (currentUser.role === 'admin' || currentUser.role === 'superadmin')) {
    return children;
  }
  if (currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
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
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/apply-amin" element={<AminApplicationPage />} />
            <Route path="/apply-amin/success" element={<AminApplicationSuccessPage />} />
          </Route>

          {/* ── Auth Routes (Login / Register) ── */}
          <Route path="/login" element={<AuthRoute><CustomerLoginPage /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><CustomerRegisterPage /></AuthRoute>} />
          <Route path="/admin/login" element={<AuthRoute><AdminLoginPage /></AuthRoute>} />
          <Route path="/amin/login" element={<AuthRoute><AminLoginPage /></AuthRoute>} />
          <Route path="/superadmin/login" element={<Navigate to="/admin/login" replace />} />

          {/* ── Customer Dashboard Routes ── */}
          <Route element={<ProtectedRoute role="customer"><DashboardLayout role="customer" /></ProtectedRoute>}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/applications" element={<CustomerApplicationsPage />} />
            <Route path="/customer/services" element={<CustomerServicesPage />} />
            <Route path="/customer/services/mapi" element={<CustomerMapiForm />} />
            <Route path="/customer/services/bantwara" element={<CustomerBantwaraForm />} />
            <Route path="/customer/services/map" element={<CustomerMapForm />} />
            <Route path="/customer/services/tools" element={<CustomerToolsForm />} />
            <Route path="/customer/documents" element={<CustomerDocumentsPage />} />
            <Route path="/customer/payments" element={<CustomerPaymentsPage />} />
            <Route path="/customer/invoices" element={<CustomerInvoicesPage />} />
            <Route path="/customer/profile" element={<CustomerProfilePage />} />
            <Route path="/customer/bookings" element={<CustomerBookingsPage />} />
          </Route>

          {/* ── Unified Admin Dashboard Routes ── */}
          <Route element={<ProtectedRoute role="admin"><DashboardLayout role="admin" /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/mapi" element={<AdminMapiPage />} />
            <Route path="/admin/bantwara" element={<AdminBantwaraPage />} />
            <Route path="/admin/map-requests" element={<AdminMapRequestsPage />} />
            <Route path="/admin/tools-orders" element={<AdminToolsOrdersPage />} />
            <Route path="/admin/customers" element={<AdminCustomersPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/amins" element={<AdminAminsPage />} />
            <Route path="/admin/documents" element={<AdminDocumentsPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/enquiries" element={<AdminEnquiriesPage />} />
            <Route path="/admin/properties" element={<AdminPropertiesPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            {/* Merged SuperAdmin pages — now under /admin */}
            <Route path="/admin/admins" element={<AdminAdminsPage />} />
            <Route path="/admin/districts" element={<AdminDistrictsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/financials" element={<AdminFinancialsPage />} />
            <Route path="/admin/services-config" element={<AdminServicesConfigPage />} />
            <Route path="/admin/audit" element={<AdminAuditPage />} />
            <Route path="/admin/broadcast" element={<AdminBroadcastPage />} />
            <Route path="/admin/permissions" element={<AdminPermissionsPage />} />
          </Route>

          {/* ── Amin Dashboard Routes ── */}
          <Route element={<ProtectedRoute role="amin"><DashboardLayout role="amin" /></ProtectedRoute>}>
            <Route path="/amin/dashboard" element={<AminDashboard />} />
            <Route path="/amin/tasks" element={<AminTasksPage />} />
            <Route path="/amin/history" element={<AminHistoryPage />} />
          </Route>

          {/* ── SuperAdmin redirect to Admin (backward compat) ── */}
          <Route path="/superadmin/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/superadmin/*" element={<Navigate to="/admin/dashboard" replace />} />

          {/* ── Redirect shortcuts ── */}
          <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/amin" element={<Navigate to="/amin/dashboard" replace />} />
          <Route path="/superadmin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* ── Legacy public service routes → redirect to login ── */}
          <Route path="/services/mapi" element={<Navigate to="/login?redirect=/customer/services/mapi" replace />} />
          <Route path="/services/bantwara" element={<Navigate to="/login?redirect=/customer/services/bantwara" replace />} />
          <Route path="/services/provide-map" element={<Navigate to="/login?redirect=/customer/services/map" replace />} />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
