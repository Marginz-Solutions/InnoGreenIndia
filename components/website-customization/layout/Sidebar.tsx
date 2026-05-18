'use client';

import {
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

import { NAV_ITEMS } from '@/components/website-customization/constants/nav-items';

import { SidebarSection } from '@/components/website-customization/types/common.types';

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
}: Props) => (
  <aside
    className={`shrink-0 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[230px]'}`}
  >
    <div
      className={`sticky top-[89px] bg-white border border-[#e2ece3] rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[230px]'}`}
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2ece3] bg-gradient-to-r from-[#f7fcf8] to-white">
        {!collapsed && (
          <span className="text-xs font-black uppercase tracking-widest text-[#61756a]">CMS Menu</span>
        )}
        <button
          onClick={onToggle}
          className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#edf8ee] transition-colors text-[#61756a] ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="p-2 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const is_active = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 rounded-xl transition-all text-left ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
                } ${is_active
                  ? 'bg-gradient-to-r from-[#1f7a36] to-[#2f9b43] text-white shadow-md shadow-[#1f7a36]/20'
                  : 'text-[#102018] hover:bg-[#edf8ee]'
                }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="text-sm font-semibold truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mx-3 mb-3 mt-2 p-3 rounded-xl bg-gradient-to-br from-[#edf8ee] to-[#f0faf1] border border-[#d4ecd7]">
          <p className="text-[10px] font-bold text-[#166534] uppercase tracking-widest mb-1">Live CMS</p>
          <p className="text-[11px] text-[#61756a] leading-snug">Changes reflect on the website instantly after saving.</p>
        </div>
      )}
    </div>
  </aside>
);