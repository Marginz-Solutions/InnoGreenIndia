'use client';

import React, { useState } from 'react';

import {
  BarChart3,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
} from 'lucide-react';

import {
  PulseItem,
} from '@/components/website-customization/types/common.types';

import { StatusBadge } from '@/components/website-customization/shared/StatusBadge';

import { Toggle } from '@/components/website-customization/shared/Toggle';

import { ImageUploadBox } from '@/components/website-customization/shared/ImageUploadBox';

import { EmptyState } from '@/components/website-customization/shared/EmptyState';

import { Pagination } from '@/components/website-customization/shared/Pagination';

import { Modal } from '@/components/website-customization/shared/Modal';

import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';

import { FormField } from '@/components/website-customization/form/FormField';

import { Input } from '@/components/website-customization/form/Input';

import { Select } from '@/components/website-customization/form/Select';

export const PULSE_SEED: PulseItem[] = [
  { id: '1', title: 'Premium Fertilizer Mix', price: 4500, unit: '50kg bag', available: true, status: 'active', category: 'Fertilizers', created_at: '2025-05-10' },
  { id: '2', title: 'Organic Seed Pack – Rabi', price: 2200, unit: 'per pack', available: true, status: 'active', category: 'Seeds', created_at: '2025-05-09' },
  { id: '3', title: 'Micro-nutrient Spray', price: 850, unit: 'per litre', available: false, status: 'draft', category: 'Pesticides', created_at: '2025-05-08' },
];

export default function PulsePage() {
  const [items, setItems] = useState<PulseItem[]>(PULSE_SEED);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PulseItem | null>(null);
  const [page, setPage] = useState(1);

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) &&
      (filterStatus === 'all' || i.status === filterStatus)
  );

  const openAdd = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item: PulseItem) => { setEditItem(item); setModalOpen(true); };

  const handleDelete = (id: string) => {
    if (confirm('Delete this pulse item?')) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleToggle = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: PulseItem = {
      id: editItem?.id ?? String(Date.now()),
      title: fd.get('title') as string,
      price: Number(fd.get('price')),
      unit: fd.get('unit') as string,
      category: fd.get('category') as string,
      status: fd.get('status') as 'active' | 'draft',
      available: editItem?.available ?? true,
      created_at: editItem?.created_at ?? new Date().toISOString().slice(0, 10),
    };
    setItems((prev) =>
      editItem ? prev.map((i) => (i.id === editItem.id ? payload : i)) : [payload, ...prev]
    );
    setModalOpen(false);
  };

  const totalItems = items.length;
  const availableItems = items.filter((i) => i.available).length;
  const activeItems = items.filter((i) => i.status === 'active').length;
  const avgPrice = items.length ? Math.round(items.reduce((s, i) => s + i.price, 0) / items.length) : 0;

  return (
    <div>
      <Breadcrumb section="Today's Available Pulse List" />
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#102018] mb-1">Today's Available Pulse List</h1>
          <p className="muted text-sm">Manage real-time product availability for today's offerings on the website</p>
        </div>
        <button className="btn primary" onClick={openAdd}>
          <Plus size={16} /> Add Pulse Item
        </button>
      </div>

      {/* KPIs */}
      <div className="kpis mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
        {[
          { label: 'Total Items', value: totalItems },
          { label: 'Available Now', value: availableItems },
          { label: 'Active', value: activeItems },
          { label: 'Avg. Price (₹)', value: `₹${avgPrice.toLocaleString()}` },
        ].map((k) => (
          <div className="kpi" key={k.label}>
            <div className="label">{k.label}</div>
            <div className="value">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="searchbar">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#61756a]" />
          <input
            className="w-full pl-10 pr-4"
            placeholder="Search pulse items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ minWidth: 150 }}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
        <button className="btn">
          <Upload size={15} /> Export
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={BarChart3} title="No pulse items yet" desc="Add your first pulse item to display it on the website" onAdd={openAdd} />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Unit</th>
                <th>Available</th>
                <th>Status</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="w-10 h-10 rounded-xl bg-[#edf8ee] flex items-center justify-center">
                      <ImageUploadBox small />
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold text-[#102018]">{item.title}</span>
                  </td>
                  <td>
                    <span className="tag">{item.category}</span>
                  </td>
                  <td className="font-bold text-[#1f7a36]">₹{item.price.toLocaleString()}</td>
                  <td className="text-[#61756a]">{item.unit}</td>
                  <td>
                    <Toggle checked={item.available} onChange={() => handleToggle(item.id)} />
                  </td>
                  <td>
                    <StatusBadge active={item.status === 'active'} labels={['Active', 'Draft']} />
                  </td>
                  <td className="text-[#61756a]">{item.created_at}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="btn" style={{ padding: '7px 10px' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-4">
          <Pagination page={page} total={Math.ceil(filtered.length / 10)} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => p + 1)} />
        </div>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Pulse Item' : 'Add Pulse Item'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Product Image">
            <ImageUploadBox label="Click to upload product image" />
          </FormField>
          <FormField label="Title">
            <Input name="title" defaultValue={editItem?.title} required placeholder="e.g. Premium Fertilizer Mix" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Price (₹)">
              <Input name="price" type="number" defaultValue={editItem?.price} required placeholder="0" />
            </FormField>
            <FormField label="Unit">
              <Input name="unit" defaultValue={editItem?.unit} required placeholder="per bag" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <Select name="category" defaultValue={editItem?.category ?? 'Seeds'}>
                {['Seeds', 'Fertilizers', 'Pesticides', 'Equipment', 'Other'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Status">
              <Select name="status" defaultValue={editItem?.status ?? 'active'}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </Select>
            </FormField>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn primary flex-1">Save Item</button>
            <button type="button" className="btn flex-1" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
