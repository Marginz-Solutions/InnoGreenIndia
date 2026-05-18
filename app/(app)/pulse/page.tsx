'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Zap, Plus, Search, X, SlidersHorizontal, Star, Pin, Eye, EyeOff,
  Trash2, Clock, Calendar, TrendingUp, Globe, Tag, Package,
  LayoutGrid, LayoutList, RefreshCw, Megaphone, Leaf, ShoppingBag,
  MessageSquare, Monitor, Smartphone, ArrowRight, Archive, Flame,
  Link2, AlertCircle,
} from 'lucide-react';

// ── Pulse Type Config ──────────────────────────────────────────────────────────
//  Color palette: green brand family + neutral gray. No rainbow.

const PULSE_TYPE_LIST = [
  { value: 'trending_product',   label: 'Trending Product',    icon: TrendingUp,    color: 'text-[#1f7a36] bg-[#edf8ee] border-[#b6debb]'    },
  { value: 'dealer_activity',    label: 'Dealer Activity',     icon: ShoppingBag,   color: 'text-[#374151] bg-gray-50 border-gray-200'         },
  { value: 'enquiry_insight',    label: 'Enquiry Insight',     icon: MessageSquare, color: 'text-[#374151] bg-gray-50 border-gray-200'         },
  { value: 'product_update',     label: 'Product Update',      icon: Package,       color: 'text-[#1f7a36] bg-[#edf8ee] border-[#b6debb]'    },
  { value: 'category_highlight', label: 'Category Highlight',  icon: Tag,           color: 'text-[#2d5a27] bg-[#f0f7f1] border-[#cfe0d2]'    },
  { value: 'seasonal_insight',   label: 'Seasonal Insight',    icon: Leaf,          color: 'text-[#61756a] bg-[#f4faf5] border-[#d1dfd5]'     },
  { value: 'announcement',       label: 'Announcement',        icon: Megaphone,     color: 'text-[#374151] bg-gray-50 border-gray-200'         },
  { value: 'website_highlight',  label: 'Website Highlight',   icon: Globe,         color: 'text-[#4b5563] bg-gray-50 border-gray-200'         },
];

const TYPE_MAP = Object.fromEntries(PULSE_TYPE_LIST.map(t => [t.value, t]));

// Accent bar & icon tints — green family for product/category, neutral for operational types
const TYPE_ACCENTS = {
  trending_product:   '#1f7a36',
  dealer_activity:    '#4b5563',
  enquiry_insight:    '#6b7280',
  product_update:     '#2d5a27',
  category_highlight: '#3d7a47',
  seasonal_insight:   '#61756a',
  announcement:       '#374151',
  website_highlight:  '#4b5563',
};

// Status — green for live, slate for scheduled, muted gray for inactive, amber for expired
const STATUS_CONFIG = {
  draft:     { label: 'Draft',     dot: 'bg-gray-400',    pill: 'text-gray-500 bg-gray-50 border-gray-200'          },
  published: { label: 'Published', dot: 'bg-[#1f7a36]',   pill: 'text-[#1f7a36] bg-[#edf8ee] border-[#b6debb]'     },
  scheduled: { label: 'Scheduled', dot: 'bg-slate-500',   pill: 'text-slate-600 bg-slate-50 border-slate-200'       },
  archived:  { label: 'Archived',  dot: 'bg-gray-400',    pill: 'text-gray-500 bg-gray-50 border-gray-200'          },
  expired:   { label: 'Expired',   dot: 'bg-amber-500',   pill: 'text-amber-700 bg-amber-50 border-amber-200'       },
};

// ── Mock / Seed Data ───────────────────────────────────────────────────────────

