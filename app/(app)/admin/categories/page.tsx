'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Plus, Tags, Trash2 } from 'lucide-react';

import type { Category } from '@/components/website-customization/types/common.types';
import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import { EmptyState } from '@/components/website-customization/shared/EmptyState';
import { Modal } from '@/components/website-customization/shared/Modal';
import { FormField } from '@/components/website-customization/form/FormField';
import { Input } from '@/components/website-customization/form/Input';
import ErrorBanner from '@/components/ErrorBanner';

import { api } from '@/lib/axiosInstance';
import { useCategory } from '@/lib/category-context';

export default function CategoriesPage() {
    const { categories, isLoading: loading, error: contextError, refreshCategories } = useCategory();
    const [mutationError, setMutationError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [savingNew, setSavingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState('');
    const [savingId, setSavingId] = useState<string | null>(null);
    const editInputRef = useRef<HTMLInputElement>(null);

    const error = mutationError || contextError;

    useEffect(() => {
        if(editingId && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingId]);

    useEffect(() => {
        if(!editingId) return;
        const onKey = (e: KeyboardEvent) => {
            if(e.key === 'Escape') {
                setEditingId(null);
                setEditDraft('');
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [editingId]);

    const openNewModal = () => {
        setNewName('');
        setModalOpen(true);
    };

    const createCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = newName.trim();
        if(!name || savingNew) return;
        setSavingNew(true);
        setMutationError(null);
        try {
            await api.post('/categories', { name });
            await refreshCategories();
            setModalOpen(false);
            setNewName('');
        } 
        catch(error) {
            setMutationError(error instanceof Error ? error.message : 'Could not create category');
        } 
        finally {
            setSavingNew(false);
        }
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditDraft(cat.name);
    };

    const saveEdit = async (id: string) => {
        const name = editDraft.trim();
        if(!name || savingId) return;
        setSavingId(id);
        setMutationError(null);
        try {
            await api.patch(`/categories/${id}`, { name });
            await refreshCategories();
            setEditingId(null);
            setEditDraft('');
        } 
        catch(error) {
            setMutationError(error instanceof Error ? error.message : 'Could not update category');
        } 
        finally {
            setSavingId(null);
        }
    };

    const removeCategory = async (id: string) => {
        if(!confirm('Delete this category?')) return;
        setMutationError(null);
        try {
            await api.delete(`/categories/${id}`);
            await refreshCategories();
            if(editingId === id) {
                setEditingId(null);
                setEditDraft('');
            }
        } 
        catch(error) {
            setMutationError(error instanceof Error ? error.message : 'Could not delete');
        }
    };

    return (
        <section>
            <Breadcrumb section="Categories" />
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#102018] mb-1">Categories</h1>
                    <p className="muted text-sm">Organize products with reusable category labels</p>
                </div>
                <button type="button" className="btn primary" onClick={openNewModal}>
                    <Plus size={16} /> New
                </button>
            </div>

            {error && ( <ErrorBanner error={error} className="mb-4" /> )}

            {loading ? (
                <p className="text-sm text-[#61756a]">Loading categories…</p>
            ) : categories.length === 0 ? (
                <EmptyState
                    icon={Tags}
                    title="No categories yet"
                    desc="Create a category to classify products on the site."
                    onAdd={openNewModal}
                />
            ) : (
                <div className="flex flex-wrap gap-3 md:gap-5">
                    {categories.map((cat: any) => {
                        const isEditing = editingId === cat.id;
                        return (
                            <div
                                key={cat.id}
                                className={`inline-flex items-center gap-2 rounded-xl bg-[#edf8ee] p-2 pl-4 text-sm text-[#102018] shadow-sm ${isEditing ? 'ring-3 ring-[#1f7a36]/25' : 'border border-[#cfe0d2]'} cursor-pointer transition-colors`}
                                onDoubleClick={(e) => {
                                    if ((e.target as HTMLElement).closest('button, input')) return;
                                    if (!isEditing) startEdit(cat);
                                }}
                            >
                                {isEditing ? (
                                    <>
                                        <input
                                            ref={isEditing ? editInputRef : undefined}
                                            className="min-w-[8rem] max-w-[14rem] px-2 py-1 rounded-lg text-[#102018] text-sm focus:outline-none"
                                            value={editDraft}
                                            onChange={(e) => setEditDraft(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    void saveEdit(cat.id);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#1f7a36] text-white hover:bg-[#18592a] transition-colors disabled:opacity-50"
                                            aria-label="Save category name"
                                            disabled={savingId === cat.id}
                                            onClick={() => void saveEdit(cat.id)}
                                        >
                                            <Check size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-medium max-w-[14rem] truncate select-none">{cat.name}</span>
                                        <button
                                            type="button"
                                            className="shrink-0 w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-400/20 rounded-lg transition-colors"
                                            aria-label="Delete category"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                void removeCategory(cat.id);
                                            }}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New category">
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
                        <button type="submit" className="btn primary flex-1" disabled={savingNew}>
                            {savingNew ? 'Creating…' : 'Create'}
                        </button>
                        <button type="button" className="btn flex-1" onClick={() => setModalOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}