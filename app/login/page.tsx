"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const success = login(userId, password);
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="login-shell">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[460px] bg-white/95 backdrop-blur-sm border border-white/45 rounded-3xl p-7 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-5">
          <Image
            src="/igim-logo.png"
            alt="IGIM Logo"
            width={76}
            height={76}
            className="object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-[#10361c] m-0">IGIM Login</h1>
            <p className="text-[#577266] mt-1.5">
              Secure access for field staff, retail planning, and management.
            </p>
          </div>
        </div>

        <label
          htmlFor="userid"
          className="block text-sm font-bold mt-3.5 mb-2 text-[#21432a]"
        >
          User ID
        </label>
        <input
          id="userid"
          type="text"
          autoComplete="username"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full py-3 px-3.5 border border-[#cfe0d2] rounded-xl bg-white text-base"
        />

        <label
          htmlFor="password"
          className="block text-sm font-bold mt-3.5 mb-2 text-[#21432a]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-3 px-3.5 border border-[#cfe0d2] rounded-xl bg-white text-base"
        />

        <div className="flex gap-3 flex-wrap mt-5">
          <button
            type="submit"
            className="flex-1 py-3 px-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#1f7a36] to-[#2f9b43] border border-[#1f7a36] cursor-pointer"
          >
            Login to portal
          </button>
        </div>

        {error && (
          <div className="mt-3.5 py-3 px-3.5 rounded-xl bg-[#fff1f2] text-[#9f1239] border border-[#fecdd3]">
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
