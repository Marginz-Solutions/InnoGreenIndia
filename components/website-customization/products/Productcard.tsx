'use client';

import React from 'react';
import {
  Package,
  Star,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Tag,
} from 'lucide-react';

import { StatusBadge } from '@/components/website-customization/shared/StatusBadge';
import { Product } from '../types/common.types';


// ─── StatusBadge is expected from existing shared components ──────────────────
// If you don't have it, see the StatusBadge.tsx file in this output.

interface Props {
  product: Product;
  brandName: string;
  categoryName: string;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export const ProductCard = ({
  product: p,
  brandName,
  categoryName,
  onEdit,
  onDelete,
  onToggleFeatured,
}: Props) => {
  return (
    <article className="group relative bg-white border border-[#e2ece3] rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgba(31,122,54,0.10)] hover:-translate-y-0.5 transition-all duration-200">

      {/* ── Image / Placeholder ── */}
      <div className="relative h-44 bg-gradient-to-br from-[#f0f8f1] to-[#e6f4ea] overflow-hidden flex items-center justify-center">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#b8d4bb]">
            <Package size={42} strokeWidth={1.2} />
            <span className="text-xs font-medium">No image</span>
          </div>
        )}

        {/* Featured badge */}
        <button
          onClick={() => onToggleFeatured(p.id)}
          title={p.featured ? 'Remove from featured' : 'Mark as featured'}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 shadow-sm ${
            p.featured
              ? 'bg-amber-400 border-amber-400 text-white shadow-amber-200'
              : 'bg-white/80 backdrop-blur-sm border-[#e2ece3] text-[#b0bcb5] hover:border-amber-400 hover:text-amber-400'
          }`}
        >
          <Star size={14} fill={p.featured ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>

        {/* Category chip */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/85 backdrop-blur-sm border border-[#e2ece3] rounded-full text-xs font-semibold text-[#1f7a36] shadow-sm">
          <Tag size={10} />
          {categoryName}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-4">

        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-[#102018] text-sm leading-snug line-clamp-2 flex-1">
            {p.name}
          </h3>
          <StatusBadge active={p.status === 'active'} />
        </div>

        {/* Brand + SKU */}
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          {brandName && (
            <span className="text-xs text-[#61756a] font-medium">{brandName}</span>
          )}
          {brandName && <span className="text-[#d1dfd5]">·</span>}
          <span className="text-xs font-mono bg-[#f4faf5] border border-[#e2ece3] px-2 py-0.5 rounded-md text-[#61756a]">
            {p.sku}
          </span>
        </div>

        {/* Short description */}
        {p.shortDescription && (
          <p className="text-xs text-[#61756a] leading-relaxed line-clamp-2 mb-3">
            {p.shortDescription}
          </p>
        )}

        {/* Tags */}
        {p.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {p.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 bg-[#edf8ee] text-[#1f7a36] text-[11px] font-semibold rounded-lg border border-[#c8e6cc]"
              >
                {t}
              </span>
            ))}
            {p.tags.length > 4 && (
              <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[11px] font-semibold rounded-lg border border-slate-200">
                +{p.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Contact info */}
        {(p.contactName || p.contactEmail || p.contactPhone) && (
          <div className="py-2.5 mb-3 border-t border-b border-[#f0f8f1] space-y-1">
            {p.contactName && (
              <p className="text-xs text-[#61756a] font-medium truncate">{p.contactName}</p>
            )}
            <div className="flex items-center gap-3">
              {p.contactPhone && (
                <a
                  href={`tel:${p.contactPhone}`}
                  className="inline-flex items-center gap-1 text-[11px] text-[#61756a] hover:text-[#1f7a36] transition-colors"
                >
                  <Phone size={10} /> {p.contactPhone}
                </a>
              )}
              {p.contactEmail && (
                <a
                  href={`mailto:${p.contactEmail}`}
                  className="inline-flex items-center gap-1 text-[11px] text-[#61756a] hover:text-[#1f7a36] transition-colors truncate"
                >
                  <Mail size={10} /> {p.contactEmail}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(p)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#cfe0d2] bg-[#f4faf5] text-[#1f7a36] text-xs font-semibold hover:bg-[#edf8ee] hover:border-[#1f7a36] transition-all duration-150"
          >
            <Edit2 size={12} />
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${p.name}"?`)) onDelete(p.id);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-all duration-150 shrink-0"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </article>
  );
};