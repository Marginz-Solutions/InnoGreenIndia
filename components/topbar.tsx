"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/sheets", label: "Planning Sheets" },
  { href: "/cluster-map", label: "Cluster Map" },
  { href: "/field-route-map", label: "Field Route Map" },
];

export function Topbar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="topbar">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 flex items-center justify-center rounded-[14px] bg-white/10 p-1 shadow-md">
            <span className="text-2xl font-bold text-white">IGIM</span>
          </div>
          <div>
            <h1 className="m-0 text-2xl font-bold tracking-tight">IGIM Field & Retail Planning Portal</h1>
            <p className="mt-1 text-white/85 text-[13px]">Innovate - Farmers - Crops</p>
          </div>
        </div>
        <nav className="nav flex gap-2.5 flex-wrap items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="nav-link cursor-pointer"
            style={{
              padding: "10px 14px",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              borderRadius: "999px",
              color: "#fff",
              fontSize: "13px",
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(4px)",
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}
