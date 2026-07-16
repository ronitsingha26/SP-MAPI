import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Attach JWT token to every request ────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('spmapi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Handle 401 globally and Auto-Parse JSON fields ──────────────────────
api.interceptors.response.use(
  (response) => {
    const jsonFields = ['documents', 'co_owners', 'status_history', 'photos', 'tools', 'old_value', 'new_value', 'images'];
    const parseJsonFields = (obj) => {
      if (Array.isArray(obj)) {
        obj.forEach(parseJsonFields);
      } else if (obj !== null && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          if (jsonFields.includes(key) && typeof obj[key] === 'string') {
            try {
              obj[key] = JSON.parse(obj[key]);
            } catch(e) {
              // ignore parse errors, keep as string
            }
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            parseJsonFields(obj[key]);
          }
        });
      }
    };
    if (response.data) {
      parseJsonFields(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Determine which login page to redirect to based on stored user role
      let loginPath = '/login';
      try {
        const storedUser = localStorage.getItem('spmapi_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const role = user?.role;
          if (role === 'superadmin') loginPath = '/superadmin/login';
          else if (role === 'admin') loginPath = '/admin/login';
          else if (role === 'amin') loginPath = '/amin/login';
        }
      } catch (_) { /* ignore parse errors */ }

      localStorage.removeItem('spmapi_token');
      localStorage.removeItem('spmapi_user');
      // Redirect to appropriate login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = loginPath;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth Helpers ──────────────────────────────────────────────
export const saveToken = (token) => localStorage.setItem('spmapi_token', token);
export const getToken  = () => localStorage.getItem('spmapi_token');
export const removeToken = () => {
  localStorage.removeItem('spmapi_token');
  localStorage.removeItem('spmapi_user');
};

export const getFileUrl = (filePath) => {
  if (!filePath) return '';
  if (filePath.startsWith('http')) return filePath;
  // Use API_BASE but also try without /api suffix for direct file access
  const base = API_BASE.replace(/\/api\/?$/, '');
  const path = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${base}${path}`;
};
