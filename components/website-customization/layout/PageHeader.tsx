'use client';

import {
  Globe,
  Menu,
} from 'lucide-react';

interface Props {
  onMenuClick: () => void;
}

export const PageHeader = ({
  onMenuClick,
}: Props) => (
  <div className="panel dark mb-5 z-0!">
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <div className="flex items-center gap-3 mb-2">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 text-white"
          >
            <Menu size={18} />
          </button>
          <span className="badge uppercase" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
            Admin Panel
          </span>
        </div>
        <h2 style={{ margin: 0, fontSize: 22 }}>Website Customization</h2>
        <p style={{ marginTop: 6, color: 'rgba(255,255,255,0.72)', fontSize: 14 }}>
          Manage dynamic content, product listings, brands, dealers, and contact details for your website in one place.
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '9px 14px' }}>
          <Globe size={15} /> View Website
        </button>
      </div>
    </div>
  </div>
);