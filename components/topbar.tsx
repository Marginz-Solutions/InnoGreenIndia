'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/admin', label: 'Website Customization' },
  { href: '/sheets', label: 'Planning Sheets' },
  { href: '/maps/cluster', label: 'Cluster Map' },
  { href: '/maps/field-visit', label: 'Field Route Map' },
];

export function Topbar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="topbar">
      <div className="row">
        <div className="brand-wrap">
          <Image
            className="brand-logo"
            src="/assets/igim-logo.png"
            alt="IGIM Logo"
            width={56}
            height={56}
          />
          <div className="brand">
            <h1>IGIM Field & Retail Planning Portal</h1>
            <p>Innovate - Farmers - Crops</p>
          </div>
        </div>
        <div className="nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
          <a
            onClick={() => {
              void logout();
            }}
            style={{ cursor: 'pointer' }}
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}
