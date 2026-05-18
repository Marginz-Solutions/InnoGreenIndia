'use client';

import Image from 'next/image';
import { useState } from 'react';
import { LogOut, PanelRight, X } from 'lucide-react';

import { NAV_ITEMS } from '@/components/website-customization/constants/nav-items';
import { SidebarSection } from '@/components/website-customization/types/common.types';
import LogoutModal from '../LogoutModal';

interface Props {
  active: SidebarSection;
  onChange: (s: SidebarSection) => void;
  // Desktop
  collapsed: boolean;
  onToggle: () => void;
  // Mobile
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({
  active,
  onChange,
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const NavContent = ({ isMobile = false }) => (
    <>
      {/* Brand Section */}
      <div className={isMobile 
        ? "flex items-center justify-between px-6 py-6 border-b border-white/5"
        : `p-3 mb-4 flex items-center gap-4 ${collapsed ? 'justify-center' : ''}`
      }>
        <div className="flex items-center gap-3">
          <Image
            src="/assets/igim-logo.png"
            alt="Logo"
            width={isMobile ? 37 : (collapsed ? 42 : 42)}
            height={isMobile ? 37 : (collapsed ? 42 : 42)}
            className={`rounded-xl bg-white/10 p-1 shadow-lg ${isMobile ? 'w-8 h-8' : ''}`}
          />
          {(!collapsed || isMobile) && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <span className="text-white font-black text-lg leading-tight">IGIM Portal</span>
              <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest">
                {isMobile ? 'CMS Menu' : 'Field & Retail'}
              </span>
            </div>
          )}
        </div>

        {isMobile && (
          <button
            onClick={onMobileClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => {
                onChange(id);
                if (isMobile) onMobileClose();
              }}
              title={collapsed && !isMobile ? label : undefined}
              className={`w-full group flex items-center gap-3 rounded-xl transition-all duration-300 relative ${
                collapsed && !isMobile ? 'justify-center p-3' : 'px-4 py-3.5'
              } ${isActive
                ? 'bg-gradient-to-r from-[#1f7a36] to-[#2f9b43] text-white shadow-lg shadow-[#1f7a36]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              {(!collapsed || isMobile) && (
                <span className="text-sm font-bold tracking-tight truncate">
                  {label}
                </span>
              )}
              {isActive && !collapsed && !isMobile && (
                <div className="absolute left-1 w-1 h-6 rounded-sm bg-white/70" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 mt-auto border-t border-white/5">
        <button
            onClick={() => setOpen(true)}
          className={`w-full flex items-center gap-3 text-white/60 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-300 ${
            collapsed && !isMobile ? 'justify-center p-3' : 'px-4 py-3.5'
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="text-sm font-bold tracking-tight">
              Logout
            </span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex h-screen sticky top-0 flex-col transition-all duration-300 ease-in-out bg-[#07130b] border-r border-white/10 ${
          collapsed ? 'w-[80px]' : 'w-[280px]'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className={`absolute w-6 h-6 ${collapsed ? '-right-3 top-13 border-[1px] border-slate-700/50' : 'right-3 top-5'} 
            flex items-center justify-center rounded-sm bg-[#07130b89] backdrop-blur-md text-white/80 hover:text-white transition-all duration-300 z-10`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <PanelRight size={18} className={collapsed ? '' : 'rotate-180'} />
        </button>

        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
      />

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-50 lg:hidden bg-[#07130b] border-r border-white/10 shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } w-72 flex flex-col`}
      >
        <NavContent isMobile />
      </div>

      <LogoutModal 
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
