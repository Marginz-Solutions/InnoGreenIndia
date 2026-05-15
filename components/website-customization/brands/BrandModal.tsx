'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Image, Info, Tag, Users, Settings, Phone, Mail, X } from 'lucide-react';

import { Modal } from '@/components/website-customization/shared/Modal';
import { FormField } from '@/components/website-customization/form/FormField';
import { Input } from '@/components/website-customization/form/Input';
import { Textarea } from '@/components/website-customization/form/TextArea';
import { Toggle } from '@/components/website-customization/shared/Toggle';
import { TagInput } from '@/components/website-customization/products/Taginput';
import ErrorBanner from '@/components/ErrorBanner';
import type { Brand, Category } from '@/components/website-customization/types/common.types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (fd: FormData) => Promise<void>;
  editBrand: Brand | null;
  categories: Category[];
  saving: boolean;
  error: any;
}

interface FormState {
  name: string;
  description: string;
  websiteUrl: string;
  tags: string[];
  categoryIds: string[];
  isActive: boolean;
  contact: {
    name: string;
    email: string;
    phoneNo: string;
    whatsapp: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
  };
  logoFile: File | null;
  imageFile: File | null;
  logoPreview: string | null;
  imagePreview: string | null;
}

const Section = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex items-center gap-2 pt-1 pb-0.5">
    <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#edf8ee] text-[#1f7a36]">
      <Icon size={13} />
    </div>
    <span className={`text-xs font-bold text-[#21432a] uppercase tracking-widest ${label === 'Categories' ? 'input-required' : ''} `}>{label}</span>
    <div className="flex-1 h-px bg-[#e2ece3]" />
  </div>
);

