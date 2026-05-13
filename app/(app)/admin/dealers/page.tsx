'use client';

import React, { useState } from 'react';

import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Building2,
} from 'lucide-react';

import {
  Dealer,
} from '@/components/website-customization/types/common.types';

import { StatusBadge } from '@/components/website-customization/shared/StatusBadge';

import { Toggle } from '@/components/website-customization/shared/Toggle';

import { EmptyState } from '@/components/website-customization/shared/EmptyState';

import { Pagination } from '@/components/website-customization/shared/Pagination';

import { Modal } from '@/components/website-customization/shared/Modal';

import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';

import { FormField } from '@/components/website-customization/form/FormField';

import { Input } from '@/components/website-customization/form/Input';

const DEALER_SEED: Dealer[] = [
  { id: '1', name: 'Rajan Agro Store', location: 'Coimbatore, Tamil Nadu', phone: '+91 98765 43210', email: 'rajan@agrostore.com', district: 'Coimbatore', status: 'active' },
  { id: '2', name: 'Krishna Seed Centre', location: 'Salem, Tamil Nadu', phone: '+91 87654 32109', email: 'krishna@seedcentre.com', district: 'Salem', status: 'active' },
  { id: '3', name: 'Velu Farm Supplies', location: 'Madurai, Tamil Nadu', phone: '+91 76543 21098', email: 'velu@farmsupplies.com', district: 'Madurai', status: 'inactive' },
];

export default function DealersPage() {
  const [items, setItems] = useState<Dealer[]>(DEALER_SEED);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Dealer | null>(null);
  const [page, setPage] = useState(1);

  const filtered = items.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.district.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item: Dealer) => { setEditItem(item); setModalOpen(true); };
  const handleDelete = (id: string) => { if (confirm('Remove dealer?')) setItems((p) => p.filter((i) => i.id !== id)); };
  const toggleStatus = (id: string) => setItems((prev) => prev.map((d) => d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d));

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Dealer = {
      id: editItem?.id ?? String(Date.now()),
      name: fd.get('name') as string,
      location: fd.get('location') as string,
      phone: fd.get('phone') as string,
      email: fd.get('email') as string,
      district: fd.get('district') as string,
      status: editItem?.status ?? 'active',
    };
    setItems((prev) => editItem ? prev.map((i) => (i.id === editItem.id ? payload : i)) : [payload, ...prev]);
    setModalOpen(false);
  };

  return (
    <div>
      <Breadcrumb section="DealerHub" />
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#102018] mb-1">DealerHub</h1>
          <p className="muted text-sm">Manage authorised dealer information displayed on the website dealer locator</p>
        </div>
        <button className="btn primary" onClick={openAdd}>
          <Plus size={16} /> Add Dealer
        </button>
      </div>

      <div className="kpis mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
        {[
          { label: 'Total Dealers', value: items.length },
          { label: 'Active', value: items.filter((d) => d.status === 'active').length },
          { label: 'Inactive', value: items.filter((d) => d.status === 'inactive').length },
          { label: 'Districts', value: [...new Set(items.map((d) => d.district))].length },
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
          <input className="w-full pl-10 pr-4" placeholder="Search by name or district..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No dealers yet" desc="Add authorised dealers to display on your website's dealer locator" onAdd={openAdd} />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dealer Name</th>
                <th>District</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#edf8ee] flex items-center justify-center shrink-0">
                        <Building2 size={16} className="text-[#1f7a36]" />
                      </div>
                      <span className="font-semibold text-[#102018]">{d.name}</span>
                    </div>
                  </td>
                  <td><span className="tag">{d.district}</span></td>
                  <td>
                    <span className="flex items-center gap-1 text-[#61756a]">
                      <MapPin size={13} /> {d.location}
                    </span>
                  </td>
                  <td className="text-[#61756a]">{d.phone}</td>
                  <td className="text-[#61756a]">{d.email}</td>
                  <td><StatusBadge active={d.status === 'active'} /></td>
                  <td><Toggle checked={d.status === 'active'} onChange={() => toggleStatus(d.id)} /></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(d)} className="btn" style={{ padding: '7px 10px' }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(d.id)} className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Dealer' : 'Add Dealer'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Dealer / Store Name">
            <Input name="name" defaultValue={editItem?.name} required placeholder="e.g. Rajan Agro Store" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="District">
              <Input name="district" defaultValue={editItem?.district} required placeholder="Coimbatore" />
            </FormField>
            <FormField label="Full Location">
              <Input name="location" defaultValue={editItem?.location} placeholder="City, State" />
            </FormField>
          </div>
          <FormField label="Phone">
            <Input name="phone" type="tel" defaultValue={editItem?.phone} placeholder="+91 98765 43210" />
          </FormField>
          <FormField label="Email">
            <Input name="email" type="email" defaultValue={editItem?.email} placeholder="dealer@example.com" />
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn primary flex-1">Save Dealer</button>
            <button type="button" className="btn flex-1" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
