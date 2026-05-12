'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const IGIM_AUTH_KEY = 'igim_auth_ok';
const IGIM_USER = 'SSFP';
const IGIM_PASS = 'Samrudhi@2026';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem(IGIM_AUTH_KEY) === '1';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  const login = useCallback((userId: string, password: string): boolean => {
    if (userId === IGIM_USER && password === IGIM_PASS) {
      localStorage.setItem(IGIM_AUTH_KEY, '1');
      setIsAuthenticated(true);
      router.replace('/');
      return true;
    }
    return false;
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(IGIM_AUTH_KEY);
    setIsAuthenticated(false);
    router.replace('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
