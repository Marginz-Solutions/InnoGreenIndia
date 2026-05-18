'use client';

import React, { useEffect, useState } from 'react';
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

import { toast } from "sonner";
import { api } from "@/lib/axiosInstance";
import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import { Pagination } from '@/components/website-customization/shared/Pagination';
import { StatusBadge } from '@/components/website-customization/shared/StatusBadge';
import { EmptyState } from '@/components/website-customization/shared/EmptyState';
import { ProductCard } from '@/components/website-customization/products/Productcard';
import { ProductModal } from '@/components/website-customization/products/Productmodal';
import { Product, ProductFilters } from '@/components/website-customization/types/common.types';
import { Brand, Category } from '@/lib/global.types';

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
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${active
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
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    query: '',
    category: 'all',
    status: 'all',
    featured: 'all',
  });
  const [
  debouncedQuery,
  setDebouncedQuery,
] = useState(
  filters.query
);
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

  
  const [totalPages, setTotalPages] = useState(1);

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.status !== 'all',
    filters.featured !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ query: '', category: 'all', status: 'all', featured: 'all' });
    setPage(1);
  };

  useEffect(() => {
  const timer =
    setTimeout(() => {
      setDebouncedQuery(
        filters.query
      );
    }, 400);

  return () =>
    clearTimeout(timer);
}, [filters.query]);

  // ── Handlers ──
  const openAdd = () => { setEditProduct(null); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setModalOpen(true); };

  const fetchProducts =
  async () => {
    try {
      setLoading(true);

      const res =
        await api.get(
          `/products?query=${debouncedQuery}&status=${filters.status}&featured=${filters.featured}&category=${filters.category}&page=${page}`
        );

      setItems(
        res.data ?? []
      );

      setTotalPages(
        res.data.pagination
          ?.totalPages ?? 1
      );
    } catch (err) {
      toast.error(
        "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchProducts();
}, [
  debouncedQuery,
  filters.category,
  filters.status,
  filters.featured,
  page,
]);

const handleExcelUpload =
  async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      await api.post(
        "/products/import",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Products imported"
      );

      await fetchProducts();
    } catch (err: any) {
      toast.error(
        err.message ||
          "Import failed"
      );
    }
  };

  const handleDelete = async (
  id: string
) => {
  try {
    await api.delete(
      `/products/${id}`
    );

    await fetchProducts();

toast.success(
  "Product deleted"
);
  } catch (err) {
    toast.error(
      typeof err === "string"
        ? err
        : "Something went wrong"
    );
  }
};

  const handleToggleFeatured =
  async (id: string) => {
    try {
      const product =
        items.find(
          (p) => p.id === id
        );

      if (!product) return;

      const result =
        await api.patch(
          `/products/${id}`,
          {
            featured:
              !product.featured,
          }
        );

        await fetchProducts();

      toast.success(
        "Featured updated"
      );
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : "Something went wrong"
      );
    }
  };

  const handleSave = async (
  product: Product,
  selectedFile:
    File | null
) => {
  try {
    const formData =
      new FormData();

    formData.append(
      "name",
      product.name
    );

    formData.append(
      "slug",
      product.slug
    );

    formData.append(
      "brand_id",
      product.brand_id || ""
    );

    formData.append(
      "category_id",
      product.category_id || ""
    );

    formData.append(
      "description",
      product.description
    );

    formData.append(
      "short_description",
      product.short_description
    );

    formData.append(
      "sku",
      product.sku
    );

    formData.append(
      "status",
      product.status
    );

    formData.append(
      "featured",
      String(
        product.featured
      )
    );

    formData.append(
      "is_active",
      String(
        product.is_active
      )
    );

    formData.append(
      "tags",
      JSON.stringify(
        product.tags ?? []
      )
    );

    formData.append(
      "quantity",
      String(
        product.quantity || 0
      )
    );

    formData.append(
      "quantity_unit",
      product.quantity_unit || ''
    );

    // image
    if (selectedFile) {
      formData.append(
        "image",
        selectedFile
      );
    }

    // CREATE
    if (!editProduct) {
      const result =
        await api.post(
          "/products",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      await fetchProducts();

      toast.success(
        "Product created"
      );
    }

    // UPDATE
    else {
      const result =
        await api.patch(
          `/products/${product.id}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      await fetchProducts();

      toast.success(
        "Product updated"
      );
    }

    setModalOpen(false);
    setEditProduct(null);
  } catch (err) {
    toast.error(
      typeof err === "string"
        ? err
        : "Something went wrong"
    );
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
      value: new Set(items.map((p) => p.category_id)).size,
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
        <div className='flex items-center gap-4'>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1f7a36] hover:bg-[#166534] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-[#1f7a36]/20"
        >
          <Plus size={16} />
          Add Product
        </button>

        <label className="px-4 py-2.5 border border-[#cfe0d2] bg-white hover:bg-[#f6fbf7] text-sm font-semibold rounded-xl cursor-pointer">
  Upload Excel

  <input
    type="file"
    accept=".xlsx,.xls"
    className="hidden"
    onChange={handleExcelUpload}  
  />
</label>
</div>
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
            {items.length} product{items.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      
      {/* ── Product Grid / Empty ── */}
      {items.length === 0 ?
       (
        <EmptyState
          icon={Package}
          title="No products found"
          desc={
            filters.query || activeFiltersCount > 0
              ? 'Try adjusting your search or filters'
              : 'Add your first product to display on the website'
          }
          onAdd={activeFiltersCount > 0 || filters.query ? () => { } : openAdd}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              brandName={getBrandName(p.brand_id)}
              categoryName={getCategoryName(p.category_id)}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      ) : (
        /* ── List view ── */
        <div className="flex flex-col gap-2">
          {items.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#e2ece3] rounded-2xl px-4 py-3.5 flex items-center gap-4 hover:shadow-md transition-all duration-150"
            >
              {/* Thumb */}
              <div className="w-12 h-12 rounded-xl bg-[#f0f8f1] border border-[#e2ece3] flex items-center justify-center shrink-0">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover rounded-xl" />
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
                <p className="text-xs text-[#61756a] truncate mt-0.5">{p.short_description}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {(p.tags ?? []).slice(0, 3).map((t) => (
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
                  <span className="text-[11px] text-[#9bb4a1]">{getCategoryName(p.category_id)}</span>
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
      {totalPages > 1 && (
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