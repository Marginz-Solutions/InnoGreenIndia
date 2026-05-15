'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Image, Info, Tag, Users, Settings, Phone, Mail } from 'lucide-react';

import { Modal } from '@/components/website-customization/shared/Modal';
import { FormField } from '@/components/website-customization/form/FormField';
import { Input } from '@/components/website-customization/form/Input';
import { Textarea } from '@/components/website-customization/form/TextArea';
import { Toggle } from '@/components/website-customization/shared/Toggle';
import { TagInput } from '@/components/website-customization/products/Taginput';
import ErrorBanner from '@/components/ErrorBanner';
import type { Brand, BrandContact, Category } from '@/components/website-customization/types/common.types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (fd: FormData) => Promise<void>;
  editBrand: Brand | null;
  categories: Category[];
  saving: boolean;
  error: string | null;
}

const Section = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex items-center gap-2 pt-1 pb-0.5">
    <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#edf8ee] text-[#1f7a36]">
      <Icon size={13} />
    </div>
    <span className="text-xs font-bold text-[#21432a] uppercase tracking-widest">{label}</span>
    <div className="flex-1 h-px bg-[#e2ece3]" />
  </div>
);

type ContactForm = Omit<BrandContact, 'id'>;

const emptyContact = (): ContactForm => ({
  name: '', email: '', phoneNo: '', whatsapp: '',
  addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
});