const initialState: FormState = {
  name: '', description: '', websiteUrl: '', tags: [], categoryIds: [], isActive: true,
  contact: { name: '', email: '', phoneNo: '', whatsapp: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' },
  logoFile: null, imageFile: null, logoPreview: null, imagePreview: null,
};

export function BrandModal({ open, onClose, onSave, editBrand, categories, saving, error }: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const logoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(!open) return;

    setFieldErrors({});

    if(editBrand) {
      setForm({
        name: editBrand.name,
        description: editBrand.description ?? '',
        websiteUrl: editBrand.websiteUrl ?? '',
        tags: editBrand.tags ?? [],
        categoryIds: editBrand.categories.map(c => c.id),
        isActive: editBrand.isActive,
        contact: {
          name: editBrand.contact?.name ?? '',
          email: editBrand.contact?.email ?? '',
          phoneNo: editBrand.contact?.phoneNo ?? '',
          whatsapp: editBrand.contact?.whatsapp ?? '',
          addressLine1: editBrand.contact?.addressLine1 ?? '',
          addressLine2: editBrand.contact?.addressLine2 ?? '',
          city: editBrand.contact?.city ?? '',
          state: editBrand.contact?.state ?? '',
          pincode: editBrand.contact?.pincode ?? '',
        },
        logoFile: null, imageFile: null,
        logoPreview: editBrand.logoUrl ?? null,
        imagePreview: editBrand.imageUrl ?? null,
      });
    } 
    else {
      setForm(initialState);
    }
    if(logoRef.current) logoRef.current.value = '';
    if(imageRef.current) imageRef.current.value = '';
  }, [open, editBrand]);

  const update = (field: keyof FormState, value: any) => setForm(prev => ({ ...prev, [field]: value }));
  const updateContact = (field: string, value: string) => 
    setForm(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'image') => {
    const file = e.target.files?.[0] ?? null;
    const preview = file ? URL.createObjectURL(file) : null;
    if(type === 'logo') {
      setForm(prev => ({ ...prev, logoFile: file, logoPreview: preview }));
      setFieldErrors(prev => ({ ...prev, logoFile: '' }));
    } 
    else {
      setForm(prev => ({ ...prev, imageFile: file, imagePreview: preview }));
      setFieldErrors(prev => ({ ...prev, imageFile: '' }));
    }
  };

  const toggleCategory = (id: string) =>
    update('categoryIds', form.categoryIds.includes(id) ? form.categoryIds.filter(c => c !== id) : [...form.categoryIds, id]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('websiteUrl', form.websiteUrl);
    fd.append('tags', JSON.stringify(form.tags));
    fd.append('categoryIds', JSON.stringify(form.categoryIds));
    fd.append('contact', JSON.stringify(form.contact));
    fd.append('isActive', String(form.isActive));
    if(form.logoFile) fd.append('logo', form.logoFile);
    if(form.imageFile) fd.append('image', form.imageFile);

    if(!form.imagePreview && editBrand?.imageUrl) {
      fd.append('removeImage', 'true');
    }
    
    try {
      await onSave(fd);
    } 
    catch(error: any) {
      if(error?.details && typeof error.details === 'object') {
        setFieldErrors(error.details as Record<string, string>);
      }
    }
  };

  const hasError = (field: string) => !!fieldErrors[field];
  const getError = (field: string) => fieldErrors[field];

  return (
    <Modal open={open} onClose={onClose} title={editBrand ? 'Edit Brand' : 'Add Brand'}>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        {error && <ErrorBanner error={typeof error === 'string' ? error : error?.message ?? 'An error occurred'} />}

        {/* Media */}
        <Section icon={Image} label="Media" />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Logo" className="input-required" error={getError('logoFile')}>
            <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl bg-[#f7fcf8] cursor-pointer hover:border-[#1f7a36] hover:bg-[#edf8ee] transition-colors h-28 overflow-hidden ${
              hasError('logoFile') ? 'border-red-500' : 'border-[#c5ddc8]'
            }`}>
              {form.logoPreview
                ? <img src={form.logoPreview} alt="logo" className="h-full w-full object-contain p-2" />
                : <span className="text-xs text-[#61756a] font-medium text-center px-2">Logo (PNG/JPG/WEBP/SVG)</span>
              }
              <input ref={logoRef} type="file" name="logo" accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="sr-only" onChange={e => handleFileChange(e, 'logo')} />
            </label>
          </FormField>
          <FormField label="Image (optional)" error={getError('imageFile')}>
            <div className='relative'>
              {form.imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(prev => ({ ...prev, imageFile: null, imagePreview: null }));
                    if (imageRef.current) imageRef.current.value = '';
                  }}
                  className="absolute -top-1.5 -right-1 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-700"
                >
                  <X size={12} />
                </button>
              )}

              <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl bg-[#f7fcf8] cursor-pointer hover:border-[#1f7a36] hover:bg-[#edf8ee] transition-colors h-28 overflow-hidden ${
                hasError('imageFile') ? 'border-red-500' : 'border-[#c5ddc8]'
              }`}>
                {form.imagePreview
                  ? <img src={form.imagePreview} alt="banner" className="h-full w-full object-contain p-2" />
                  : <span className="text-xs text-[#61756a] font-medium text-center px-2">Banner / hero image</span>
                }
                <input ref={imageRef} type="file" name="image" accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="sr-only" onChange={e => handleFileChange(e, 'image')} />
              </label>
            </div>
          </FormField>
        </div>

        {/* Basic Info */}
        <Section icon={Info} label="Basic Info" />
        <FormField label="Brand Name" className="input-required" error={getError('name')}>
          <Input value={form.name} onChange={e => { update('name', e.target.value); setFieldErrors(p => ({ ...p, name: '' })); }} 
            required placeholder="e.g. AgroShield" className={hasError('name') ? 'border-red-500' : ''} />
        </FormField>
        <FormField label="Website URL" error={getError('websiteUrl')}>
          <Input value={form.websiteUrl} onChange={e => { update('websiteUrl', e.target.value); setFieldErrors(p => ({ ...p, websiteUrl: '' })); }} 
            type="url" placeholder="https://yourbrand.com" className={hasError('websiteUrl') ? 'border-red-500' : ''} />
        </FormField>
        <FormField label="Description" error={getError('description')}>
          <Textarea value={form.description} onChange={e => { update('description', e.target.value); setFieldErrors(p => ({ ...p, description: '' })); }} 
            placeholder="Short description about the brand…" className={hasError('description') ? 'border-red-500' : ''} />
        </FormField>

        {/* Tags */}
        <Section icon={Tag} label="Tags" />
        <FormField label="Tags" error={getError('tags')}>
          <TagInput value={form.tags} onChange={(v) => { update('tags', v); setFieldErrors(p => ({ ...p, tags: '' })); }} 
            placeholder="Type tag & press Enter…" />
        </FormField>

        {/* Categories */}
        <Section icon={Info} label="Categories" />
        {hasError('categoryIds') && <p className="text-xs text-red-600">{getError('categoryIds')}</p>}
        <div className="flex flex-wrap gap-2">
          {categories.map(c => {
            const checked = form.categoryIds.includes(c.id);
            return (
              <button key={c.id} type="button" onClick={() => { toggleCategory(c.id); setFieldErrors(p => ({ ...p, categoryIds: '' })); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  checked
                    ? 'bg-[#1f7a36] text-white border-[#1f7a36]'
                    : 'bg-white text-[#61756a] border-[#d1dfd5] hover:border-[#1f7a36]'
                }`}>
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Contact */}
        <Section icon={Users} label="Contact" />
        <FormField label="Contact Name" className="input-required" error={getError('contact.name')}>
          <Input value={form.contact.name} onChange={e => { updateContact('name', e.target.value); setFieldErrors(p => ({ ...p, 'contact.name': '' })); }} 
            required placeholder="Rajesh Kumar" className={hasError('contact.name') ? 'border-red-500' : ''} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone" className="input-required" error={getError('contact.phoneNo')}>
            <div className="relative">
              <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756a]" />
              <Input value={form.contact.phoneNo} onChange={e => { updateContact('phoneNo', e.target.value); setFieldErrors(p => ({ ...p, 'contact.phoneNo': '' })); }}
                required placeholder="9876543210" className={`pl-9 ${hasError('contact.phoneNo') ? 'border-red-500' : ''}`} maxLength={10} />
            </div>
          </FormField>
          <FormField label="WhatsApp" className="input-required" error={getError('contact.whatsapp')}>
            <Input value={form.contact.whatsapp} onChange={e => { updateContact('whatsapp', e.target.value); setFieldErrors(p => ({ ...p, 'contact.whatsapp': '' })); }}
              required placeholder="9876543210" className={hasError('contact.whatsapp') ? 'border-red-500' : ''} maxLength={10} />
          </FormField>
          <label className="flex items-center gap-2 text-xs text-[#61756a] cursor-pointer -mt-1">
            <input
              type="checkbox"
              onChange={e => {
                if(e.target.checked) updateContact('whatsapp', form.contact.phoneNo);
                if(!e.target.checked) updateContact('whatsapp', '')
              }}
              defaultValue={form.contact.phoneNo === form.contact.whatsapp ? 1 : 0}
            />
            Same as WhatsApp number
          </label>
        </div>
        <FormField label="Email" error={getError('contact.email')}>
          <div className="relative">
            <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756a]" />
            <Input value={form.contact.email} onChange={e => { updateContact('email', e.target.value); setFieldErrors(p => ({ ...p, 'contact.email': '' })); }}
              type="email" placeholder="contact@brand.com" className={`pl-9 ${hasError('contact.email') ? 'border-red-500' : ''}`} />
          </div>
        </FormField>
        <FormField label="Address Line 1" error={getError('contact.addressLine1')}>
          <Input value={form.contact.addressLine1} onChange={e => { updateContact('addressLine1', e.target.value); setFieldErrors(p => ({ ...p, 'contact.addressLine1': '' })); }} 
            placeholder="Street / locality" className={hasError('contact.addressLine1') ? 'border-red-500' : ''} />
        </FormField>
        <FormField label="Address Line 2" error={getError('contact.addressLine2')}>
          <Input value={form.contact.addressLine2} onChange={e => { updateContact('addressLine2', e.target.value); setFieldErrors(p => ({ ...p, 'contact.addressLine2': '' })); }} 
            placeholder="Area / landmark" className={hasError('contact.addressLine2') ? 'border-red-500' : ''} />
        </FormField>
        <div className="grid grid-cols-3 gap-3">
          <FormField label="City" error={getError('contact.city')}>
            <Input value={form.contact.city} onChange={e => { updateContact('city', e.target.value); setFieldErrors(p => ({ ...p, 'contact.city': '' })); }} 
              placeholder="City" className={hasError('contact.city') ? 'border-red-500' : ''} />
          </FormField>
          <FormField label="State" error={getError('contact.state')}>
            <Input value={form.contact.state} onChange={e => { updateContact('state', e.target.value); setFieldErrors(p => ({ ...p, 'contact.state': '' })); }} 
              placeholder="State" className={hasError('contact.state') ? 'border-red-500' : ''} />
          </FormField>
          <FormField label="Pincode" error={getError('contact.pincode')}>
            <Input value={form.contact.pincode} onChange={e => { updateContact('pincode', e.target.value); setFieldErrors(p => ({ ...p, 'contact.pincode': '' })); }} 
              placeholder="600001" className={hasError('contact.pincode') ? 'border-red-500' : ''} maxLength={6} />
          </FormField>
        </div>

        {/* Settings */}
        <Section icon={Settings} label="Settings" />
        <div className="rounded-xl border border-[#e2ece3] bg-[#fafdfb] px-4 py-3.5">
          <Toggle checked={form.isActive} onChange={(v) => update('isActive', v)}
            label="Active on site" description="Show this brand on the website" />
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" className="btn primary flex-1" disabled={saving}>
            {saving ? 'Saving…' : editBrand ? 'Save Changes' : 'Add Brand'}
          </button>
          <button type="button" className="btn flex-1" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}
