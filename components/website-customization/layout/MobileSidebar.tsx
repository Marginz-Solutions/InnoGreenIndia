'use client';

import Image from 'next/image';
import { X, LogOut } from 'lucide-react';

import { NAV_ITEMS } from '../constants/nav-items';
import { SidebarSection } from '../types/common.types';
import { useAuth } from '@/lib/auth-context';

interface Props {
  open: boolean;
  active: SidebarSection;
  onClose: () => void;
  onChange: (s: SidebarSection) => void;
}

export const MobileSidebar = ({
  open,
  active,
  onClose,
  onChange,
}: Props) => {
  const { logout } = useAuth();

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-50 lg:hidden bg-[#07130b] border-r border-white/10 shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } w-72 flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
           <div className="flex items-center gap-3">
            <Image
              src="/assets/igim-logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg bg-white/10 p-0.5"
            />
            <div className="flex flex-col">
              <span className="text-white font-black text-sm tracking-tight">IGIM Portal</span>
              <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest">CMS Menu</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                active === id
                  ? 'bg-gradient-to-r from-[#1f7a36] to-[#2f9b43] text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon
                size={20}
                className="shrink-0"
              />

              <span className="text-sm font-bold tracking-tight">
                {label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button
            onClick={() => {
              void logout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-white/60 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-300"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="text-sm font-bold tracking-tight">
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
