import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  'admin@infosys.com': { id: 1, name: 'Admin User', email: 'admin@infosys.com', role: 'ADMIN', isActive: true, isLocked: false, lastLogin: new Date().toISOString(), createdAt: '2024-01-01' },
  'manager@infosys.com': { id: 2, name: 'Procurement Manager', email: 'manager@infosys.com', role: 'PROCUREMENT_MANAGER', isActive: true, isLocked: false, lastLogin: new Date().toISOString(), createdAt: '2024-01-01' },
  'vendor@company.com': { id: 3, name: 'Vendor User', email: 'vendor@company.com', role: 'VENDOR', isActive: true, isLocked: false, lastLogin: new Date().toISOString(), createdAt: '2024-01-01' },
  'compliance@infosys.com': { id: 4, name: 'Compliance Officer', email: 'compliance@infosys.com', role: 'COMPLIANCE_OFFICER', isActive: true, isLocked: false, lastLogin: new Date().toISOString(), createdAt: '2024-01-01' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('vms_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, _password: string) => {
    const mockUser = MOCK_USERS[email];
    if (!mockUser) throw new Error('Invalid credentials');
    setUser(mockUser);
    localStorage.setItem('vms_user', JSON.stringify(mockUser));
    localStorage.setItem('vms_token', 'mock-jwt-token');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('vms_user');
    localStorage.removeItem('vms_token');
  }, []);

  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    if (!user) return false;
    return Array.isArray(role) ? role.includes(user.role) : user.role === role;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
