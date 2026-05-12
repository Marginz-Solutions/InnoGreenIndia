"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

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
    <div className="bg-gradient-to-r from-[#07130b] via-[#12311b] to-[#2b7a32] text-white px-6 py-4 sticky top-0 z-20 shadow-lg border-b border-white/10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <Image
            src="/igim-logo.png"
            alt="IGIM Logo"
            width={56}
            height={56}
            className="rounded-xl bg-white/10 p-1 shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight m-0">
              IGIM Field & Retail Planning Portal
            </h1>
            <p className="text-white/85 text-sm mt-1">
              Innovate - Farmers - Crops
            </p>
          </div>
        </div>
        <nav className="flex gap-2.5 flex-wrap items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-2.5 border border-white/15 rounded-full text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-white text-[#0b1c0f]"
                  : "bg-white/5 text-white hover:bg-white hover:text-[#0b1c0f]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="px-3.5 py-2.5 border border-white/15 rounded-full text-sm font-medium bg-white/5 text-white hover:bg-white hover:text-[#0b1c0f] transition-colors cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}
