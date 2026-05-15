'use client';

import React, { useMemo, useState } from 'react';
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  CheckCircle,
  XCircle,
  LayoutGrid,
  LayoutList,
  X,
} from 'lucide-react';

import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import { Pagination } from '@/components/website-customization/shared/Pagination';
import { StatusBadge } from '@/components/website-customization/shared/StatusBadge';
import { EmptyState } from '@/components/website-customization/shared/EmptyState';
import { ProductCard } from '@/components/website-customization/products/Productcard';
import { ProductModal } from '@/components/website-customization/products/Productmodal';
import { Brand, Category, Product, ProductFilters } from '@/components/website-customization/types/common.types';

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 6;

// ─── Filter Pill ───────────────────────────────────────────────────────────────
const FilterPill = ({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ElementType;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
      active
        ? 'bg-[#1f7a36] text-white border-[#1f7a36] shadow-sm'
        : 'bg-white text-[#61756a] border-[#d1dfd5] hover:border-[#1f7a36] hover:text-[#1f7a36]'
    }`}
  >
    {Icon && <Icon size={11} />}
    {label}
  </button>
);

// ─── KPI Card ──────────────────────────────────────────────────────────────────
const KpiCard = ({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color?: string;
}) => (
  <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 flex flex-col gap-1">
    <span className="text-xs font-semibold text-[#61756a] uppercase tracking-wide">{label}</span>
    <span className={`text-3xl font-extrabold ${color ?? 'text-[#102018]'}`}>{value}</span>
    {sub && <span className="text-xs text-[#9bb4a1]">{sub}</span>}
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsClient({
  initialProducts,
  brands,
  categories,
}: {
  initialProducts: Product[];
  brands: Brand[];
  categories: Category[];
}) {
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<ProductFilters>({
    query: '',
    category: 'all',
    status: 'all',
    featured: 'all',
  });
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const setFilter = <K extends keyof ProductFilters>(key: K, val: ProductFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const getBrandName = (id?: string | null) =>
  brands.find((b) => b.id === id)?.name ?? "—";

  const getCategoryName = (id?: string | null) =>
  categories.find((c) => c.id === id)?.name ?? "—";

  // ── Filtered items ──
  const filtered = useMemo(() => {
    return items.filter((p) => {
      const q = filters.query.toLowerCase();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));

      const matchCat =
        filters.category === 'all' || p.categoryId === filters.category;

      const matchStatus =
        filters.status === 'all' || p.status === filters.status;

      const matchFeatured =
        filters.featured === 'all' ||
        (filters.featured === 'yes' ? p.featured : !p.featured);

      return matchQuery && matchCat && matchStatus && matchFeatured;
    });
  }, [items, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.status !== 'all',
    filters.featured !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ query: '', category: 'all', status: 'all', featured: 'all' });
    setPage(1);
  };

  // ── Handlers ──
  const openAdd = () => { setEditProduct(null); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setModalOpen(true); };

  const handleDelete = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const handleToggleFeatured = async (
  id: string
) => {
  try {
    const product = items.find(
      (p) => p.id === id
    );

    if (!product) return;

    const updatedFeatured =
      !product.featured;

    const res = await fetch(
      `/api/v1/products/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          ...product,
          featured: updatedFeatured,
        }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      console.error(result.error);
      return;
    }

    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? result.data
          : p
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  const handleSave = async (product: Product) => {
  try {
    // ── CREATE ─────────────────────────────
    if (!editProduct) {
      const res = await fetch("/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result.error);
        return;
      }

      setItems((prev) => [result.data, ...prev]);
    }

    // ── UPDATE ─────────────────────────────
    else {
      const res = await fetch(
        `/api/v1/products/${product.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        console.error(result.error);
        return;
      }

      setItems((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? result.data
            : p
        )
      );
    }

    setModalOpen(false);
    setEditProduct(null);
  } catch (err) {
    console.error(err);
  }
};

  // ── KPIs ──
  const kpis = [
    { label: 'Total Products', value: items.length, sub: 'in catalogue' },
    {
      label: 'Active',
      value: items.filter((p) => p.status === 'active').length,
      sub: 'live on site',
      color: 'text-[#1f7a36]',
    },
    {
      label: 'Featured',
      value: items.filter((p) => p.featured).length,
      sub: 'highlighted',
      color: 'text-amber-500',
    },
    {
      label: 'Categories',
      value: new Set(items.map((p) => p.categoryId)).size,
      sub: 'product types',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <Breadcrumb section="Products" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#102018] leading-tight">Products</h1>
          <p className="text-sm text-[#61756a] mt-0.5">
            Manage your product catalogue and website listings
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1f7a36] hover:bg-[#166534] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-[#1f7a36]/20"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 space-y-3">

        {/* Search row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb4a1] pointer-events-none"
            />
            <input
              value={filters.query}
              onChange={(e) => setFilter('query', e.target.value)}
              placeholder="Search by name, SKU, tags…"
              className="w-full pl-10 pr-4 py-2.5 border border-[#cfe0d2] rounded-xl text-sm bg-[#fafdfb] focus:outline-none focus:border-[#1f7a36] focus:ring-2 focus:ring-[#1f7a36]/20 transition-all placeholder:text-[#b0bcb5]"
            />
            {filters.query && (
              <button
                onClick={() => setFilter('query', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9bb4a1] hover:text-[#61756a]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="hidden sm:flex border border-[#cfe0d2] rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#edf8ee] text-[#1f7a36]' : 'text-[#9bb4a1] hover:text-[#61756a]'}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2.5 border-l border-[#cfe0d2] transition-colors ${viewMode === 'list' ? 'bg-[#edf8ee] text-[#1f7a36]' : 'text-[#9bb4a1] hover:text-[#61756a]'}`}
            >
              <LayoutList size={15} />
            </button>
          </div>
        </div>

        {/* Filter pills row */}
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={13} className="text-[#9bb4a1]" />

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
            className="px-3 py-1.5 border border-[#d1dfd5] rounded-lg text-xs font-semibold bg-white text-[#61756a] focus:outline-none focus:border-[#1f7a36] transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status pills */}
          <div className="flex items-center gap-1.5 border-l border-[#e2ece3] pl-2">
            <FilterPill
              label="All Status"
              active={filters.status === 'all'}
              onClick={() => setFilter('status', 'all')}
            />
            <FilterPill
              label="Active"
              icon={CheckCircle}
              active={filters.status === 'active'}
              onClick={() => setFilter('status', 'active')}
            />
            <FilterPill
              label="Inactive"
              icon={XCircle}
              active={filters.status === 'inactive'}
              onClick={() => setFilter('status', 'inactive')}
            />
          </div>

          {/* Featured pill */}
          <div className="flex items-center gap-1.5 border-l border-[#e2ece3] pl-2">
            <FilterPill
              label="Featured"
              icon={Star}
              active={filters.featured === 'yes'}
              onClick={() =>
                setFilter('featured', filters.featured === 'yes' ? 'all' : 'yes')
              }
            />
          </div>

          {/* Clear */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
            >
              <X size={11} />
              Clear ({activeFiltersCount})
            </button>
          )}

          {/* Results count */}
          <span className="ml-auto text-xs text-[#9bb4a1] font-medium">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Product Grid / Empty ── */}
      {paginated.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          desc={
            filters.query || activeFiltersCount > 0
              ? 'Try adjusting your search or filters'
              : 'Add your first product to display on the website'
          }
          onAdd={activeFiltersCount > 0 || filters.query ? () => {} : openAdd}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              brandName={getBrandName(p.brandId)}
              categoryName={getCategoryName(p.categoryId)}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      ) : (
        /* ── List view ── */
        <div className="flex flex-col gap-2">
          {paginated.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#e2ece3] rounded-2xl px-4 py-3.5 flex items-center gap-4 hover:shadow-md transition-all duration-150"
            >
              {/* Thumb */}
              <div className="w-12 h-12 rounded-xl bg-[#f0f8f1] border border-[#e2ece3] flex items-center justify-center shrink-0">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Package size={20} className="text-[#b8d4bb]" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#102018] truncate">{p.name}</span>
                  <span className="font-mono text-[11px] bg-[#f4faf5] border border-[#e2ece3] px-1.5 py-0.5 rounded text-[#61756a]">
                    {p.sku}
                  </span>
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 text-[11px] font-semibold rounded-full">
                      <Star size={9} fill="currentColor" /> Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#61756a] truncate mt-0.5">{p.shortDescription}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-[#edf8ee] text-[#1f7a36] text-[10px] font-semibold rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden md:flex flex-col items-end gap-1">
                  <StatusBadge active={p.status === 'active'} />
                  <span className="text-[11px] text-[#9bb4a1]">{getCategoryName(p.categoryId)}</span>
                </div>
                <button
                  onClick={() => openEdit(p)}
                  className="px-3 py-1.5 rounded-xl border border-[#cfe0d2] bg-[#f4faf5] text-[#1f7a36] text-xs font-semibold hover:bg-[#edf8ee] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => { if (confirm(`Delete "${p.name}"?`)) handleDelete(p.id); }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {filtered.length > PAGE_SIZE && (
        <Pagination
          page={page}
          total={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      )}

      {/* ── Modal ── */}
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editProduct={editProduct}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}