'use client';

import Image from 'next/image';
import {
  ChevronRight,
  ChevronLeft,
  LogOut,
} from 'lucide-react';

import { NAV_ITEMS } from '@/components/website-customization/constants/nav-items';
import { SidebarSection } from '@/components/website-customization/types/common.types';
import { useAuth } from '@/lib/auth-context';

interface Props {
  active: SidebarSection;
  onChange: (s: SidebarSection) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({
  active,
  onChange,
  collapsed,
  onToggle,
}: Props) => {
  const { logout } = useAuth();

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 ease-in-out bg-[#07130b] border-r border-white/10 ${
        collapsed ? 'w-[80px]' : 'w-[280px]'
      }`}
    >
      {/* Brand Section */}
      <div className={`p-6 mb-4 flex items-center gap-4 ${collapsed ? 'justify-center' : ''}`}>
        <div className="shrink-0 relative">
          <Image
            src="/assets/igim-logo.png"
            alt="Logo"
            width={42}
            height={42}
            className="rounded-xl bg-white/10 p-1 shadow-lg"
          />
        </div>
        {!collapsed && (
          <div className="overflow-hidden whitespace-nowrap transition-all duration-500">
            <h1 className="text-white font-black text-lg leading-tight tracking-tight">IGIM Portal</h1>
            <p className="text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">Field & Retail</p>
          </div>
        )}
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const is_active = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              title={collapsed ? label : undefined}
              className={`w-full group flex items-center gap-3 rounded-xl transition-all duration-300 relative ${
                collapsed ? 'justify-center p-3' : 'px-4 py-3'
              } ${
                is_active
                  ? 'bg-gradient-to-r from-[#1f7a36] to-[#2f9b43] text-white shadow-lg shadow-[#1f7a36]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} className={`shrink-0 transition-transform duration-300 ${is_active ? 'scale-110' : 'group-hover:scale-110'}`} />
              {!collapsed && (
                <span className="text-sm font-bold tracking-tight truncate">
                  {label}
                </span>
              )}
              {is_active && !collapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 mt-auto border-t border-white/5">
        {/* Logout Button */}
        <button
          onClick={() => {
            void logout();
          }}
          className={`w-full flex items-center gap-3 text-white/60 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-300 ${
            collapsed ? 'justify-center p-3' : 'px-4 py-3'
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight">
              Logout
            </span>
          )}
        </button>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="mt-4 w-full h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};
