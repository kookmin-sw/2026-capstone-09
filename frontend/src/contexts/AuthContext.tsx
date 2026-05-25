'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode } from 'react';
import { authStorage } from '@/api/authStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    const token = authStorage.getAccess();
    return !!token;
  });
  const [isLoading] = useState(false);
  const router = useRouter();

  const login = (accessToken: string, refreshToken: string) => {
    authStorage.setTokens(accessToken, refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authStorage.clear();
    setIsAuthenticated(false);
    router.replace('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}