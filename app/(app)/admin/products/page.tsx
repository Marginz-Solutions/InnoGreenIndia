'use client';

import React, { useState } from 'react';

import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
} from 'lucide-react';

import {
  Product,
} from '@/components/website-customization/types/common.types';

import { StatusBadge } from '@/components/website-customization/shared/StatusBadge';

import { EmptyState } from '@/components/website-customization/shared/EmptyState';

import { Pagination } from '@/components/website-customization/shared/Pagination';

import { Modal } from '@/components/website-customization/shared/Modal';

import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';

import { FormField } from '@/components/website-customization/form/FormField';

import { Input } from '@/components/website-customization/form/Input';

import { Select } from '@/components/website-customization/form/Select';

import { ImageUploadBox } from '@/components/website-customization/shared/ImageUploadBox';

const PROD_SEED: Product[] = [
  { id: '1', name: 'BioShield Pro Spray', category: 'Pesticides', sku: 'PST-001', featured: true, status: 'active', tags: ['Organic', 'Best Seller'] },
  { id: '2', name: 'NutriGrow 32-8-8', category: 'Fertilizers', sku: 'FRT-012', featured: false, status: 'active', tags: ['NPK'] },
  { id: '3', name: 'HybridSeed Maize X7', category: 'Seeds', sku: 'SED-045', featured: true, status: 'inactive', tags: ['Hybrid', 'Kharif'] },
];

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>(PROD_SEED);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [page, setPage] = useState(1);

  const filtered = items.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) &&
      (catFilter === 'all' || p.category === catFilter)
  );

  const openAdd = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item: Product) => { setEditItem(item); setModalOpen(true); };
  const handleDelete = (id: string) => { if (confirm('Delete product?')) setItems((p) => p.filter((i) => i.id !== id)); };
  const toggleFeatured = (id: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i)));

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const tags = (fd.get('tags') as string).split(',').map((t) => t.trim()).filter(Boolean);
    const payload: Product = {
      id: editItem?.id ?? String(Date.now()),
      name: fd.get('name') as string,
      category: fd.get('category') as string,
      sku: fd.get('sku') as string,
      status: fd.get('status') as 'active' | 'inactive',
      featured: editItem?.featured ?? false,
      tags,
    };
    setItems((prev) => editItem ? prev.map((i) => (i.id === editItem.id ? payload : i)) : [payload, ...prev]);
    setModalOpen(false);
  };

  return (
    <div>
      <Breadcrumb section="Products" />
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#102018] mb-1">Products</h1>
          <p className="muted text-sm">Manage your product catalogue and website listings</p>
        </div>
        <button className="btn primary" onClick={openAdd}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="kpis mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
        {[
          { label: 'Total Products', value: items.length },
          { label: 'Active', value: items.filter((i) => i.status === 'active').length },
          { label: 'Featured', value: items.filter((i) => i.featured).length },
          { label: 'Categories', value: [...new Set(items.map((i) => i.category))].length },
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
          <input className="w-full pl-10 pr-4" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ minWidth: 160 }}>
          <option value="all">All Categories</option>
          {['Seeds', 'Fertilizers', 'Pesticides', 'Equipment'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products yet" desc="Add your first product to display on the website" onAdd={openAdd} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="card relative group">
              {/* Image preview */}
              <div className="w-full h-36 rounded-xl bg-[#f0f8f1] flex items-center justify-center mb-4 border border-[#e2ece3] overflow-hidden">
                <Package size={40} className="text-[#c5ddc8]" />
              </div>
              {/* Featured star */}
              <button
                onClick={() => toggleFeatured(p.id)}
                className={`absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${p.featured ? 'bg-[#c9a646] text-white' : 'bg-white border border-[#e2ece3] text-[#b0b8b3]'}`}
              >
                <Star size={14} fill={p.featured ? 'currentColor' : 'none'} />
              </button>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-[#102018] text-sm leading-tight">{p.name}</h3>
                <StatusBadge active={p.status === 'active'} />
              </div>
              <p className="text-xs text-[#61756a] mb-3">SKU: {p.sku} · {p.category}</p>
              <div className="inline-tags mb-4">
                {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="btn flex-1" style={{ fontSize: 13, padding: '8px 10px' }}>
                  <Edit2 size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-4">
          <Pagination page={page} total={Math.ceil(filtered.length / 9)} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => p + 1)} />
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Product Image">
            <ImageUploadBox label="Click to upload product image" />
          </FormField>
          <FormField label="Product Name">
            <Input name="name" defaultValue={editItem?.name} required placeholder="e.g. BioShield Pro Spray" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <Select name="category" defaultValue={editItem?.category ?? 'Seeds'}>
                {['Seeds', 'Fertilizers', 'Pesticides', 'Equipment'].map((c) => <option key={c}>{c}</option>)}
              </Select>
            </FormField>
            <FormField label="SKU">
              <Input name="sku" defaultValue={editItem?.sku} placeholder="PST-001" />
            </FormField>
          </div>
          <FormField label="Tags (comma separated)">
            <Input name="tags" defaultValue={editItem?.tags.join(', ')} placeholder="Organic, Best Seller" />
          </FormField>
          <FormField label="Status">
            <Select name="status" defaultValue={editItem?.status ?? 'active'}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn primary flex-1">Save Product</button>
            <button type="button" className="btn flex-1" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