const MOCK_PULSES = [
  {
    id: '1', title: "Paddy Crop Season — Top Products Now Available",
    description: "Discover our curated selection of high-yield paddy seeds and fertilisers for the upcoming season.",
    type: 'trending_product', relatedProduct: 'Paddy Pro Seeds', relatedCategory: 'Seeds', relatedBrand: 'AgroMax',
    dealerTag: '', enquiryHighlight: '', ctaLabel: 'Shop Now', ctaLink: '/products/paddy', priority: 1,
    tags: ['paddy', 'season-sale', 'seeds'], status: 'published',
    visibility: true, trending: true, featured: true, pinned: true,
    scheduledDate: '', expiryDate: '2024-12-31', createdAt: '2024-11-01T10:00:00Z',
  },
  {
    id: '2', title: "New Dealer Network Expansion in Tamil Nadu",
    description: "We've onboarded 12 new authorised dealers across 5 districts in Tamil Nadu.",
    type: 'dealer_activity', relatedProduct: '', relatedCategory: '', relatedBrand: '',
    dealerTag: 'Tamil Nadu Expansion', enquiryHighlight: '', ctaLabel: 'Find Dealer', ctaLink: '/dealers', priority: 2,
    tags: ['dealers', 'tamil-nadu', 'expansion'], status: 'published',
    visibility: true, trending: false, featured: false, pinned: false,
    scheduledDate: '', expiryDate: '', createdAt: '2024-11-02T08:00:00Z',
  },
  {
    id: '3', title: "Rising Demand for Bio-Pesticides This Month",
    description: "Enquiry data shows a 40% spike in bio-pesticide product searches over the past 30 days.",
    type: 'enquiry_insight', relatedProduct: '', relatedCategory: 'Bio-Pesticides', relatedBrand: '',
    dealerTag: '', enquiryHighlight: '40% enquiry spike', ctaLabel: 'View Products', ctaLink: '/products/bio-pesticides', priority: 3,
    tags: ['bio-pesticide', 'demand', 'insight'], status: 'scheduled',
    visibility: false, trending: true, featured: false, pinned: false,
    scheduledDate: '2024-11-10T06:00:00Z', expiryDate: '2024-11-30', createdAt: '2024-11-03T14:00:00Z',
  },
  {
    id: '4', title: "Winter Crop Preparation Guide 2024",
    description: "Essential tips and product recommendations to prepare your fields for the winter crop season.",
    type: 'seasonal_insight', relatedProduct: '', relatedCategory: 'Fertilisers', relatedBrand: '',
    dealerTag: '', enquiryHighlight: '', ctaLabel: 'Read Guide', ctaLink: '/blog/winter-prep', priority: 4,
    tags: ['winter', 'seasonal', 'guide'], status: 'draft',
    visibility: false, trending: false, featured: false, pinned: false,
    scheduledDate: '', expiryDate: '', createdAt: '2024-11-04T09:00:00Z',
  },
  {
    id: '5', title: "AgroMax Premium Fertiliser — Now In Stock",
    description: "The highly requested AgroMax NPK Premium blend is back in stock across all dealer points.",
    type: 'product_update', relatedProduct: 'AgroMax NPK Premium', relatedCategory: 'Fertilisers', relatedBrand: 'AgroMax',
    dealerTag: '', enquiryHighlight: '', ctaLabel: 'Buy Now', ctaLink: '/products/agromax-npk', priority: 5,
    tags: ['agromax', 'fertiliser', 'in-stock'], status: 'archived',
    visibility: false, trending: false, featured: false, pinned: false,
    scheduledDate: '', expiryDate: '2024-10-31', createdAt: '2024-10-15T11:00:00Z',
  },
  {
    id: '6', title: "Special Announcement: Website Relaunch",
    description: "We've upgraded our website with new features including advanced product filtering and dealer locator.",
    type: 'announcement', relatedProduct: '', relatedCategory: '', relatedBrand: '',
    dealerTag: '', enquiryHighlight: '', ctaLabel: 'Explore', ctaLink: '/', priority: 6,
    tags: ['announcement', 'website', 'relaunch'], status: 'published',
    visibility: true, trending: false, featured: true, pinned: false,
    scheduledDate: '', expiryDate: '', createdAt: '2024-11-05T07:00:00Z',
  },
];

const EMPTY_PULSE = {
  id: '', title: '', description: '', type: 'trending_product',
  relatedProduct: '', relatedCategory: '', relatedBrand: '',
  dealerTag: '', enquiryHighlight: '', ctaLabel: '', ctaLink: '',
  priority: 1, tags: [], status: 'draft',
  visibility: true, trending: false, featured: false, pinned: false,
  scheduledDate: '', expiryDate: '', createdAt: '',
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d ago` : `${Math.floor(d / 30)}mo ago`;
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Shared UI Atoms ────────────────────────────────────────────────────────────

function PulseStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function PulseTypeBadge({ type }) {
  const cfg = TYPE_MAP[type] ?? PULSE_TYPE_LIST[0];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${cfg.color}`}>
      <Icon size={9} />
      {cfg.label}
    </span>
  );
}

