'use client';

import Image from 'next/image';
import { useState } from 'react';
import { LogOut, PanelRight } from 'lucide-react';

import { NAV_ITEMS } from '@/components/website-customization/constants/nav-items';
import { SidebarSection } from '@/components/website-customization/types/common.types';
import LogoutModal from '../LogoutModal';

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
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <aside
        className={`relative h-screen flex flex-col transition-all duration-300 ease-in-out bg-[#07130b] border-r border-white/10 ${
          collapsed ? 'w-[80px]' : 'w-[280px]'
        }`}
      >
        {/* Toggle Button */}
          <button
            onClick={onToggle}
            className={`absolute w-6 h-6 ${collapsed ? '-right-3 top-16 border-[1px] border-slate-700/50' : 'right-3 top-8'} 
              flex items-center justify-center rounded-sm bg-[#07130b89] backdrop-blur-md text-white/80 hover:text-white transition-all duration-300`}
            title='Open Sidebar'
          >
            <PanelRight size={18}/>
          </button>

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
              <h1 className="text-white font-black text-lg leading-tight">IGIM Portal</h1>
              <p className="text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">Field & Retail</p>
            </div>
          )}
        </div>

        {/* Nav Section */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                title={collapsed ? label : undefined}
                className={`w-full group flex items-center gap-3 rounded-xl transition-all duration-300 relative ${collapsed ? 'justify-center p-3' : 'px-4 py-3'
                  } ${isActive
                    ? 'bg-gradient-to-r from-[#1f7a36] to-[#2f9b43] text-white shadow-lg shadow-[#1f7a36]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon size={20} className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {!collapsed && (
                  <span className="text-sm font-bold tracking-tight truncate">
                    {label}
                  </span>
                )}
                {isActive && !collapsed && (
                    <div className="absolute left-1 w-1 h-6 rounded-sm bg-white/70" />
                  )}
              </button>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 mt-auto border-t border-white/5">
          {/* Logout Button */}
          <button
            onClick={() => setOpen(true)}
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
        </div>
      </aside>

      <LogoutModal 
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
