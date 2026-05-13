'use client';

import React, { useState } from 'react';

import {
    PhoneCall,
    Plus,
    Search,
    Edit2,
    Trash2,
    Mail,
    Phone,
    MapPin,
    Globe,
    Star,
    AlertCircle,
} from 'lucide-react';

import {
    ContactItem,
} from '@/components/website-customization/types/common.types';


import { EmptyState } from '@/components/website-customization/shared/EmptyState';

import { Modal } from '@/components/website-customization/shared/Modal';

import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';

import { FormField } from '@/components/website-customization/form/FormField';

import { Input } from '@/components/website-customization/form/Input';

import { Select } from '@/components/website-customization/form/Select';

const CONTACT_SEED: ContactItem[] = [
    { id: '1', label: 'Main Office Email', type: 'email', value: 'info@igim.in', primary: true },
    { id: '2', label: 'Support Phone', type: 'phone', value: '+91 98765 00000', primary: true },
    { id: '3', label: 'Head Office', type: 'address', value: '123, Agro Tower, Coimbatore – 641001, Tamil Nadu, India', primary: true },
    { id: '4', label: 'Facebook', type: 'social', value: 'https://facebook.com/igim', platform: 'Facebook', primary: false },
    { id: '5', label: 'Instagram', type: 'social', value: 'https://instagram.com/igim_official', platform: 'Instagram', primary: false },
];

const contactTypeIcon = (type: ContactItem['type'], platform?: string) => {
    if (type === 'email') return <Mail size={16} className="text-[#1f7a36]" />;
    if (type === 'phone') return <Phone size={16} className="text-[#1f7a36]" />;
    if (type === 'address') return <MapPin size={16} className="text-[#1f7a36]" />;
    //   if (platform === 'Facebook') return <Facebook size={16} className="text-[#1f7a36]" />;
    //   if (platform === 'Instagram') return <Instagram size={16} className="text-[#1f7a36]" />;
    //   if (platform === 'Twitter') return <Twitter size={16} className="text-[#1f7a36]" />;
    return <Globe size={16} className="text-[#1f7a36]" />;
};

export const ContactsSection = () => {
    const [items, setItems] = useState<ContactItem[]>(CONTACT_SEED);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<ContactItem | null>(null);

    const openAdd = () => { setEditItem(null); setModalOpen(true); };
    const openEdit = (item: ContactItem) => { setEditItem(item); setModalOpen(true); };
    const handleDelete = (id: string) => { if (confirm('Delete contact?')) setItems((p) => p.filter((i) => i.id !== id)); };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const type = fd.get('type') as ContactItem['type'];
        const payload: ContactItem = {
            id: editItem?.id ?? String(Date.now()),
            label: fd.get('label') as string,
            type,
            value: fd.get('value') as string,
            platform: type === 'social' ? (fd.get('platform') as string) : undefined,
            primary: fd.get('primary') === 'on',
        };
        setItems((prev) => editItem ? prev.map((i) => (i.id === editItem.id ? payload : i)) : [payload, ...prev]);
        setModalOpen(false);
    };

    const groups: { title: string; type: ContactItem['type'] | 'social'; items: ContactItem[] }[] = [
        { title: 'Email Addresses', type: 'email', items: items.filter((i) => i.type === 'email') },
        { title: 'Phone Numbers', type: 'phone', items: items.filter((i) => i.type === 'phone') },
        { title: 'Office Addresses', type: 'address', items: items.filter((i) => i.type === 'address') },
        { title: 'Social Media', type: 'social', items: items.filter((i) => i.type === 'social') },
    ];

    return (
        <div>
            <Breadcrumb section="Contacts" />
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-[#102018] mb-1">Contacts</h1>
                    <p className="muted text-sm">Manage all contact information and social links shown on the website</p>
                </div>
                <button className="btn primary" onClick={openAdd}>
                    <Plus size={16} /> Add Contact
                </button>
            </div>

            <div className="kpis mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
                {[
                    { label: 'Total Entries', value: items.length },
                    { label: 'Emails', value: items.filter((i) => i.type === 'email').length },
                    { label: 'Phone Numbers', value: items.filter((i) => i.type === 'phone').length },
                    { label: 'Social Links', value: items.filter((i) => i.type === 'social').length },
                ].map((k) => (
                    <div className="kpi" key={k.label}>
                        <div className="label">{k.label}</div>
                        <div className="value">{k.value}</div>
                    </div>
                ))}
            </div>

            {/* Alert */}
            <div className="note flex items-start gap-3 mb-5">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span className="text-sm">Changes to contact information will be reflected live on the website after saving.</span>
            </div>

            {items.length === 0 ? (
                <EmptyState
                    icon={PhoneCall}
                    title="No contacts added"
                    desc="Add contact information that will appear on the website"
                    onAdd={openAdd}
                />
            ) : (
                <div className="space-y-6">
                    {groups.map((g) => (
                        <div key={g.type} className="card">
                            <h3 className="font-bold text-[#102018] mb-4 flex items-center gap-2">
                                {contactTypeIcon(g.type)}
                                {g.title}
                            </h3>
                            {g.items.length === 0 ? (
                                <p className="text-sm text-[#61756a]">No entries yet. <button onClick={openAdd} className="text-[#1f7a36] font-semibold hover:underline">Add one →</button></p>
                            ) : (
                                <div className="space-y-3">
                                    {g.items.map((c) => (
                                        <div key={c.id} className="flex flex-wrap items-start justify-between gap-3 p-4 rounded-xl bg-[#f7fcf8] border border-[#e2ece3]">
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-white border border-[#e2ece3] flex items-center justify-center shrink-0 shadow-sm">
                                                    {contactTypeIcon(c.type, c.platform)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="font-semibold text-[#102018] text-sm">{c.label}</span>
                                                        {c.primary && <span className="badge" style={{ padding: '3px 8px', fontSize: 10 }}>Primary</span>}
                                                    </div>
                                                    <p className="text-sm text-[#61756a] break-all">{c.value}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button onClick={() => openEdit(c)} className="btn" style={{ padding: '7px 10px' }}><Edit2 size={14} /></button>
                                                <button onClick={() => handleDelete(c.id)} className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Contact' : 'Add Contact'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <FormField label="Label">
                        <Input name="label" defaultValue={editItem?.label} required placeholder="e.g. Support Email" />
                    </FormField>
                    <FormField label="Type">
                        <Select name="type" defaultValue={editItem?.type ?? 'email'}>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="address">Address</option>
                            <option value="social">Social Media</option>
                        </Select>
                    </FormField>
                    {(!editItem || editItem.type === 'social') && (
                        <FormField label="Platform (for Social)">
                            <Select name="platform" defaultValue={editItem?.platform ?? 'Facebook'}>
                                {['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube'].map((p) => <option key={p}>{p}</option>)}
                            </Select>
                        </FormField>
                    )}
                    <FormField label="Value / URL">
                        <Input name="value" defaultValue={editItem?.value} required placeholder="Enter email, phone, address or URL" />
                    </FormField>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" name="primary" id="primary" defaultChecked={editItem?.primary} className="w-4 h-4 accent-[#1f7a36]" />
                        <label htmlFor="primary" className="text-sm font-medium text-[#102018]">Mark as primary contact</label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn primary flex-1">Save Contact</button>
                        <button type="button" className="btn flex-1" onClick={() => setModalOpen(false)}>Cancel</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};