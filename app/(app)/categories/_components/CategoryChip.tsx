'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Category } from '@/lib/global.types';
import { api } from '@/lib/axiosInstance';

interface Props {
  category: Category;
}

export function CategoryChip({ category }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(category.name);
  const [saving, setSaving] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditing(false);
        setEditDraft(category.name);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editing, category.name]);

  const startEdit = () => {
    setEditDraft(category.name);
    setEditing(true);
  };

  const saveEdit = async () => {
    const name = editDraft.trim();
    if (!name || saving) return;
    setSaving(true);
    try {
      await api.patch(`/categories/${category.id}`, { name });
      toast.success('Category updated successfully');
      setEditing(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update category');
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async () => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${category.id}`);
      toast.success('Category deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete');
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl bg-[#edf8ee] p-2 pl-4 text-sm text-[#102018] shadow-sm ${editing ? 'ring-3 ring-[#1f7a36]/25' : 'border border-[#cfe0d2]'} cursor-pointer transition-colors`}
      onDoubleClick={(e) => {
        if ((e.target as HTMLElement).closest('button, input')) return;
        if (!editing) startEdit();
      }}
    >
      {editing ? (
        <>
          <input
            ref={editInputRef}
            className="min-w-[8rem] max-w-[14rem] px-2 py-1 rounded-lg text-[#102018] text-sm focus:outline-none"
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void saveEdit();
              }
            }}
          />
          <button
            type="button"
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#1f7a36] text-white hover:bg-[#18592a] transition-colors disabled:opacity-50"
            aria-label="Save category name"
            disabled={saving}
            onClick={() => void saveEdit()}
          >
            <Check size={16} />
          </button>
        </>
      ) : (
        <>
          <span className="font-medium max-w-[14rem] truncate select-none">{category.name}</span>
          <button
            type="button"
            className="shrink-0 w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-400/20 rounded-lg transition-colors"
            aria-label="Delete category"
            onClick={(e) => {
              e.stopPropagation();
              void removeCategory();
            }}
          >
            <Trash2 size={15} />
          </button>
        </>
      )}
    </div>
  );
}