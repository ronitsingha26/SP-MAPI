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

// ── Handle 401 globally — clear session ──────────────────────
api.interceptors.response.use(
  (response) => response,
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
