"use client";

import { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, SlidersHorizontal, X, LayoutGrid, LayoutList,
  ChevronLeft, ChevronRight, RefreshCw,
} from "lucide-react";
import type { Dealer } from "./types";

// ── Types ──────────────────────────────────────────────────────────────────────

type ViewMode = "table" | "grid";

type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type Filters = {
  query: string;
  category: string;
  district: string;
  volume: "all" | "true" | "false";
};

interface Category {
  id: number | string;
  name: string;
}

const emptyFilters: Filters = {
  query: "",
  category: "all",
  district: "all",
  volume: "all",
};

// ── Icons ──────────────────────────────────────────────────────────────────────

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

// ── Primitives ─────────────────────────────────────────────────────────────────

function Initials({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const letters = name?.split(" ").slice(0, 2).map((w) => w[0]).join("");
  return (
    <div className={`shrink-0 rounded-full bg-[#EAF3DE] flex items-center justify-center font-semibold text-[#2d5a27]
      ${size === "sm" ? "h-7 w-7 text-[11px]" : "h-10 w-10 text-sm"}`}>
      {letters}
    </div>
  );
}

function CategoryTag({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1
      text-[11px] font-medium text-gray-600 border border-gray-200 whitespace-nowrap">
      🌿 {value}
    </span>
  );
}

function DeleteBtn({ onClick, loading }: { onClick: (e: React.MouseEvent) => void; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="shrink-0 rounded-full border border-red-100 bg-red-50 p-1.5 text-red-400
        hover:bg-red-100 hover:text-red-600 transition disabled:opacity-50"
      aria-label="Delete dealer">
      {loading
        ? <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-500" />
        : <IconTrash />}
    </button>
  );
}

function DrawerField({ label, value, mono = false, muted = false, phone = false }: {
  label: string; value: string; mono?: boolean; muted?: boolean; phone?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">{label}</p>
      <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 flex items-center justify-between">
        <p className={`text-sm break-all ${mono ? "font-mono" : ""} ${muted ? "italic text-gray-300" : "text-gray-800"}`}>
          {value}
        </p>
        {phone && (
          <a href={`tel:${value}`}
            className="ml-2 shrink-0 rounded-full bg-[#EAF3DE] px-2.5 py-1 text-[11px]
              font-medium text-[#3B6D11] hover:bg-[#d4ebbc] transition">
            Call
          </a>
        )}
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${active
        ? "bg-[#edf8ee] text-[#1f7a36] border-[#b6debb]"
        : "bg-white text-[#61756a] border-[#d1dfd5] hover:border-[#9bb4a1]"
        }`}>
      {label}
    </button>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPageChange }: {
  page: number; totalPages: number; onPageChange: (p: number) => void;
}) {
  if (totalPages < 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  const btnCls = (active: boolean, disabled?: boolean) =>
    [
      "h-8 w-8 rounded-lg text-xs font-semibold transition-colors border flex items-center justify-center shrink-0",
      disabled
        ? "opacity-40 cursor-not-allowed border-gray-100 bg-white text-gray-400"
        : active
          ? "bg-[#2d5a27] text-white border-[#2d5a27]"
          : "bg-white text-gray-600 border-gray-200 hover:border-[#2d5a27] hover:text-[#2d5a27] cursor-pointer",
    ].join(" ");

  return (
    <div className="flex items-center gap-1.5">
      <button className={btnCls(false, page === 1)} disabled={page === 1}
        onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={13} />
      </button>
      {totalPages > 1 && pages.map((p) => (
        <button key={p} className={btnCls(p === page)} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      <button className={btnCls(false, page === totalPages)} disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}>
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

// ── Skeletons ──────────────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 last:border-none">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full animate-pulse bg-black/[0.06] shrink-0" />
          <div className="h-3 w-32 animate-pulse rounded bg-black/[0.06]" />
        </div>
      </td>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 w-20 animate-pulse rounded bg-black/[0.06]" />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="h-7 w-7 animate-pulse rounded-full bg-black/[0.06]" />
      </td>
    </tr>
  );
}

function GridCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full animate-pulse bg-black/[0.06] shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 animate-pulse rounded bg-black/[0.06]" />
            <div className="h-2.5 w-24 animate-pulse rounded bg-black/[0.06]" />
          </div>
        </div>
        <div className="h-7 w-7 animate-pulse rounded-full bg-black/[0.06] shrink-0" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-3 w-36 animate-pulse rounded bg-black/[0.06]" />
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="h-5 w-24 animate-pulse rounded-full bg-black/[0.06]" />
        <div className="h-3 w-20 animate-pulse rounded bg-black/[0.06]" />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ReviewedDealersClient({
  dealers: initialDealers,
  initialMeta,
  setFetchedDealers,
}: {
  dealers: Dealer[];
  initialMeta: Meta;
  setFetchedDealers: React.Dispatch<React.SetStateAction<Dealer[]>>;
}) {
  const router = useRouter();

  const [dealers, setDealers] = useState<Dealer[]>(initialDealers);
  const [meta, setMeta] = useState<Meta>(initialMeta);
  const [selected, setSelected] = useState<Dealer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Dealer | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [view, setView] = useState<ViewMode>("table");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // ── Category state ─────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const districtTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const activeFiltersCount = [
    filters.query,
    filters.category !== "all" ? filters.category : "",
    filters.district !== "all" ? filters.district : "",
    filters.volume !== "all" ? filters.volume : "",
  ].filter(Boolean).length;

  // ── Fetch categories on mount ──────────────────────────────────────────────
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/v1/categories");
        const json = await res.json();
        // Support both { data: Category[] } and Category[] response shapes
        const list: Category[] = Array.isArray(json) ? json : (json.data ?? []);
        setCategories(list.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  // ── Fetch dealers ──────────────────────────────────────────────────────────

  const fetchData = useCallback(async (
    currentFilters: Filters,
    currentPage: number,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "10");

      if (currentFilters.query) params.set("search", currentFilters.query);
      if (currentFilters.district !== "all") params.set("district", currentFilters.district);
      if (currentFilters.category !== "all") params.set("categoryId", currentFilters.category);
      if (currentFilters.volume !== "all") params.set("volume", currentFilters.volume);

      const res = await fetch(`/api/v1/dealers/reviewed?${params.toString()}`);
      const json = await res.json();
      setDealers(json.data);
      setFetchedDealers(json.data);
      setMeta(json.meta);
    } finally {
      setLoading(false);
    }
  }, [setFetchedDealers]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    setPage(1);

    if (key === "query") {
      clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => fetchData(next, 1), 400);
    } else if (key === "district") {
      clearTimeout(districtTimer.current);
      districtTimer.current = setTimeout(() => fetchData(next, 1), 400);
    } else {
      fetchData(next, 1);
    }
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setPage(1);
    fetchData(emptyFilters, 1);
  };

  const handlePage = (p: number) => {
    setPage(p);
    fetchData(filters, p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDelete = (dealer: Dealer) => {
    setSelected(null);
    setDeleteTarget(dealer);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);

    const res = await fetch("/api/v1/dealers/reviewed", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      console.error("Delete failed:", error);
      setDeletingId(null);
      return;
    }

    setDealers((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setFetchedDealers((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setMeta((prev) => ({ ...prev, total: prev.total - 1 }));
    setDeletingId(null);
    setDeleteTarget(null);
    startTransition(() => router.refresh());
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen p-6 font-sans overflow-y-scroll">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Reviewed Dealers</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {meta.total} dealer{meta.total !== 1 ? "s" : ""} on record
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-medium text-[#185FA5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#185FA5]" />
            {meta.total} Reviewed
          </span>
          <button
            onClick={() => fetchData(filters, page)}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-[#2d5a27] hover:border-[#b6debb] transition cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Filter card ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 space-y-3 mb-4">

        {/* Search + view toggle */}
        <div className="flex items-center gap-3 flex-col sm:flex-row">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb4a1] pointer-events-none" />
            <input
              value={filters.query}
              onChange={(e) => setFilter("query", e.target.value)}
              placeholder="Search by firm, district, category or GST…"
              className="w-full pl-10 pr-4 py-2.5 border border-[#cfe0d2] rounded-xl text-sm
                bg-[#fafdfb] focus:outline-none focus:border-[#2d5a27] focus:ring-2
                focus:ring-[#2d5a27]/20 transition-all placeholder:text-[#b0bcb5]"
            />
            {filters.query && (
              <button onClick={() => setFilter("query", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9bb4a1] hover:text-[#61756a]">
                <X size={14} />
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex border border-[#cfe0d2] rounded-xl overflow-hidden shrink-0">
            <button onClick={() => setView("table")}
              className={`px-3 py-2.5 transition-colors cursor-pointer ${view === "table" ? "bg-[#edf8ee] text-[#1f7a36]" : "text-[#9bb4a1] hover:text-[#61756a]"
                }`}>
              <LayoutList size={15} />
            </button>
            <button onClick={() => setView("grid")}
              className={`px-3 py-2.5 border-l border-[#cfe0d2] transition-colors cursor-pointer ${view === "grid" ? "bg-[#edf8ee] text-[#1f7a36]" : "text-[#9bb4a1] hover:text-[#61756a]"
                }`}>
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={13} className="text-[#9bb4a1]" />

          {/* ── Category filter — fetched from API ── */}
          <select
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
            disabled={categoriesLoading}
            className={`px-3 py-1.5 border border-[#d1dfd5] rounded-lg text-xs font-semibold
              bg-white text-[#61756a] focus:outline-none focus:border-[#2d5a27] transition-all cursor-pointer
              ${categoriesLoading ? "opacity-60 cursor-wait" : ""}`}
          >
            <option value="all">
              {categoriesLoading ? "Loading…" : "All Categories"}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>

          {/* District — typeable */}
          <input
            value={filters.district === "all" ? "" : filters.district}
            onChange={(e) => setFilter("district", e.target.value || "all")}
            placeholder="District…"
            className="px-3 py-1.5 border border-[#d1dfd5] rounded-lg text-xs font-semibold
              bg-white text-[#61756a] focus:outline-none focus:border-[#2d5a27] transition-all w-28
              placeholder:text-[#b0bcb5] placeholder:font-normal"
          />

          {/* Volume pills */}
          <div className="flex items-center gap-1.5 border-l border-[#e2ece3] pl-2">
            <FilterPill label="All" active={filters.volume === "all"} onClick={() => setFilter("volume", "all")} />
            <FilterPill label="Vol. Provided" active={filters.volume === "true"} onClick={() => setFilter("volume", "true")} />
            <FilterPill label="No Volume" active={filters.volume === "false"} onClick={() => setFilter("volume", "false")} />
          </div>

          {/* Clear */}
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-400
                hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto cursor-pointer">
              <X size={11} /> Clear ({activeFiltersCount})
            </button>
          )}

          {/* Results count */}
          <span className="ml-auto text-xs text-[#9bb4a1] font-medium">
            {meta.total} dealer{meta.total !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Loading — table skeleton ──────────────────────────────────────────── */}
      {loading && view === "table" && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  {["Firm Name", "GST Number", "Mobile No", "District", "Category", "Vol / mo", "Reviewed At", ""].map((h) => (
                    <th key={h} className="px-4 py-3">
                      <div className="h-2.5 w-16 animate-pulse rounded bg-black/[0.06]" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Loading — grid skeleton ───────────────────────────────────────────── */}
      {loading && view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <GridCardSkeleton key={i} />)}
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────────────── */}
      {!loading && dealers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <div className="mb-3 text-4xl">🔎</div>
          <p className="text-sm font-medium text-gray-700">
            {meta.total === 0 ? "No reviewed dealers yet" : "No results found"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {meta.total === 0 ? "Dealers will appear here after review." : "Try adjusting your filters."}
          </p>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#2d5a27] px-4 py-2 text-xs font-medium text-white hover:bg-[#234820] transition cursor-pointer border-none">
              <X size={11} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Grid view ────────────────────────────────────────────────────────── */}
      {!loading && view === "grid" && dealers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dealers.map((dealer) => (
            <div key={dealer.id} onClick={() => setSelected(dealer)}
              className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
                transition hover:shadow-md hover:border-gray-300 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <Initials name={dealer.firmName} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{dealer.firmName}</p>
                      <p className="text-[11px] font-mono text-gray-400 mt-0.5">{dealer.gstNumber}</p>
                    </div>
                  </div>
                  <DeleteBtn
                    loading={deletingId === dealer.id}
                    onClick={(e) => { e.stopPropagation(); openDelete(dealer); }}
                  />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-gray-400">📍</span>{dealer.district}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📞</span>
                    <a href={`tel:${dealer.mobileNo}`} onClick={(e) => e.stopPropagation()}
                      className="text-[#2d5a27] font-medium hover:underline">{dealer.mobileNo}</a>
                  </div>
                  {dealer.monthlyVolume && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-gray-400">📦</span>{dealer.monthlyVolume} / mo
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <CategoryTag value={dealer.categories?.name ?? "—"} />
                <p className="text-[10px] text-gray-400">{dealer.reviewedAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Table view ───────────────────────────────────────────────────────── */}
      {!loading && view === "table" && dealers.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  {["Firm Name", "GST Number", "Mobile No", "District", "Category", "Vol / mo", "Reviewed At", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dealers.map((dealer, i) => (
                  <tr key={dealer.id} onClick={() => setSelected(dealer)}
                    className={`cursor-pointer transition hover:bg-[#f9faf7] ${i < dealers.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Initials name={dealer.firmName} size="sm" />
                        <span className="font-medium text-gray-900 whitespace-nowrap">{dealer.firmName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{dealer.gstNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={`tel:${dealer.mobileNo}`} onClick={(e) => e.stopPropagation()}
                        className="text-[#2d5a27] text-xs font-medium hover:underline">{dealer.mobileNo}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{dealer.district}</td>
                    <td className="px-4 py-3"><CategoryTag value={dealer.categories?.name ?? "—"} /></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {dealer.monthlyVolume ?? <span className="italic text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{dealer.reviewedAt}</td>
                    <td className="px-4 py-3">
                      <DeleteBtn
                        loading={deletingId === dealer.id}
                        onClick={(e) => { e.stopPropagation(); openDelete(dealer); }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────────────────────── */}
      {!loading && meta && (
        <div className="flex items-center justify-between flex-wrap gap-3 pt-4">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {Math.min((meta.page - 1) * meta.limit + 1, meta.total)}–{Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of <span className="font-semibold text-gray-700">{meta.total}</span> dealers
          </p>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={handlePage} />
        </div>
      )}

      {/* ── Detail Drawer ────────────────────────────────────────────────────── */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-white shadow-2xl max-h-[90vh]
            md:inset-x-auto md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[30rem]
            md:max-h-full md:rounded-none md:rounded-l-3xl">

            <div className="flex-1 overflow-y-auto px-5 pt-5 md:px-6 md:pt-6">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 md:hidden" />
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-gray-900">{selected.firmName}</h2>
                <button onClick={() => setSelected(null)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">✕</button>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F1FB] px-3 py-1
                text-xs font-medium text-[#185FA5] mb-5">
                ✓ Reviewed dealer
              </span>
              <div className="flex flex-col gap-4">
                <DrawerField label="Firm Name" value={selected.firmName} />
                <DrawerField label="GST Number" value={selected.gstNumber} mono />
                <DrawerField label="Mobile No" value={selected.mobileNo} mono phone />
                <DrawerField label="District" value={selected.district} />
                <DrawerField label="Category Interest" value={selected.categories?.name ?? "—"} />
                <DrawerField label="Monthly Volume" value={selected.monthlyVolume ?? "Not provided"} muted={!selected.monthlyVolume} />
                <DrawerField label="Reviewed At" value={selected.reviewedAt ?? "—"} />
              </div>
            </div>

            <div className="shrink-0 border-t border-gray-100 px-5 py-4 md:px-6 md:py-6">
              <button onClick={() => openDelete(selected)}
                className="w-full rounded-full border border-red-200 bg-red-50 py-2.5 text-sm
                  font-medium text-red-500 hover:bg-red-100 hover:text-red-700 transition cursor-pointer">
                🗑 Delete Dealer
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mx-auto">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </div>
            <h3 className="text-center text-base font-semibold text-gray-900 mb-1">Delete Dealer?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              <span className="font-medium text-gray-700">{deleteTarget.firmName}</span> will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={!!deletingId}
                className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-medium
                  text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={!!deletingId}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-medium text-white
                  hover:bg-red-600 transition disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer border-none">
                {deletingId ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Deleting…
                  </>
                ) : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}