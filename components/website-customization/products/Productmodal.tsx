'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
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
import { Product } from '@/components/website-customization/types/common.types';
import { TagInput } from './Taginput';
import { Brand, Category } from '@/lib/global.types';


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
const empty = (): Omit<Product, 'id' | 'created_at' | 'updated_at'> => ({
  name: '',
  slug: '',
  brand_id: '',
  category_id: '',
  description: '',
  short_description: '',
  image_url: '',
  tags: [],
  is_active: true,
  sku: '',
  featured: false,
  status: 'active',
  quantity: 0,
  quantity_unit: '',
});

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (
  product: Product,
  selectedFile:
    File | null
) => Promise<void>;
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [slugLocked, setSlugLocked] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    console.log('Brands in modal:', brands);
    console.log('Categories in modal:', categories);
  }, [brands]);

  // Sync form when editProduct changes
  useEffect(() => {
    setErrors({});
    if (editProduct) {
      setForm({
        ...empty(),
        ...editProduct,
      });

      setImagePreview(
        editProduct.image_url ?? ''
      );

      setSlugLocked(true);
    } else {
      setForm(empty());

      setSlugLocked(false);

      setImagePreview("");

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [editProduct, open]);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleNameChange = (name: string) => {
    set('name', name);
    if (!slugLocked) set('slug', toSlug(name));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    // Validate type
    if (
      ![
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/svg+xml",
      ].includes(file.type)
    ) {
      setErrors((prev) => ({
        ...prev,
        image_url:
          "Only PNG, JPG, WEBP, SVG allowed",
      }));

      return;
    }

    // Validate size
    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setErrors((prev) => ({
        ...prev,
        image_url:
          "Image must be below 2MB",
      }));

      return;
    }

    // store file only
    setSelectedFile(file);

    // local preview only
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setErrors((prev) => ({
      ...prev,
      image_url: "",
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name = "Product name is required";
    }

    // SKU
    if (!form.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    // Brand
    if (!form.brand_id) {
      newErrors.brand_id = "Please select a brand";
    }

    // Category
    if (!form.category_id) {
      newErrors.category_id = "Please select a category";
    }

    // Short description
    if (!form.short_description.trim()) {
      newErrors.short_description =
        "Short description is required";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Description is required";
    }

    // Tags
    if (!form.tags.length) {
      newErrors.tags =
        "At least one tag is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const cleanedForm = {
        ...form,

        name: form.name.trim(),
        slug: form.slug.trim(),
        sku: form.sku.trim(),

        short_description:
          form.short_description.trim(),

        description:
          form.description.trim(),
      };

      const now =
        new Date().toISOString();

      const product: Product = {
        id:
          editProduct?.id ??
          String(Date.now()),

        created_at:
          editProduct?.created_at ??
          now,

        updated_at: now,

        ...cleanedForm,

      };

      await onSave(
  product,
  selectedFile
);
      setSelectedFile(null);

      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          imagePreview
        );
      }

      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onClose();
    } catch (err) {
      console.error(err);

      setUploading(false);
    }
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
        <FormField
          label="Product Image"
          error={errors.image_url}
        >
          <div className="space-y-3">
            <div
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="cursor-pointer"
            >
              <ImageUploadBox
                label="Click to upload product image (PNG, JPG, WEBP)"
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-44 object-cover rounded-xl border border-[#dbe7dd]"
              />
            )}
          </div>
        </FormField>

        {/* ── Basic Info ── */}
        <Section icon={Info} label="Basic Info" />

        <FormField
          label="Product Name *"
          error={errors.name}
        >
          <Input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. BioShield Pro Spray"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Slug"
            error={errors.slug}
          >
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
          <FormField label="SKU"
            error={errors.sku}
          >
            <Input
              value={form.sku}
              onChange={(e) => set('sku', e.target.value)}
              placeholder="PST-001"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
  <FormField label="Quantity" error={errors.quantity}>
    <Input
      value={form.quantity || 0}
      onChange={(e) => set('quantity', parseInt(e.target.value) || 0)}
      placeholder="0"
      min="0"
    />
  </FormField>
  <FormField label="Unit" error={errors.quantity_unit}>
    <Select
      value={form.quantity_unit || 'pcs'}
      onChange={(e) => set('quantity_unit', e.target.value)}
    >
      <option value="pcs">Pieces (pcs)</option>
      <option value="kg">Kilograms (kg)</option>
      <option value="l">Liters (l)</option>
      <option value="m">Meters (m)</option>
      <option value="box">Boxes</option>
      <option value="pack">Packs</option>
      <option value="dozen">Dozen</option>
      <option value="ton">Tons</option>
      <option value="ml">Milliliters (ml)</option>
      <option value="g">Grams (g)</option>
    </Select>
  </FormField>
</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Brand" error={errors.brand_id}>
            <Select
              value={form.brand_id}
              onChange={(e) => set('brand_id', e.target.value)}
            >
              <option value="">Select brand…</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Category" error={errors.category_id}>
            <Select
              value={form.category_id}
              onChange={(e) => set('category_id', e.target.value)}
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

        <FormField label="Short Description" error={errors.short_description}>
          <Input
            value={form.short_description}
            onChange={(e) => set('short_description', e.target.value)}
            placeholder="One-line summary shown on product cards"
          />
        </FormField>

        <FormField label="Full Description" error={errors.description}>
          <Textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            placeholder="Full product details, usage instructions, benefits…"
          />
        </FormField>

        {/* ── Tags ── */}
        <Section icon={Tag} label="Tags" />
        <FormField label="Tags" error={errors.tags}>
          <TagInput
            value={form.tags}
            onChange={(tags) => set('tags', tags)}
            placeholder="Type tag & press Enter…"
          />
        </FormField>

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
              checked={form.is_active}
              onChange={(v) => set('is_active', v)}
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
            disabled={uploading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1f7a36] hover:bg-[#166534] text-white text-sm font-semibold rounded-xl transition-colors duration-150"
          >
            {uploading
              ? "Uploading..."
              : editProduct
                ? "Save Changes"
                : "Add Product"
            }
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