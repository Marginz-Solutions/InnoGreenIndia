'use client';

import { X } from 'lucide-react';

import { NAV_ITEMS } from '../constants/nav-items';

import { SidebarSection } from '../types/common.types';

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
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-50 lg:hidden bg-white border-r border-[#e2ece3] shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } w-64`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-[#e2ece3]">
          <span className="text-sm font-black uppercase tracking-widest text-[#61756a]">
            CMS Menu
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#edf8ee]"
          >
            <X
              size={18}
              className="text-[#61756a]"
            />
          </button>
        </div>

        <nav className="p-2 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                active === id
                  ? 'bg-gradient-to-r from-[#1f7a36] to-[#2f9b43] text-white shadow-md'
                  : 'text-[#102018] hover:bg-[#edf8ee]'
              }`}
            >
              <Icon
                size={18}
                className="shrink-0"
              />

              <span className="text-sm font-semibold">
                {label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};