function FilterPill({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
        active
          ? 'bg-[#1f7a36] text-white border-[#1f7a36] shadow-sm'
          : 'bg-white text-[#61756a] border-[#d1dfd5] hover:border-[#1f7a36] hover:text-[#1f7a36]'
      }`}
    >
      {Icon && <Icon size={11} />}
      {label}
    </button>
  );
}

function OverviewCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#61756a] uppercase tracking-wide">{label}</span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-[#f0f8f1] flex items-center justify-center">
            <Icon size={13} className="text-[#61756a]" />
          </div>
        )}
      </div>
      <span className={`text-3xl font-extrabold ${color ?? 'text-[#102018]'}`}>{value}</span>
      {sub && <span className="text-xs text-[#9bb4a1]">{sub}</span>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 animate-pulse">
      <div className="h-1 w-full bg-[#e2ece3] rounded-full mb-4" />
      <div className="flex items-start gap-2 mb-3">
        <div className="w-9 h-9 bg-[#e2ece3] rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-3/4 bg-[#e2ece3] rounded" />
          <div className="h-3 w-1/2 bg-[#e2ece3] rounded" />
        </div>
      </div>
      <div className="h-3 w-full bg-[#e2ece3] rounded mb-1.5" />
      <div className="h-3 w-2/3 bg-[#e2ece3] rounded mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-24 bg-[#e2ece3] rounded-full" />
        <div className="h-5 w-16 bg-[#e2ece3] rounded-full" />
      </div>
      <div className="border-t border-[#e2ece3] pt-3 flex justify-between items-center">
        <div className="h-3 w-14 bg-[#e2ece3] rounded" />
        <div className="flex gap-1.5">
          <div className="h-7 w-7 bg-[#e2ece3] rounded-xl" />
          <div className="h-7 w-7 bg-[#e2ece3] rounded-xl" />
          <div className="h-7 w-14 bg-[#e2ece3] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────────

function Toggle({ value, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="inline-flex items-center gap-2.5 cursor-pointer"
    >
      <div className={`relative w-9 h-5 rounded-full transition-colors ${value ? 'bg-[#1f7a36]' : 'bg-gray-200'}`}>
        <div
          className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </div>
      {label && <span className="text-xs text-[#61756a] font-medium">{label}</span>}
    </button>
  );
}

// ── Tags Input ─────────────────────────────────────────────────────────────────

function TagsInput({ tags, onChange }) {
  const [input, setInput] = useState('');

  const handleKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const tag = input.trim().replace(/,/g, '');
      if (!tags.includes(tag)) onChange([...tags, tag]);
      setInput('');
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 p-2.5 border border-[#cfe0d2] rounded-xl bg-[#fafdfb] min-h-[42px] cursor-text focus-within:border-[#1f7a36] focus-within:ring-2 focus-within:ring-[#1f7a36]/20 transition-all"
      onClick={() => document.getElementById('pulse-tag-input')?.focus()}
    >
      {tags.map(t => (
        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#edf8ee] text-[#1f7a36] text-xs font-semibold rounded border border-[#b6debb]">
          {t}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(tags.filter(x => x !== t)); }}
            className="hover:text-red-500 transition-colors"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        id="pulse-tag-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length === 0 ? 'Add tags (press Enter or comma)…' : ''}
        className="outline-none bg-transparent text-xs flex-1 min-w-[120px] placeholder:text-[#b0bcb5]"
      />
    </div>
  );
}

// ── Pulse Card (Grid View) ─────────────────────────────────────────────────────

function PulseCard({ pulse, onEdit, onDelete, onToggle }) {
  const typeCfg = TYPE_MAP[pulse.type] ?? PULSE_TYPE_LIST[0];
  const TypeIcon = typeCfg.icon;
  const accent = TYPE_ACCENTS[pulse.type] ?? '#1f7a36';

  return (
    <div className="relative bg-white border border-[#e2ece3] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Coloured accent bar — brand green or neutral gray, not rainbow */}
      <div className="h-1 shrink-0" style={{ background: accent }} />

      {/* Featured ribbon — amber gold is a conventional "featured" signal, kept intentionally */}
      {pulse.featured && (
        <div
          className="absolute flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-l-full bg-amber-400 text-white shadow-sm"
          style={{ top: '12px', right: 0 }}
        >
          <Star size={8} fill="white" /> FEATURED
        </div>
      )}

      {/* Trending badge — red is a conventional "hot/trending" signal, kept intentionally */}
      {pulse.trending && (
        <div
          className="absolute flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white"
          style={{ top: '6px', left: '12px' }}
        >
          <Flame size={8} /> TRENDING
        </div>
      )}

      <div className="p-4 flex flex-col flex-1 gap-0">
        {/* Header */}
        <div className="flex items-start gap-2 mb-3 mt-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${accent}15` }}
          >
            <TypeIcon size={16} style={{ color: accent }} />
          </div>
          <div className="flex-1 min-w-0">
            {pulse.pinned && (
              <div className="flex items-center gap-1 text-[10px] text-[#9bb4a1] font-semibold mb-0.5">
                <Pin size={9} fill="currentColor" /> Pinned
              </div>
            )}
            <h3 className="text-sm font-bold text-[#102018] leading-snug line-clamp-2">{pulse.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#61756a] line-clamp-2 leading-relaxed mb-3">
          {pulse.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <PulseTypeBadge type={pulse.type} />
          <PulseStatusBadge status={pulse.status} />
          {!pulse.visibility && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border text-gray-400 bg-gray-50 border-gray-200">
              <EyeOff size={9} /> Hidden
            </span>
          )}
        </div>

        {/* Tags */}
        {(pulse.tags?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {pulse.tags.slice(0, 3).map(t => (
              <span key={t} className="px-1.5 py-0.5 bg-[#edf8ee] text-[#1f7a36] text-[10px] font-semibold rounded">
                {t}
              </span>
            ))}
            {pulse.tags.length > 3 && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[10px] rounded">
                +{pulse.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Related meta */}
        {(pulse.relatedProduct || pulse.relatedCategory || pulse.relatedBrand) && (
          <div className="flex flex-wrap gap-2 mb-3 text-[10px] text-[#9bb4a1]">
            {pulse.relatedProduct  && <span className="flex items-center gap-0.5"><Package size={9} /> {pulse.relatedProduct}</span>}
            {pulse.relatedCategory && <span className="flex items-center gap-0.5"><Tag size={9} /> {pulse.relatedCategory}</span>}
            {pulse.relatedBrand    && <span className="flex items-center gap-0.5"><Globe size={9} /> {pulse.relatedBrand}</span>}
          </div>
        )}

        {/* CTA chip */}
        {pulse.ctaLabel && (
          <div
            className="self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold mb-3"
            style={{ background: `${accent}12`, color: accent }}
          >
            {pulse.ctaLabel} <ArrowRight size={10} />
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#e2ece3] mt-1">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] text-[#9bb4a1]">
              <Clock size={9} /> {timeAgo(pulse.createdAt)}
            </div>
            {pulse.scheduledDate && (
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Calendar size={9} /> {fmtDate(pulse.scheduledDate)}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggle(pulse.id, 'visibility')}
              title={pulse.visibility ? 'Visible on website' : 'Hidden from website'}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                pulse.visibility
                  ? 'border-[#b6debb] bg-[#edf8ee] text-[#1f7a36]'
                  : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300'
              }`}
            >
              {pulse.visibility ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            <button
              onClick={() => onToggle(pulse.id, 'trending')}
              title="Toggle trending"
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                pulse.trending
                  ? 'border-red-200 bg-red-50 text-red-400'
                  : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300'
              }`}
            >
              <Flame size={12} />
            </button>
            <button
              onClick={() => onEdit(pulse)}
              className="px-2.5 py-1.5 rounded-xl border border-[#cfe0d2] bg-[#f4faf5] text-[#1f7a36] text-xs font-semibold hover:bg-[#edf8ee] transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => { if (window.confirm(`Delete "${pulse.title}"?`)) onDelete(pulse.id); }}
              className="w-7 h-7 flex items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pulse List Row ─────────────────────────────────────────────────────────────

function PulseListRow({ pulse, onEdit, onDelete, onToggle }) {
  const typeCfg = TYPE_MAP[pulse.type] ?? PULSE_TYPE_LIST[0];
  const TypeIcon = typeCfg.icon;
  const accent = TYPE_ACCENTS[pulse.type] ?? '#1f7a36';

  return (
    <div className="bg-white border border-[#e2ece3] rounded-2xl px-4 py-3.5 flex items-center gap-4 hover:shadow-md transition-all duration-150">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}15` }}
      >
        <TypeIcon size={18} style={{ color: accent }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm text-[#102018] truncate">{pulse.title}</span>
          {pulse.trending && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
              <Flame size={7} /> TRENDING
            </span>
          )}
          {pulse.featured && <Star size={11} className="text-amber-400 shrink-0" fill="currentColor" />}
          {pulse.pinned && <Pin size={10} className="text-[#9bb4a1] shrink-0" fill="currentColor" />}
        </div>
        <p className="text-xs text-[#61756a] truncate mt-0.5">{pulse.description}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {(pulse.tags ?? []).slice(0, 3).map(t => (
            <span key={t} className="px-1.5 py-0.5 bg-[#edf8ee] text-[#1f7a36] text-[10px] font-semibold rounded">{t}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex flex-col items-end gap-1">
          <PulseStatusBadge status={pulse.status} />
          <PulseTypeBadge type={pulse.type} />
        </div>
        <button
          onClick={() => onToggle(pulse.id, 'visibility')}
          className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-colors ${
            pulse.visibility
              ? 'border-[#b6debb] bg-[#edf8ee] text-[#1f7a36]'
              : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300'
          }`}
        >
          {pulse.visibility ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
        <button
          onClick={() => onEdit(pulse)}
          className="px-3 py-1.5 rounded-xl border border-[#cfe0d2] bg-[#f4faf5] text-[#1f7a36] text-xs font-semibold hover:bg-[#edf8ee] transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => { if (window.confirm(`Delete "${pulse.title}"?`)) onDelete(pulse.id); }}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Website Preview (inside modal) ─────────────────────────────────────────────

function WebsitePreviewPanel({ form }) {
  const [previewMode, setPreviewMode] = useState('desktop');
  const accent = TYPE_ACCENTS[form.type] ?? '#1f7a36';
  const TypeIcon = (TYPE_MAP[form.type] ?? PULSE_TYPE_LIST[0]).icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex border border-[#cfe0d2] rounded-xl overflow-hidden">
          {[
            { id: 'desktop', label: 'Desktop', icon: Monitor },
            { id: 'mobile',  label: 'Mobile',  icon: Smartphone },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPreviewMode(id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${id === 'mobile' ? 'border-l border-[#cfe0d2]' : ''} ${
                previewMode === id ? 'bg-[#edf8ee] text-[#1f7a36]' : 'text-[#9bb4a1] hover:text-[#61756a]'
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#fafdfb] border border-[#e2ece3] rounded-2xl p-8 flex justify-center">
        <div className={previewMode === 'mobile' ? 'w-[240px]' : 'w-full max-w-sm'}>
          <p className="text-[10px] text-[#9bb4a1] font-semibold uppercase tracking-wider mb-3 text-center">
            Public Website Preview
          </p>
          <div className="bg-white rounded-2xl border border-[#e2ece3] shadow-md overflow-hidden">
            <div className="h-1" style={{ background: accent }} />
            <div className="p-4">
              {form.trending && (
                <div className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white mb-2">
                  <Flame size={7} /> TRENDING NOW
                </div>
              )}
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}15` }}>
                  <TypeIcon size={14} style={{ color: accent }} />
                </div>
                <p className="text-sm font-bold text-gray-900 leading-snug">
                  {form.title || 'Pulse title will appear here'}
                </p>
              </div>
              {form.description && (
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                  {form.description}
                </p>
              )}
              {(form.tags?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {form.tags.slice(0, 3).map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-[#edf8ee] text-[#1f7a36] text-[10px] font-semibold rounded">{t}</span>
                  ))}
                </div>
              )}
              {form.ctaLabel && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: accent }}
                >
                  {form.ctaLabel} <ArrowRight size={10} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Informational notice — neutral, not alarming */}
      <div className="bg-[#fafdfb] border border-[#e2ece3] rounded-xl p-3 flex items-start gap-2">
        <AlertCircle size={13} className="text-[#9bb4a1] shrink-0 mt-0.5" />
        <p className="text-xs text-[#61756a] leading-relaxed">
          This is an approximate preview. The public website may render this card differently depending on the component and layout in use.
        </p>
      </div>
    </div>
  );
}

// ── Pulse Modal ────────────────────────────────────────────────────────────────

function PulseModal({ open, onClose, onSave, editPulse }) {
  const [form, setForm] = useState(EMPTY_PULSE);
  const [tab, setTab]   = useState('content');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(editPulse ? { ...editPulse, tags: editPulse.tags ?? [] } : { ...EMPTY_PULSE });
      setTab('content');
    }
  }, [open, editPulse]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  if (!open) return null;

  const inputCls =
    'w-full px-3.5 py-2.5 border border-[#cfe0d2] rounded-xl text-sm bg-[#fafdfb] focus:outline-none focus:border-[#1f7a36] focus:ring-2 focus:ring-[#1f7a36]/20 transition-all placeholder:text-[#b0bcb5] text-[#102018]';
  const smInputCls =
    'w-full px-3 py-2 border border-[#cfe0d2] rounded-xl text-xs bg-[#fafdfb] focus:outline-none focus:border-[#1f7a36] transition-all placeholder:text-[#b0bcb5] text-[#102018]';
  const labelCls = 'block text-xs font-semibold text-[#61756a] mb-1.5';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        minHeight: '100%',
        background: 'rgba(16, 32, 24, 0.55)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 16px 80px',
      }}
    >
      <div
        className="bg-white rounded-2xl border border-[#e2ece3] w-full shadow-2xl"
        style={{ maxWidth: '720px' }}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ece3]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#edf8ee] flex items-center justify-center">
              <Zap size={15} className="text-[#1f7a36]" />
            </div>
            <div>
              <h2 className="font-extrabold text-[#102018] text-base leading-tight">
                {editPulse ? 'Edit Pulse Item' : 'Create New Pulse'}
              </h2>
              <p className="text-xs text-[#9bb4a1]">
                {editPulse ? 'Update this pulse item' : 'Add a new pulse to the website feed'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#e2ece3] bg-gray-50 text-[#61756a] hover:bg-gray-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-[#e2ece3] px-6">
          {[
            { id: 'content',    label: 'Content'    },
            { id: 'publishing', label: 'Publishing' },
            { id: 'preview',    label: 'Preview'    },
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors -mb-px ${
                tab === t.id
                  ? 'border-[#1f7a36] text-[#1f7a36]'
                  : 'border-transparent text-[#61756a] hover:text-[#102018]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Modal Body ── */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '58vh' }}>

          {/* ── CONTENT TAB ── */}
          {tab === 'content' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Pulse Title *</label>
                <input
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Enter a compelling pulse title…"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Brief description shown on the website card…"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div>
                <label className={labelCls}>Pulse Type</label>
                <select
                  value={form.type}
                  onChange={e => set('type', e.target.value)}
                  className={inputCls}
                >
                  {PULSE_TYPE_LIST.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Related Product</label>
                  <input value={form.relatedProduct} onChange={e => set('relatedProduct', e.target.value)} placeholder="Product name…" className={smInputCls} />
                </div>
                <div>
                  <label className={labelCls}>Related Category</label>
                  <input value={form.relatedCategory} onChange={e => set('relatedCategory', e.target.value)} placeholder="Category name…" className={smInputCls} />
                </div>
                <div>
                  <label className={labelCls}>Related Brand</label>
                  <input value={form.relatedBrand} onChange={e => set('relatedBrand', e.target.value)} placeholder="Brand name…" className={smInputCls} />
                </div>
              </div>

              {form.type === 'dealer_activity' && (
                <div>
                  <label className={labelCls}>Dealer Activity Tag</label>
                  <input
                    value={form.dealerTag}
                    onChange={e => set('dealerTag', e.target.value)}
                    placeholder="e.g. Tamil Nadu Expansion…"
                    className={inputCls}
                  />
                </div>
              )}

              {form.type === 'enquiry_insight' && (
                <div>
                  <label className={labelCls}>Enquiry Highlight</label>
                  <input
                    value={form.enquiryHighlight}
                    onChange={e => set('enquiryHighlight', e.target.value)}
                    placeholder="e.g. 40% enquiry spike this month…"
                    className={inputCls}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>CTA Label</label>
                  <input
                    value={form.ctaLabel}
                    onChange={e => set('ctaLabel', e.target.value)}
                    placeholder="e.g. Shop Now…"
                    className={smInputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>CTA Link</label>
                  <div className="relative">
                    <Link2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9bb4a1] pointer-events-none" />
                    <input
                      value={form.ctaLink}
                      onChange={e => set('ctaLink', e.target.value)}
                      placeholder="/products…"
                      className="w-full pl-8 pr-3 py-2 border border-[#cfe0d2] rounded-xl text-xs bg-[#fafdfb] focus:outline-none focus:border-[#1f7a36] transition-all placeholder:text-[#b0bcb5] text-[#102018]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelCls}>Display Priority</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.priority}
                  onChange={e => set('priority', parseInt(e.target.value) || 1)}
                  className="w-24 px-3 py-2 border border-[#cfe0d2] rounded-xl text-xs bg-[#fafdfb] focus:outline-none focus:border-[#1f7a36] transition-all text-[#102018]"
                />
                <p className="text-[11px] text-[#9bb4a1] mt-1">Lower number = higher priority on website feed</p>
              </div>

              <div>
                <label className={labelCls}>Tags</label>
                <TagsInput tags={form.tags ?? []} onChange={tags => set('tags', tags)} />
              </div>
            </div>
          )}

          {/* ── PUBLISHING TAB ── */}
          {tab === 'publishing' && (
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Publish Status</label>
                <select
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                  className={inputCls}
                >
                  <option value="draft">Draft — not visible to anyone yet</option>
                  <option value="published">Published — live on website now</option>
                  <option value="scheduled">Scheduled — publish at a set date</option>
                  <option value="archived">Archived — removed from website</option>
                </select>
              </div>

              {form.status === 'scheduled' && (
                <div>
                  <label className={labelCls}><Calendar size={11} className="inline mr-1" />Schedule Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={form.scheduledDate}
                    onChange={e => set('scheduledDate', e.target.value)}
                    className={inputCls}
                  />
                </div>
              )}

              <div>
                <label className={labelCls}><AlertCircle size={11} className="inline mr-1" />Expiry Date (optional)</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={e => set('expiryDate', e.target.value)}
                  className={inputCls}
                />
                <p className="text-[11px] text-[#9bb4a1] mt-1">Pulse auto-expires and hides from website after this date</p>
              </div>

              <div className="bg-[#fafdfb] rounded-2xl border border-[#e2ece3] p-4 space-y-3">
                <h4 className="text-xs font-extrabold text-[#102018] uppercase tracking-wide">Visibility &amp; Behaviour</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'visibility', label: 'Website Visible',  sub: 'Show on public website'          },
                    { key: 'trending',   label: 'Trending',          sub: 'Mark as trending item'           },
                    { key: 'featured',   label: 'Featured',          sub: 'Highlight in featured section'   },
                    { key: 'pinned',     label: 'Pin to Top',        sub: 'Always show at top of feed'      },
                  ].map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#e2ece3]">
                      <div>
                        <p className="text-xs font-semibold text-[#102018]">{label}</p>
                        <p className="text-[11px] text-[#9bb4a1]">{sub}</p>
                      </div>
                      <Toggle value={form[key]} onChange={v => set(key, v)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PREVIEW TAB ── */}
          {tab === 'preview' && <WebsitePreviewPanel form={form} />}
        </div>

        {/* ── Modal Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e2ece3] bg-[#fafdfb] rounded-b-2xl">
          <div className="text-xs text-[#9bb4a1]">
            {form.status === 'scheduled' && form.scheduledDate ? (
              <span className="flex items-center gap-1">
                <Calendar size={11} /> Scheduled: {fmtDate(form.scheduledDate)}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#cfe0d2] bg-white text-xs font-semibold text-[#61756a] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.title.trim() || saving}
              className="px-5 py-2 bg-[#1f7a36] hover:bg-[#2d5a27] disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm shadow-[#1f7a36]/20"
            >
              {saving ? 'Saving…' : (editPulse ? 'Update Pulse' : 'Create Pulse')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────

export default function TodaysPulseClient() {
  const [pulses,    setPulses]    = useState(MOCK_PULSES);
  const [loading,   setLoading]   = useState(false);
  const [viewMode,  setViewMode]  = useState('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editPulse, setEditPulse] = useState(null);

  const [filters, setFilters] = useState({
    query: '', type: 'all', status: 'all', visibility: 'all', sort: 'latest',
  });

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const activeFiltersCount = [
    filters.type !== 'all',
    filters.status !== 'all',
    filters.visibility !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () =>
    setFilters({ query: '', type: 'all', status: 'all', visibility: 'all', sort: 'latest' });

  const filteredPulses = useMemo(() => {
    let list = [...pulses];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags ?? []).some(t => t.toLowerCase().includes(q))
      );
    }

    if (filters.type !== 'all')       list = list.filter(p => p.type === filters.type);
    if (filters.status !== 'all')     list = list.filter(p => p.status === filters.status);
    if (filters.visibility === 'visible') list = list.filter(p => p.visibility);
    if (filters.visibility === 'hidden')  list = list.filter(p => !p.visibility);

    if (filters.sort === 'trending') {
      list.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    } else if (filters.sort === 'priority') {
      list.sort((a, b) => a.priority - b.priority);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    return list;
  }, [pulses, filters]);

  // KPI value colors: green for primary metric, slate for scheduled, red for trending, gray for others
  const kpis = [
    { label: 'Active Pulses',   value: pulses.filter(p => p.status === 'published' && p.visibility).length, sub: 'live on website',   icon: Zap,      color: 'text-[#1f7a36]'  },
    { label: 'Scheduled',       value: pulses.filter(p => p.status === 'scheduled').length,                  sub: 'pending publish',   icon: Calendar, color: 'text-slate-600'   },
    { label: 'Trending Items',  value: pulses.filter(p => p.trending && p.status === 'published').length,    sub: 'highlighted',       icon: Flame,    color: 'text-red-500'     },
    { label: 'Website Visible', value: pulses.filter(p => p.visibility).length,                              sub: 'shown on site',     icon: Eye,      color: 'text-[#102018]'   },
    { label: 'Drafts',          value: pulses.filter(p => p.status === 'draft').length,                      sub: 'not yet published', icon: Archive,  color: 'text-gray-500'    },
  ];

  const openAdd  = ()  => { setEditPulse(null); setModalOpen(true); };
  const openEdit = (p) => { setEditPulse(p);    setModalOpen(true); };

  const handleDelete = (id) => setPulses(prev => prev.filter(p => p.id !== id));

  const handleToggle = (id, field) =>
    setPulses(prev => prev.map(p => p.id === id ? { ...p, [field]: !p[field] } : p));

  const handleSave = async (form) => {
    if (editPulse) {
      setPulses(prev => prev.map(p => p.id === form.id ? { ...form } : p));
    } else {
      const newPulse = { ...form, id: String(Date.now()), createdAt: new Date().toISOString() };
      setPulses(prev => [newPulse, ...prev]);
    }
    setModalOpen(false);
    setEditPulse(null);
  };

  const minHeight = modalOpen ? '1400px' : 'auto';

  return (
    <div className="space-y-6 relative" style={{ minHeight }}>

      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#edf8ee] flex items-center justify-center">
              <Zap size={17} className="text-[#1f7a36]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#102018] leading-tight">Today's Pulse</h1>
          </div>
          <p className="text-sm text-[#61756a] mt-0.5 ml-0.5">
            Manage daily pulse content displayed across the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200); }}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#cfe0d2] bg-white text-[#61756a] hover:text-[#1f7a36] hover:border-[#b6debb] transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2d5a27] hover:bg-[#1f4a1e] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-[#2d5a27]/20"
          >
            <Plus size={16} />
            Create Pulse
          </button>
        </div>
      </div>

      {/* ── Overview KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map(k => <OverviewCard key={k.label} {...k} />)}
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 space-y-3">

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb4a1] pointer-events-none" />
            <input
              value={filters.query}
              onChange={e => setFilter('query', e.target.value)}
              placeholder="Search by title, tag, description…"
              className="w-full pl-10 pr-4 py-2.5 border border-[#cfe0d2] rounded-xl text-sm bg-[#fafdfb] focus:outline-none focus:border-[#1f7a36] focus:ring-2 focus:ring-[#1f7a36]/20 transition-all placeholder:text-[#b0bcb5]"
            />
            {filters.query && (
              <button onClick={() => setFilter('query', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9bb4a1] hover:text-[#61756a]">
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={filters.sort}
            onChange={e => setFilter('sort', e.target.value)}
            className="px-3 py-2.5 border border-[#cfe0d2] rounded-xl text-xs font-semibold bg-white text-[#61756a] focus:outline-none focus:border-[#1f7a36] transition-all"
          >
            <option value="latest">Latest First</option>
            <option value="trending">Trending First</option>
            <option value="priority">By Priority</option>
          </select>

          <div className="hidden sm:flex border border-[#cfe0d2] rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#edf8ee] text-[#1f7a36]' : 'text-[#9bb4a1] hover:text-[#61756a]'}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2.5 border-l border-[#cfe0d2] transition-colors ${viewMode === 'list' ? 'bg-[#edf8ee] text-[#1f7a36]' : 'text-[#9bb4a1] hover:text-[#61756a]'}`}
            >
              <LayoutList size={15} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={13} className="text-[#9bb4a1]" />

          <select
            value={filters.type}
            onChange={e => setFilter('type', e.target.value)}
            className="px-3 py-1.5 border border-[#d1dfd5] rounded-lg text-xs font-semibold bg-white text-[#61756a] focus:outline-none focus:border-[#1f7a36] transition-all"
          >
            <option value="all">All Types</option>
            {PULSE_TYPE_LIST.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 border-l border-[#e2ece3] pl-2 flex-wrap">
            {['all', 'published', 'scheduled', 'draft', 'archived', 'expired'].map(s => (
              <FilterPill
                key={s}
                label={s === 'all' ? 'All Status' : (STATUS_CONFIG[s]?.label ?? s)}
                active={filters.status === s}
                onClick={() => setFilter('status', s)}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 border-l border-[#e2ece3] pl-2">
            <FilterPill
              label="Visible"
              icon={Eye}
              active={filters.visibility === 'visible'}
              onClick={() => setFilter('visibility', filters.visibility === 'visible' ? 'all' : 'visible')}
            />
            <FilterPill
              label="Hidden"
              icon={EyeOff}
              active={filters.visibility === 'hidden'}
              onClick={() => setFilter('visibility', filters.visibility === 'hidden' ? 'all' : 'hidden')}
            />
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
            >
              <X size={11} /> Clear ({activeFiltersCount})
            </button>
          )}

          <span className="ml-auto text-xs text-[#9bb4a1] font-medium">
            {filteredPulses.length} item{filteredPulses.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Content Area ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredPulses.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-[#cfe0d2] bg-[#fafdfb]">
          <div className="w-14 h-14 rounded-2xl bg-[#edf8ee] flex items-center justify-center mx-auto mb-4">
            <Zap size={24} className="text-[#b6debb]" />
          </div>
          <p className="text-sm font-bold text-[#61756a]">
            {filters.query || activeFiltersCount > 0
              ? 'No pulse items match your search'
              : 'No pulse content yet'}
          </p>
          <p className="text-xs text-[#9bb4a1] mt-1">
            {filters.query || activeFiltersCount > 0
              ? 'Try adjusting your search or filters'
              : 'Create your first pulse item to display on the website'}
          </p>
          {activeFiltersCount > 0 || filters.query ? (
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2d5a27] rounded-xl hover:bg-[#1f4a1e] transition-colors"
            >
              <X size={11} /> Clear filters
            </button>
          ) : (
            <button
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2d5a27] rounded-xl hover:bg-[#1f4a1e] transition-colors"
            >
              <Plus size={11} /> Create First Pulse
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPulses.map(p => (
            <PulseCard
              key={p.id}
              pulse={p}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredPulses.map(p => (
            <PulseListRow
              key={p.id}
              pulse={p}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      <PulseModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditPulse(null); }}
        onSave={handleSave}
        editPulse={editPulse}
      />
    </div>
  );
}