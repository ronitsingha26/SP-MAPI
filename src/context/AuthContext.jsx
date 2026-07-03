import { createContext, useContext, useState, useEffect } from 'react';
import { generateAppId } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('spmapi_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('spmapi_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('spmapi_user');
    }
  }, [currentUser]);

  // Register a new customer account
  const register = ({ name, email, password, mobile, fatherName, ...rest }) => {
    // Check if email already exists
    const allUsers = getAllUsers();
    if (allUsers.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }

    const userId = `CUST-${Date.now()}`;
    const appId = generateAppId('MAPI');

    const newUser = {
      id: userId,
      name,
      email,
      password, // NOTE: plain text for demo — hash on real backend
      mobile,
      fatherName,
      ...rest,
      role: 'customer',
      createdAt: new Date().toISOString(),
      primaryAppId: appId,
    };

    // Save user to users list
    const users = getAllUsers();
    users.push(newUser);
    localStorage.setItem('spmapi_users', JSON.stringify(users));

    // Auto-login
    const { password: _pw, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    return { user: safeUser, appId };
  };

  // Login with email + password
  const login = (email, password) => {
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password.');
    const { password: _pw, ...safeUser } = user;
    setCurrentUser(safeUser);
    return safeUser;
  };

  // Admin Login
  const adminLogin = (email, password) => {
    // Allow 'admin', 'admin@spmapi.com', or 'admin@gmail.com' for demo purposes
    if ((email === 'admin' || email === 'admin@spmapi.com' || email === 'admin@gmail.com') && password === 'admin') {
      const adminUser = { id: 'admin-001', name: 'System Admin', email: 'admin@spmapi.com', role: 'admin' };
      setCurrentUser(adminUser);
      return adminUser;
    }
    throw new Error('Invalid admin credentials.');
  };

  // Mock Google Login
  const loginWithGoogle = () => {
    // Generate a mock user to simulate successful OAuth login
    const googleUser = {
      id: `G-${Date.now()}`,
      name: 'Demo Google User',
      email: 'user@gmail.com',
      role: 'customer',
      primaryAppId: `MAPI-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    const users = getAllUsers();
    // In a real app we'd check if they exist, but for mock we just add or login directly
    users.push(googleUser);
    localStorage.setItem('spmapi_users', JSON.stringify(users));
    
    setCurrentUser(googleUser);
    return googleUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Update user profile
  const updateUser = (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    // Also update in users list
    const users = getAllUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) { users[idx] = { ...users[idx], ...updates }; }
    localStorage.setItem('spmapi_users', JSON.stringify(users));
  };

  return (
    <AuthContext.Provider value={{ currentUser, register, login, adminLogin, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

// Helper — not exported from context so it can be used internally
function getAllUsers() {
  try {
    return JSON.parse(localStorage.getItem('spmapi_users') || '[]');
  } catch { return []; }
}
