'use client';

import { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const success = await login(email, password);
    setSubmitting(false);
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
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
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
          <button
            className="btn primary"
            type="submit"
            style={{ flex: 1 }}
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Login to portal'}
          </button>
        </div>
        <div className={`error ${error ? 'show' : ''}`}>
          Invalid email or password.
        </div>
        <div className="login-foot">IGIM - Innovate - Farmers - Crops</div>
      </form>
    </div>
  );
}
