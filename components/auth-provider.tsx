"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

const IGIM_AUTH_KEY = "igim_auth_ok";
const IGIM_USER = "SSFP";
const IGIM_PASS = "Samrudhi@2026";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authOk = localStorage.getItem(IGIM_AUTH_KEY) === "1";
    setIsAuthenticated(authOk);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isLoginPage = pathname === "/login";

    if (!isAuthenticated && !isLoginPage) {
      router.replace("/login");
    } else if (isAuthenticated && isLoginPage) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = useCallback((userId: string, password: string): boolean => {
    if (userId === IGIM_USER && password === IGIM_PASS) {
      localStorage.setItem(IGIM_AUTH_KEY, "1");
      setIsAuthenticated(true);
      router.replace("/");
      return true;
    }
    return false;
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(IGIM_AUTH_KEY);
    setIsAuthenticated(false);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
