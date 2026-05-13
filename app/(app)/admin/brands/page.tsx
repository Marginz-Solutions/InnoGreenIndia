'use client';

import React, { useState } from 'react';

import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  Globe,
} from 'lucide-react';

import {
  Brand,
} from '@/components/website-customization/types/common.types';

import { StatusBadge } from '@/components/website-customization/shared/StatusBadge';

import { Toggle } from '@/components/website-customization/shared/Toggle';

import { ImageUploadBox } from '@/components/website-customization/shared/ImageUploadBox';

import { EmptyState } from '@/components/website-customization/shared/EmptyState';

import { Modal } from '@/components/website-customization/shared/Modal';

import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';

import { FormField } from '@/components/website-customization/form/FormField';

import { Input } from '@/components/website-customization/form/Input';

import { Textarea } from '@/components/website-customization/form/TextArea';

const BRAND_SEED: Brand[] = [
  { id: '1', name: 'AgroShield', description: 'Leading manufacturer of bio-based pesticides and crop protection solutions.', website: 'https://agroshield.in', status: 'active', productsCount: 12 },
  { id: '2', name: 'NutriGrow', description: 'Specialised NPK and micro-nutrient fertilizer brand trusted by farmers across India.', website: 'https://nutrigrow.co.in', status: 'active', productsCount: 8 },
  { id: '3', name: 'SeedMax', description: 'Premium hybrid seed supplier for Kharif and Rabi seasons.', website: 'https://seedmax.com', status: 'inactive', productsCount: 5 },
];

export default function BrandsPage() {
  const [items, setItems] = useState<Brand[]>(BRAND_SEED);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Brand | null>(null);

  const filtered = items.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));
  const openAdd = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item: Brand) => { setEditItem(item); setModalOpen(true); };
  const handleDelete = (id: string) => { if (confirm('Delete brand?')) setItems((p) => p.filter((i) => i.id !== id)); };
  const toggleStatus = (id: string) => setItems((prev) => prev.map((b) => b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b));

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Brand = {
      id: editItem?.id ?? String(Date.now()),
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      website: fd.get('website') as string,
      status: editItem?.status ?? 'active',
      productsCount: editItem?.productsCount ?? 0,
    };
    setItems((prev) => editItem ? prev.map((i) => (i.id === editItem.id ? payload : i)) : [payload, ...prev]);
    setModalOpen(false);
  };

  return (
    <div>
      <Breadcrumb section="Brands" />
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#102018] mb-1">Brands</h1>
          <p className="muted text-sm">Manage brand partnerships and logos displayed on the website</p>
        </div>
        <button className="btn primary" onClick={openAdd}>
          <Plus size={16} /> Add Brand
        </button>
      </div>

      <div className="kpis mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
        {[
          { label: 'Total Brands', value: items.length },
          { label: 'Active', value: items.filter((b) => b.status === 'active').length },
          { label: 'Inactive', value: items.filter((b) => b.status === 'inactive').length },
          { label: 'Total Products', value: items.reduce((s, b) => s + b.productsCount, 0) },
        ].map((k) => (
          <div className="kpi" key={k.label}>
            <div className="label">{k.label}</div>
            <div className="value">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="searchbar">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#61756a]" />
          <input className="w-full pl-10 pr-4" placeholder="Search brands..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Briefcase} title="No brands yet" desc="Add your first brand partner to feature it on the website" onAdd={openAdd} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <div key={b.id} className="card flex flex-col gap-4">
              {/* Logo placeholder */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#edf8ee] border border-[#e2ece3] flex items-center justify-center shrink-0">
                  <Briefcase size={24} className="text-[#1f7a36]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#102018] truncate">{b.name}</h3>
                    <StatusBadge active={b.status === 'active'} />
                  </div>
                  <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1f7a36] flex items-center gap-1 hover:underline">
                    <Globe size={11} /> {b.website.replace('https://', '')}
                  </a>
                </div>
              </div>
              <p className="text-sm text-[#61756a] leading-relaxed">{b.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#e2ece3]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#61756a]">Active on site:</span>
                  <Toggle checked={b.status === 'active'} onChange={() => toggleStatus(b.id)} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(b)} className="btn" style={{ padding: '7px 10px' }}><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(b.id)} className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Brand' : 'Add Brand'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Brand Logo">
            <ImageUploadBox label="Upload brand logo (PNG / SVG recommended)" />
          </FormField>
          <FormField label="Brand Name">
            <Input name="name" defaultValue={editItem?.name} required placeholder="e.g. AgroShield" />
          </FormField>
          <FormField label="Website URL">
            <Input name="website" type="url" defaultValue={editItem?.website} placeholder="https://yourbrand.com" />
          </FormField>
          <FormField label="Description">
            <Textarea name="description" defaultValue={editItem?.description} placeholder="Short description about the brand..." />
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn primary flex-1">Save Brand</button>
            <button type="button" className="btn flex-1" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
