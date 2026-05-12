"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login, isLoading, isAuthenticated } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const success = login(userId, password);
    if (!success) {
      setError(true);
    }
  };

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-[76px] h-[76px] flex items-center justify-center rounded-xl bg-[#edf8ee] border border-[#dbe8dc]">
            <span className="text-2xl font-bold text-[#166534]">IGIM</span>
          </div>
          <div>
            <h1 className="m-0 text-[28px] font-bold text-[#10361c]">IGIM Login</h1>
            <p className="mt-1.5 text-[#577266]">Secure access for field staff, retail planning, and management.</p>
          </div>
        </div>

        <label htmlFor="userid">User ID</label>
        <input
          id="userid"
          type="text"
          autoComplete="username"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setError(false);
          }}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
        />

        <div className="flex gap-3 flex-wrap mt-4">
          <button className="btn primary flex-1" type="submit">
            Login to portal
          </button>
        </div>

        {error && (
          <div className="login-error">
            Invalid user ID or password.
          </div>
        )}

        <div className="mt-4 text-[#5f6f66] text-xs text-center">
          IGIM - Innovate - Farmers - Crops
        </div>
      </form>
    </div>
  );
}
