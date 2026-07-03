import { createContext, useContext, useState, useEffect } from 'react';
import api, { saveToken, removeToken } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('spmapi_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [authLoading, setAuthLoading] = useState(false);

  // Persist user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('spmapi_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('spmapi_user');
    }
  }, [currentUser]);

  // ── Customer Registration ────────────────────────────────────
  const register = async ({
    name, mobile, email, password, fatherName,
    district, state, block, village, wardNumber, panchayat,
    mouza, policeStation, pincode, address, aadhaarNumber
  }) => {
    setAuthLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name, mobile, email, password,
        father_name: fatherName,
        district, state,
        block: block || null,
        village: village || null,
        ward_number: wardNumber || null,
        panchayat: panchayat || null,
        mouza: mouza || null,
        police_station: policeStation || null,
        pincode: pincode || null,
        address: address || null,
        aadhaar_number: aadhaarNumber,
      });
      const { token, user } = res.data;
      saveToken(token);
      setCurrentUser({ ...user, role: 'customer' });
      return { user, token };
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Customer Login ───────────────────────────────────────────
  const login = async (mobileOrEmail, password) => {
    setAuthLoading(true);
    try {
      const isMobile = /^\d{10}$/.test(mobileOrEmail);
      const payload = isMobile
        ? { mobile: mobileOrEmail, password }
        : { email: mobileOrEmail, password };

      const res = await api.post('/auth/login', payload);
      const { token, user } = res.data;
      saveToken(token);
      setCurrentUser({ ...user, role: 'customer' });
      return user;
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Admin / Super Admin Login ────────────────────────────────
  const adminLogin = async (email, password) => {
    setAuthLoading(true);
    try {
      const res = await api.post('/auth/admin/login', { email, password });
      const { token, user } = res.data;
      saveToken(token);
      setCurrentUser(user);
      return user;
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Amin Login ───────────────────────────────────────────────
  const aminLogin = async (mobile, password) => {
    setAuthLoading(true);
    try {
      const res = await api.post('/auth/amin/login', { mobile, password });
      const { token, user } = res.data;
      saveToken(token);
      setCurrentUser({ ...user, role: 'amin' });
      return user;
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Logout ───────────────────────────────────────────────────
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) { /* ignore */ } finally {
      removeToken();
      setCurrentUser(null);
    }
  };

  // ── Update User (local state only — profile update done via API separately) ──
  const updateUser = (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      currentUser, authLoading,
      register, login, adminLogin, aminLogin, logout, updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
