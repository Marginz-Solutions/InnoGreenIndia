'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Tag,
  Info,
  Package,
  Settings,
} from 'lucide-react';


import { Modal } from '@/components/website-customization/shared/Modal';
import { FormField } from '@/components/website-customization/form/FormField';
import { Input } from '@/components/website-customization/form/Input';
import { Select } from '@/components/website-customization/form/Select';
import { ImageUploadBox } from '@/components/website-customization/shared/ImageUploadBox';
import { Textarea } from '../form/TextArea';
import { Toggle } from '../shared/Toggle';
import { Product, Brand, Category } from '../products/types/Product.types';
import { TagInput } from './Taginput';


// ─── Section divider ───────────────────────────────────────────────────────────
const Section = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-2 pt-1 pb-0.5">
    <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#edf8ee] text-[#1f7a36]">
      <Icon size={13} />
    </div>
    <span className="text-xs font-bold text-[#21432a] uppercase tracking-widest">{label}</span>
    <div className="flex-1 h-px bg-[#e2ece3]" />
  </div>
);

// ─── Slug helper ──────────────────────────────────────────────────────────────
const toSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

// ─── Empty form state ─────────────────────────────────────────────────────────
const empty = (): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  slug: '',
  brandId: '',
  categoryId: '',
  description: '',
  shortDescription: '',
  imageUrl: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  tags: [],
  isActive: true,
  sku: '',
  featured: false,
  status: 'active',
});

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  editProduct: Product | null;
  brands: Brand[];
  categories: Category[];
}

export const ProductModal = ({
  open,
  onClose,
  onSave,
  editProduct,
  brands,
  categories,
}: Props) => {
  const [form, setForm] = useState(empty());
  const [slugLocked, setSlugLocked] = useState(false);

  // Sync form when editProduct changes
  useEffect(() => {
    if (editProduct) {
      setForm({ ...editProduct });
      setSlugLocked(true);
    } else {
      setForm(empty());
      setSlugLocked(false);
    }
  }, [editProduct, open]);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleNameChange = (name: string) => {
    set('name', name);
    if (!slugLocked) set('slug', toSlug(name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const product: Product = {
      id: editProduct?.id ?? String(Date.now()),
      createdAt: editProduct?.createdAt ?? now,
      updatedAt: now,
      ...form,
    };
    onSave(product);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editProduct ? 'Edit Product' : 'Add New Product'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Media ── */}
        <Section icon={Package} label="Media" />
        <FormField label="Product Image">
          <ImageUploadBox label="Click to upload product image (PNG, JPG, WEBP)" />
        </FormField>

        {/* ── Basic Info ── */}
        <Section icon={Info} label="Basic Info" />

        <FormField label="Product Name *">
          <Input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="e.g. BioShield Pro Spray"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Slug">
            <div className="relative">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugLocked(true);
                  set('slug', e.target.value);
                }}
                placeholder="bioshield-pro-spray"
              />
            </div>
          </FormField>
          <FormField label="SKU">
            <Input
              value={form.sku}
              onChange={(e) => set('sku', e.target.value)}
              placeholder="PST-001"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Brand">
            <Select
              value={form.brandId}
              onChange={(e) => set('brandId', e.target.value)}
            >
              <option value="">Select brand…</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Category">
            <Select
              value={form.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField label="Short Description">
          <Input
            value={form.shortDescription}
            onChange={(e) => set('shortDescription', e.target.value)}
            placeholder="One-line summary shown on product cards"
          />
        </FormField>

        <FormField label="Full Description">
          <Textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            placeholder="Full product details, usage instructions, benefits…"
          />
        </FormField>

        {/* ── Tags ── */}
        <Section icon={Tag} label="Tags" />
        <FormField label="Tags">
          <TagInput
            value={form.tags}
            onChange={(tags) => set('tags', tags)}
            placeholder="Type tag & press Enter…"
          />
        </FormField>

        {/* ── Contact ── */}
        <Section icon={User} label="Contact" />

        <FormField label="Contact Name">
          <Input
            value={form.contactName}
            onChange={(e) => set('contactName', e.target.value)}
            placeholder="Rajesh Kumar"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Contact Phone">
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756a]" />
              <Input
                value={form.contactPhone}
                onChange={(e) => set('contactPhone', e.target.value)}
                placeholder="+91 98765 43210"
                className="pl-9"
              />
            </div>
          </FormField>
          <FormField label="Contact Email">
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756a]" />
              <Input
                value={form.contactEmail}
                onChange={(e) => set('contactEmail', e.target.value)}
                placeholder="contact@brand.com"
                className="pl-9"
              />
            </div>
          </FormField>
        </div>

        {/* ── Settings ── */}
        <Section icon={Settings} label="Settings" />

        <div className="rounded-xl border border-[#e2ece3] bg-[#fafdfb] divide-y divide-[#e2ece3] overflow-hidden">
          <div className="px-4 py-3.5">
            <Toggle
              checked={form.status === 'active'}
              onChange={(v) => set('status', v ? 'active' : 'inactive')}
              label="Status"
              description="Show this product as active on the website"
            />
          </div>
          <div className="px-4 py-3.5">
            <Toggle
              checked={form.isActive}
              onChange={(v) => set('isActive', v)}
              label="Listing Active"
              description="Controls whether this product appears in search & listings"
            />
          </div>
          <div className="px-4 py-3.5">
            <Toggle
              checked={form.featured}
              onChange={(v) => set('featured', v)}
              label="Featured Product"
              description="Highlight this product in featured sections"
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1f7a36] hover:bg-[#166534] text-white text-sm font-semibold rounded-xl transition-colors duration-150"
          >
            {editProduct ? 'Save Changes' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#cfe0d2] text-[#61756a] hover:bg-[#f4faf5] text-sm font-semibold rounded-xl transition-colors duration-150"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};