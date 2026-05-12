'use client';

import { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const success = login(userId, password);
    if (!success) {
      setError(true);
    }
  };

  if (isLoading) {
    return (
      <div className="login-shell">
        <div style={{ color: 'white' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-head">
          <Image
            src="/assets/igim-logo.png"
            alt="IGIM Logo"
            width={76}
            height={76}
          />
          <div>
            <h1>IGIM Login</h1>
            <p>Secure access for field staff, retail planning, and management.</p>
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
        <div className="quick-actions">
          <button className="btn primary" type="submit" style={{ flex: 1 }}>
            Login to portal
          </button>
        </div>
        <div className={`error ${error ? 'show' : ''}`}>
          Invalid user ID or password.
        </div>
        <div className="login-foot">IGIM - Innovate - Farmers - Crops</div>
      </form>
    </div>
  );
}