export function BrandModal({ open, onClose, onSave, editBrand, categories, saving, error }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [contact, setContact] = useState<ContactForm>(emptyContact());

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const logoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (editBrand) {
      setName(editBrand.name);
      setDescription(editBrand.description ?? '');
      setWebsiteUrl(editBrand.websiteUrl ?? '');
      setTags(editBrand.tags ?? []);
      setSelectedCategories(editBrand.categories.map(c => c.id));
      setIsActive(editBrand.isActive);
      setContact({
        name: editBrand.contact?.name ?? '',
        email: editBrand.contact?.email ?? '',
        phoneNo: editBrand.contact?.phoneNo ?? '',
        whatsapp: editBrand.contact?.whatsapp ?? '',
        addressLine1: editBrand.contact?.addressLine1 ?? '',
        addressLine2: editBrand.contact?.addressLine2 ?? '',
        city: editBrand.contact?.city ?? '',
        state: editBrand.contact?.state ?? '',
        pincode: editBrand.contact?.pincode ?? '',
      });
      setLogoPreview(editBrand.logoUrl ?? null);
      setImagePreview(editBrand.imageUrl ?? null);
    } else {
      setName(''); setDescription(''); setWebsiteUrl(''); setTags([]);
      setSelectedCategories([]); setIsActive(true); setContact(emptyContact());
      setLogoPreview(null); setImagePreview(null);
    }
    setLogoFile(null); setImageFile(null);
    if (logoRef.current) logoRef.current.value = '';
    if (imageRef.current) imageRef.current.value = '';
  }, [open, editBrand]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (s: string | null) => void,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const toggleCategory = (id: string) =>
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );

  const setC = (key: keyof ContactForm, val: string) =>
    setContact(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('description', description);
    fd.append('websiteUrl', websiteUrl);
    fd.append('tags', JSON.stringify(tags));
    fd.append('categoryIds', JSON.stringify(selectedCategories));
    fd.append('contact', JSON.stringify({
      name: contact.name, email: contact.email, phoneNo: contact.phoneNo,
      whatsapp: contact.whatsapp, addressLine1: contact.addressLine1,
      addressLine2: contact.addressLine2, city: contact.city,
      state: contact.state, pincode: contact.pincode,
    }));
    fd.append('isActive', String(isActive));
    if (logoFile) fd.append('logo', logoFile);
    if (imageFile) fd.append('image', imageFile);
    await onSave(fd);
  };

  return (
    <Modal open={open} onClose={onClose} title={editBrand ? 'Edit Brand' : 'Add Brand'}>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        {error && <ErrorBanner error={error} />}

        {/* Media */}
        <Section icon={Image} label="Media" />
        <div className="grid grid-cols-2 gap-3">
          <FormField label={`Logo${editBrand ? ' (optional)' : ' *'}`}>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#c5ddc8] rounded-xl bg-[#f7fcf8] cursor-pointer hover:border-[#1f7a36] hover:bg-[#edf8ee] transition-colors h-28 overflow-hidden">
              {logoPreview
                ? <img src={logoPreview} alt="logo" className="h-full w-full object-contain p-2" />
                : <span className="text-xs text-[#61756a] font-medium text-center px-2">Logo (PNG/JPG/WEBP/SVG)</span>
              }
              <input ref={logoRef} type="file" name="logo" accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="sr-only" onChange={e => handleFileChange(e, setLogoFile, setLogoPreview)} />
            </label>
          </FormField>
          <FormField label="Image (optional)">
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#c5ddc8] rounded-xl bg-[#f7fcf8] cursor-pointer hover:border-[#1f7a36] hover:bg-[#edf8ee] transition-colors h-28 overflow-hidden">
              {imagePreview
                ? <img src={imagePreview} alt="banner" className="h-full w-full object-contain p-2" />
                : <span className="text-xs text-[#61756a] font-medium text-center px-2">Banner / hero image</span>
              }
              <input ref={imageRef} type="file" name="image" accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="sr-only" onChange={e => handleFileChange(e, setImageFile, setImagePreview)} />
            </label>
          </FormField>
        </div>

        {/* Basic Info */}
        <Section icon={Info} label="Basic Info" />
        <FormField label="Brand Name *">
          <Input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. AgroShield" />
        </FormField>
        <FormField label="Website URL">
          <Input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} type="url" placeholder="https://yourbrand.com" />
        </FormField>
        <FormField label="Description">
          <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description about the brand…" />
        </FormField>

        {/* Tags */}
        <Section icon={Tag} label="Tags" />
        <FormField label="Tags">
          <TagInput value={tags} onChange={setTags} placeholder="Type tag & press Enter…" />
        </FormField>

        {/* Categories */}
        <Section icon={Info} label="Categories *" />
        <div className="flex flex-wrap gap-2">
          {categories.map(c => {
            const checked = selectedCategories.includes(c.id);
            return (
              <button key={c.id} type="button" onClick={() => toggleCategory(c.id)}
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
        <FormField label="Contact Name *">
          <Input value={contact.name} onChange={e => setC('name', e.target.value)} required placeholder="Rajesh Kumar" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone *">
            <div className="relative">
              <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756a]" />
              <Input value={contact.phoneNo} onChange={e => setC('phoneNo', e.target.value)}
                required placeholder="9876543210" className="pl-9" maxLength={10} />
            </div>
          </FormField>
          <FormField label="WhatsApp *">
            <Input value={contact.whatsapp} onChange={e => setC('whatsapp', e.target.value)}
              required placeholder="9876543210" maxLength={10} />
          </FormField>
        </div>
        <FormField label="Email">
          <div className="relative">
            <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756a]" />
            <Input value={contact.email ?? ''} onChange={e => setC('email', e.target.value)}
              type="email" placeholder="contact@brand.com" className="pl-9" />
          </div>
        </FormField>
        <FormField label="Address Line 1">
          <Input value={contact.addressLine1 ?? ''} onChange={e => setC('addressLine1', e.target.value)} placeholder="Street / locality" />
        </FormField>
        <FormField label="Address Line 2">
          <Input value={contact.addressLine2 ?? ''} onChange={e => setC('addressLine2', e.target.value)} placeholder="Area / landmark" />
        </FormField>
        <div className="grid grid-cols-3 gap-3">
          <FormField label="City">
            <Input value={contact.city ?? ''} onChange={e => setC('city', e.target.value)} placeholder="City" />
          </FormField>
          <FormField label="State">
            <Input value={contact.state ?? ''} onChange={e => setC('state', e.target.value)} placeholder="State" />
          </FormField>
          <FormField label="Pincode">
            <Input value={contact.pincode ?? ''} onChange={e => setC('pincode', e.target.value)} placeholder="600001" maxLength={6} />
          </FormField>
        </div>

        {/* Settings */}
        <Section icon={Settings} label="Settings" />
        <div className="rounded-xl border border-[#e2ece3] bg-[#fafdfb] px-4 py-3.5">
          <Toggle checked={isActive} onChange={setIsActive}
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
