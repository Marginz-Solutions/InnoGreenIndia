"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

const IGIM_AUTH_KEY = "igim_auth_ok";
const IGIM_USER = "SSFP";
const IGIM_PASS = "Samrudhi@2026";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authStatus = localStorage.getItem(IGIM_AUTH_KEY) === "1";
    setIsAuthenticated(authStatus);
    setIsLoading(false);

    if (!authStatus && pathname !== "/login") {
      router.replace("/login");
    }
  }, [pathname, router]);

  const login = (userId: string, password: string): boolean => {
    if (userId === IGIM_USER && password === IGIM_PASS) {
      localStorage.setItem(IGIM_AUTH_KEY, "1");
      setIsAuthenticated(true);
      router.replace("/");
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(IGIM_AUTH_KEY);
    setIsAuthenticated(false);
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07130b] via-[#12311b] to-[#2b7a32]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
