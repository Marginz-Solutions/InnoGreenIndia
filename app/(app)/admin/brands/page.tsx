'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Briefcase, Plus, Search, Edit2, Trash2, Globe, SlidersHorizontal, CheckCircle, XCircle, X, Loader2 } from 'lucide-react';

import type { Brand, Category } from '@/components/website-customization/types/common.types';
import { StatusBadge } from '@/components/website-customization/shared/StatusBadge';
import { Toggle } from '@/components/website-customization/shared/Toggle';
import { EmptyState } from '@/components/website-customization/shared/EmptyState';
import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import KpiCard from '@/components/website-customization/shared/KpiCard';
import FilterPill from '@/components/website-customization/shared/FilterPill';
import { BrandModal } from '@/components/website-customization/brands/BrandModal';
import { api } from '@/lib/axiosInstance';
import ErrorBanner from '@/components/ErrorBanner';

type BrandFilters = { query: string; category: string; status: 'all' | 'active' | 'inactive' };

const LIMIT = 12;

export default function BrandsPage() {
  const [items, setItems] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<{ brandsTotal: number; brandsActive: number; brandsInactive: number } | null>(null);

  const [filters, setFilters] = useState<BrandFilters>({ query: '', category: 'all', status: 'all' });
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Brand | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(filters.query.trim()), 350);
    return () => clearTimeout(t);
  }, [filters.query]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories') as { data: Category[] };
      setCategories(res.data ?? []);
    } catch { setCategories([]); }
  }, []);

  const fetchBrands = useCallback(async (reset: boolean, currentPage: number) => {
    setLoading(true);
    if (reset) setError(null);
    try {
      const params: Record<string, string | number> = {
        page: currentPage, limit: LIMIT, search: debouncedQuery,
      };
      if (filters.category !== 'all') params.categoryId = filters.category;
      if (filters.status !== 'all') params.status = filters.status;

      const res = await api.get('/brands', { params }) as {
        data: Brand[];
        pagination: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean };
        stats: { brandsTotal: number; brandsActive: number; brandsInactive: number };
      };
      setItems(prev => reset ? (res.data ?? []) : [...prev, ...(res.data ?? [])]);
      setTotal(res.pagination?.total ?? 0);
      setHasNextPage(res.pagination?.hasNextPage ?? false);
      setStats(res.stats ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load brands');
      if (reset) setItems([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filters.category, filters.status]);

  // Reset + fetch when filters change
  useEffect(() => {
    setPage(1);
    void fetchBrands(true, 1);
  }, [fetchBrands]);

  // Fetch next page when page increments (not on reset)
  useEffect(() => {
    if (page === 1) return;
    void fetchBrands(false, page);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !loading) {
        setPage(p => p + 1);
      }
    }, { rootMargin: '200px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, loading]);

  useEffect(() => { void fetchCategories(); }, [fetchCategories]);

  const setFilter = <K extends keyof BrandFilters>(key: K, value: BrandFilters[K]) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters({ query: '', category: 'all', status: 'all' });

  const activeFiltersCount = useMemo(() => {
    let n = 0;
    if (filters.query.trim()) n++;
    if (filters.category !== 'all') n++;
    if (filters.status !== 'all') n++;
    return n;
  }, [filters]);

  const openAdd = () => { setEditItem(null); setSaveError(null); setModalOpen(true); };
  const openEdit = (b: Brand) => { setEditItem(b); setSaveError(null); setModalOpen(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Caution: Delete this brand?, If you delete this brand, you lost all the things related to this brand!')) return;
    setError(null);
    try {
      await api.delete(`/brands/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
      setTotal(t => t - 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete');
    }
  };

  const toggleStatus = async (b: Brand) => {
    setError(null);
    try {
      const fd = new FormData();
      fd.append('name', b.name);
      fd.append('description', b.description ?? '');
      fd.append('websiteUrl', b.websiteUrl ?? '');
      fd.append('tags', JSON.stringify(b.tags));
      fd.append('categoryIds', JSON.stringify(b.categories.map(c => c.id)));
      fd.append('contact', JSON.stringify({
        name: b.contact?.name ?? '', email: b.contact?.email ?? '',
        phoneNo: b.contact?.phoneNo ?? '', whatsapp: b.contact?.whatsapp ?? '',
        addressLine1: b.contact?.addressLine1 ?? '', addressLine2: b.contact?.addressLine2 ?? '',
        city: b.contact?.city ?? '', state: b.contact?.state ?? '', pincode: b.contact?.pincode ?? '',
      }));
      fd.append('isActive', String(!b.isActive));
      const res = await api.patch(`/brands/${b.id}`, fd) as { data: Brand };
      if (res.data) setItems(prev => prev.map(x => x.id === b.id ? res.data : x));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update status');
    }
  };

  const handleSave = async (fd: FormData) => {
    setSaving(true);
    setSaveError(null);
    try {
      if (editItem) {
        const res = await api.patch(`/brands/${editItem.id}`, fd) as { data: Brand };
        if (res.data) setItems(prev => prev.map(i => i.id === editItem.id ? res.data : i));
      } else {
        const res = await api.post('/brands', fd) as { data: Brand };
        if (res.data) setItems(prev => [res.data, ...prev]);
      }
      setModalOpen(false);
      setEditItem(null);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Could not save brand');
      throw e
    } finally {
      setSaving(false);
    }
  };

  const kpis = stats
    ? [
        { label: 'Total Brands', value: stats.brandsTotal, sub: 'in catalogue' },
        { label: 'Active', value: stats.brandsActive, sub: 'live on site' },
        { label: 'Inactive', value: stats.brandsInactive, sub: 'hidden from site' },
      ]
    : [
        { label: 'Total Brands', value: total, sub: 'loaded' },
        { label: 'Active', value: items.filter(b => b.isActive).length, sub: 'this page' },
        { label: 'Inactive', value: items.filter(b => !b.isActive).length, sub: 'this page' },
      ];

  return (
    <section>
      <Breadcrumb section="Brands" />
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#102018] mb-1">Brands</h1>
          <p className="muted text-sm">Manage brand partnerships and logos displayed on the website</p>
        </div>
        <button type="button" className="btn primary" onClick={openAdd}>
          <Plus size={16} /> Add Brand
        </button>
      </div>

      {error && <ErrorBanner error={error} className="mb-4" />}

      <div className="grid grid-cols-3 gap-3 mb-5">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 space-y-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb4a1] pointer-events-none" />
            <input value={filters.query} onChange={e => setFilter('query', e.target.value)}
              placeholder="Search by name…"
              className="w-full pl-10 pr-4 py-2.5 border border-[#cfe0d2] rounded-xl text-sm bg-[#fafdfb] focus:outline-none focus:border-[#1f7a36] focus:ring-2 focus:ring-[#1f7a36]/20 transition-all placeholder:text-[#b0bcb5]" />
            {filters.query && (
              <button type="button" onClick={() => setFilter('query', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9bb4a1] hover:text-[#61756a]">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={13} className="text-[#9bb4a1]" />
          <select value={filters.category} onChange={e => setFilter('category', e.target.value)}
            className="px-3 py-1.5 border border-[#d1dfd5] rounded-lg text-xs font-semibold bg-white text-[#61756a] focus:outline-none focus:border-[#1f7a36] transition-all">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex items-center gap-1.5 border-l border-[#e2ece3] pl-2">
            <FilterPill label="All" active={filters.status === 'all'} onClick={() => setFilter('status', 'all')} />
            <FilterPill label="Active" icon={CheckCircle} active={filters.status === 'active'} onClick={() => setFilter('status', 'active')} />
            <FilterPill label="Inactive" icon={XCircle} active={filters.status === 'inactive'} onClick={() => setFilter('status', 'inactive')} />
          </div>
          {activeFiltersCount > 0 && (
            <button type="button" onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto">
              <X size={11} /> Clear ({activeFiltersCount})
            </button>
          )}
          <span className="ml-auto text-xs text-[#9bb4a1] font-medium">
            {loading && items.length === 0 ? 'Loading…' : `${total} brand${total !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* List */}
      {!loading && items.length === 0 ? (
        <EmptyState icon={Briefcase} title="No brands yet"
          desc="Add your first brand partner to feature it on the website" onAdd={openAdd} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map(b => (
              <div key={b.id} className="card flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#edf8ee] border border-[#e2ece3] flex items-center justify-center shrink-0 overflow-hidden">
                    {b.logoUrl
                      ? <img src={b.logoUrl} alt="" className="w-full h-full object-contain p-1" />
                      : <Briefcase size={24} className="text-[#1f7a36]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[#102018] truncate">{b.name}</h3>
                      <StatusBadge active={b.isActive} />
                    </div>
                    {b.websiteUrl ? (
                      <a href={b.websiteUrl.startsWith('http') ? b.websiteUrl : `https://${b.websiteUrl}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#1f7a36] flex items-center gap-1 hover:underline truncate">
                        <Globe size={11} /> {b.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-xs text-[#9bb4a1]">No website</span>
                    )}
                  </div>
                </div>
                {b.description && <p className="text-sm text-[#61756a] leading-relaxed">{b.description}</p>}
                {b.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {b.categories.map(c => (
                      <span key={c.id} className="px-2 py-0.5 bg-[#edf8ee] text-[#1f7a36] text-xs font-semibold rounded-lg border border-[#c8e6cc]">
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-[#e2ece3]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#61756a]">Active:</span>
                    <Toggle checked={b.isActive} onChange={() => void toggleStatus(b)} />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(b)} className="btn" style={{ padding: '7px 10px' }}>
                      <Edit2 size={14} />
                    </button>
                    <button type="button" onClick={() => void handleDelete(b.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />

          {loading && items.length > 0 && (
            <div className="flex justify-center py-6">
              <Loader2 size={20} className="animate-spin text-[#1f7a36]" />
            </div>
          )}
          {!hasNextPage && items.length > 0 && !loading && (
            <p className="text-center text-xs text-[#9bb4a1] py-6">All brands loaded</p>
          )}
        </>
      )}

      <BrandModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editBrand={editItem}
        categories={categories}
        saving={saving}
        error={saveError}
      />
    </section>
  );
}
