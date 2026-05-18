'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Modal } from '@/components/website-customization/shared/Modal';
import { FormField } from '@/components/website-customization/form/FormField';
import { Input } from '@/components/website-customization/form/Input';
import { api } from '@/lib/axiosInstance';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showTrigger?: boolean;
}

export function NewCategoryModal({ open, onOpenChange, showTrigger = true }: Props) {
  const router = useRouter();
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const openModal = () => {
    setNewName('');
    onOpenChange(true);
  };

  const closeModal = () => {
    onOpenChange(false);
    setNewName('');
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name || saving) return;
    setSaving(true);
    try {
      await api.post('/categories', { name });
      toast.success('Category created successfully');
      closeModal();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {showTrigger && (
        <button type="button" className="btn primary" onClick={openModal}>
          <Plus size={16} /> New
        </button>
      )}
      <Modal open={open} onClose={closeModal} title="New category">
        <form onSubmit={createCategory} className="space-y-4">
          <FormField label="Name">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Fertilizers"
              required
              autoFocus
            />
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn primary flex-1" disabled={saving}>
              {saving ? 'Creating…' : 'Create'}
            </button>
            <button type="button" className="btn flex-1" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
