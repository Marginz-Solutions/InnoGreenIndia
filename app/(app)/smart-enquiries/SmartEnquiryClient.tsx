"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search, LayoutGrid, List, SlidersHorizontal, X,
  ChevronLeft, ChevronRight, Phone, MapPin, Tag,
  Leaf, MessageCircleQuestion, Clock, RefreshCw,
  Grid,
} from "lucide-react";
import type { SmartEnquiryResponse } from "./page";
import { GridCardSkeleton, TableRowSkeleton } from "./loading";
import SmartEnquiryDrawer from "./SmartEnquiryDrawer";

// ── Types ──────────────────────────────────────────────────────────────────────

type Enquiry = SmartEnquiryResponse["data"][number];
type ViewMode = "table" | "grid";
type Status = "new" | "reviewed" | "closed";

interface Category {
  id: number | string;
  name: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  new: { pill: "bg-[#EAF3DE] text-[#2d5a27] border-[#c2ddb5]", dot: "bg-[#4a8f42]", label: "New" },
  reviewed: { pill: "bg-[#E6F1FB] text-[#185FA5] border-[#b3d4f5]", dot: "bg-[#185FA5]", label: "Reviewed" },
  closed: { pill: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400", label: "Closed" },
};

const SENDER_COLORS: Record<string, string> = {
  "Farmer": "bg-amber-50 text-amber-700 border-amber-200",
  "Dealer": "bg-blue-50 text-blue-700 border-blue-200",
  "Consultant/Other": "bg-purple-50 text-purple-700 border-purple-200",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function SenderBadge({ type }: { type: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${SENDER_COLORS[type] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {type}
    </span>
  );
}

// ── Grid Card ──────────────────────────────────────────────────────────────────

function EnquiryCard({ e, onClick }: { e: Enquiry; onClick: (enquiry: Enquiry) => void }) {
  return (
    <div
      onClick={() => onClick(e)}
      className="cursor-pointer group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#b6debb] transition-all duration-200 overflow-hidden flex flex-col"
    >

      {/* Top accent */}
      <div className={`h-1 w-full ${e.status === "new" ? "" : e.status === "reviewed" ? "bg-[#185FA5]" : "bg-gray-300"}`} />

      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#EAF3DE] flex items-center justify-center text-[11px] font-bold text-[#2d5a27] shrink-0">
              {initials(e.need)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{e.need}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{e.categories?.name ?? "—"}</p>
            </div>
          </div>
          <StatusBadge status={e.status ?? "new"} />
        </div>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-1.5">
          <SenderBadge type={e.senderType} />
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-gray-500 border border-gray-200">
            <MapPin size={9} /> {e.district}
          </span>
          {e.crop && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-[10px] font-medium text-green-700 border border-green-100">
              <Leaf size={9} /> {e.crop}
            </span>
          )}
        </div>

        {/* Message */}
        {e.message && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            {e.message}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
          <a href={`tel:${e.mobileNo}`}
            onClick={(ev) => ev.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#2d5a27] hover:underline"
          >
            <Phone size={11} /> {e.mobileNo}
          </a>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Clock size={10} />
            {timeAgo(e.createdAt ?? new Date().toISOString())}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Table Row ──────────────────────────────────────────────────────────────────

function EnquiryRow({ e, idx, onClick }: { e: Enquiry; idx: number; onClick: (enquiry: Enquiry) => void }) {
  return (
    <tr
      onClick={() => onClick(e)}
      className={`cursor-pointer transition hover:bg-[#f9faf7] ${idx % 2 === 0 ? "" : "bg-gray-50/40"} border-b border-gray-100 last:border-none`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#EAF3DE] flex items-center justify-center text-[10px] font-bold text-[#2d5a27] shrink-0">
            {initials(e.need)}
          </div>
          <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{e.need}</p>
        </div>
      </td>
      <td className="px-4 py-3"><SenderBadge type={e.senderType} /></td>
      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
        <span className="flex items-center gap-1"><MapPin size={10} className="text-gray-400" />{e.district}</span>
      </td>
      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{e.categories?.name ?? "—"}</td>
      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{e.brands?.name ?? "—"}</td>
      <td className="px-4 py-3 text-xs text-gray-500">
        {e.crop
          ? <span className="flex items-center gap-1"><Leaf size={10} className="text-green-500" />{e.crop}{e.cropStage ? ` · ${e.cropStage}` : ""}</span>
          : <span className="text-gray-300 italic">—</span>
        }
      </td>
      <td className="px-4 py-3">
        <a href={`tel:${e.mobileNo}`}
          onClick={(ev) => ev.stopPropagation()}
          className="text-xs font-mono text-[#2d5a27] hover:underline"
        >{e.mobileNo}</a>
      </td>
      <td className="px-4 py-3"><StatusBadge status={e.status ?? "new"} /></td>
      <td className="px-4 py-3 text-[11px] text-gray-400 whitespace-nowrap">
        {timeAgo(e.createdAt ?? new Date().toISOString())}
      </td>
    </tr>
  );
}

// ── Filter Bar ─────────────────────────────────────────────────────────────────

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${active
        ? "bg-[#edf8ee] text-[#1f7a36] border-[#b6debb]"
        : "bg-white text-[#61756a] border-[#d1dfd5] hover:border-[#9bb4a1]"
        }`}
    >
      {label}
    </button>
  );
}

function FilterBar({
  filters, onChange, onReset, activeCount, search, onSearch, view, onViewChange,
  categories, categoriesLoading,
}: {
  filters: Record<string, string>;
  onChange: (key: string, val: string) => void;
  onReset: () => void;
  activeCount: number;
  search: string;
  onSearch: (val: string) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  categories: Category[];
  categoriesLoading: boolean;
}) {
  const selectCls = `px-3 py-1.5 border border-[#d1dfd5] rounded-lg text-xs font-semibold
    bg-white text-[#61756a] focus:outline-none focus:border-[#2d5a27] transition-all cursor-pointer`;

  const senderTypes = ["Farmer", "Dealer", "Consultant/Other"];

  return (
    <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 space-y-3 mb-4">

      {/* Search + view toggle row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb4a1] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by need, crop, mobile..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#cfe0d2] rounded-xl text-sm
              bg-[#fafdfb] focus:outline-none focus:border-[#2d5a27] focus:ring-2
              focus:ring-[#2d5a27]/20 transition-all placeholder:text-[#b0bcb5]"
          />
          {search && (
            <button onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9bb4a1] hover:text-[#61756a]">
              <X size={14} />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex border border-[#cfe0d2] rounded-xl overflow-hidden shrink-0">
          {([["table", List], ["grid", LayoutGrid]] as [ViewMode, React.ElementType][]).map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-3 py-2.5 transition-colors cursor-pointer ${v === "table" ? "border-l border-[#cfe0d2]" : ""
                } ${view === v
                  ? "bg-[#edf8ee] text-[#1f7a36]"
                  : "text-[#9bb4a1] hover:text-[#61756a]"
                }`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* Filter pills row */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal size={13} className="text-[#9bb4a1]" />

        <select
          value={filters.senderType}
          onChange={(e) => onChange("senderType", e.target.value)}
          className={selectCls}
        >
          <option value="">All Senders</option>
          {senderTypes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* ── Category filter ── */}
        <select
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
          disabled={categoriesLoading}
          className={`${selectCls} ${categoriesLoading ? "opacity-60 cursor-wait" : ""}`}
        >
          <option value="">
            {categoriesLoading ? "Loading…" : "All Categories"}
          </option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          value={filters.district}
          onChange={(e) => onChange("district", e.target.value)}
          placeholder="District…"
          className="px-3 py-1.5 border border-[#d1dfd5] rounded-lg text-xs font-semibold
            bg-white text-[#61756a] focus:outline-none focus:border-[#2d5a27]
            transition-all w-32 placeholder:text-[#b0bcb5]"
        />

        <div className="flex items-center gap-1.5 border-l border-[#e2ece3] pl-2">
          <FilterPill label="All" active={filters.status === ""} onClick={() => onChange("status", "")} />
          <FilterPill label="New" active={filters.status === "new"} onClick={() => onChange("status", "new")} />
          <FilterPill label="Reviewed" active={filters.status === "reviewed"} onClick={() => onChange("status", "reviewed")} />
          <FilterPill label="Closed" active={filters.status === "closed"} onClick={() => onChange("status", "closed")} />
        </div>

        {activeCount > 0 && (
          <button onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-400
              hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto cursor-pointer">
            <X size={11} /> Clear ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────

function Pagination({
  page, totalPages, onPageChange,
}: {
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
      <button
        className={btnCls(false, page === 1)}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={13} />
      </button>

      {totalPages > 1 && pages.map((p) => (
        <button key={p} className={btnCls(p === page)} onClick={() => onPageChange(p)}>
          {p}
        </button>
      ))}

      <button
        className={btnCls(false, page === totalPages)}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function SmartEnquiryClient({ data: initialData }: { data: SmartEnquiryResponse }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [enquiries, setEnquiries] = useState(initialData.data);
  const [meta, setMeta] = useState(initialData.meta);
  const [view, setView] = useState<ViewMode>("table");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Enquiry | null>(null);

  // ── Category state ─────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [filters, setFilters] = useState({
    status: searchParams.get("status") ?? "",
    senderType: searchParams.get("senderType") ?? "",
    district: searchParams.get("district") ?? "",
    category: searchParams.get("category") ?? "",   // ← new
  });

  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const filterTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // ── Fetch categories on mount ──────────────────────────────────────────────
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/v1/categories");
        const json = await res.json();
        // Support { data: Category[] } or Category[] response shapes
        setCategories(Array.isArray(json) ? json : (json.data ?? []));
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  // ── Fetch enquiries ────────────────────────────────────────────────────────

  const fetchData = useCallback(async (
    currentSearch: string,
    currentPage: number,
    currentFilters: typeof filters,
  ) => {
    setLoading(true);
    console.log("fetchData called with filters:", currentFilters);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "20");
      if (currentSearch) params.set("search", currentSearch);
      if (currentFilters.status) params.set("status", currentFilters.status);
      if (currentFilters.senderType) params.set("senderType", currentFilters.senderType);
      if (currentFilters.district) params.set("district", currentFilters.district);
      if (currentFilters.category) params.set("category", currentFilters.category); // ← new

      // Sync URL
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      const res = await fetch(`/api/v1/smart-enquiries?${params.toString()}`);
      const json = await res.json();
      setEnquiries(json.data);
      setMeta(json.meta);
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchData(val, 1, filters), 400);
  };

  const handleFilter = (key: string, val: string) => {
    const next = { ...filters, [key]: val };
    setFilters(next);
    setPage(1);

    if (key === "district") {
      clearTimeout(filterTimer.current);
      filterTimer.current = setTimeout(() => fetchData(search, 1, next), 400);
    } else {
      fetchData(search, 1, next);
    }
  };

  const handleReset = () => {
    const empty = { status: "", senderType: "", district: "", category: "" };
    setFilters(empty);
    setSearch("");
    setPage(1);
    fetchData("", 1, empty);
  };

  const handlePage = (p: number) => {
    setPage(p);
    fetchData(search, p, filters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 font-sans">

      {/* ── Toolbar ── */}
      <div className="">
        <FilterBar
          filters={filters}
          onChange={handleFilter}
          onReset={handleReset}
          activeCount={activeFilterCount}
          search={search}
          onSearch={handleSearch}
          view={view}
          onViewChange={setView}
          categories={categories}
          categoriesLoading={categoriesLoading}
        />
      </div>

      {/* Refresh */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => fetchData(search, page, filters)}
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-[#2d5a27] hover:border-[#b6debb] transition cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── Loading overlay ── */}
      {loading && view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <GridCardSkeleton key={i} />
          ))}
        </div>
      )}

      {loading && view === "table" && (
        <TableRowSkeleton />
      )}

      {/* ── Empty state ── */}
      {!loading && enquiries.length === 0 && (
        <div className="py-20 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
          <MessageCircleQuestion size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-600">No enquiries found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
          <button onClick={handleReset}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#2d5a27] px-4 py-2 text-xs font-medium text-white hover:bg-[#234820] transition cursor-pointer border-none">
            <X size={11} /> Clear filters
          </button>
        </div>
      )}

      {/* ── Grid view ── */}
      {!loading && view === "grid" && enquiries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {enquiries.map((e) => <EnquiryCard key={e.id} e={e} onClick={(e) => setSelected(e)} />)}
        </div>
      )}

      {/* ── Table view ── */}
      {!loading && view === "table" && enquiries.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  {["Need", "Sender", "District", "Category", "Brand", "Crop", "Mobile", "Status", "When"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e, i) => <EnquiryRow key={e.id} e={e} idx={i} onClick={(e) => setSelected(e)} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pagination + count ── */}
      {meta && (
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {Math.min((meta.page - 1) * meta.limit + 1, meta.total)}–{Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of <span className="font-semibold text-gray-700">{meta.total}</span> enquiries
          </p>
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePage}
          />
        </div>
      )}
      <SmartEnquiryDrawer
        enquiry={selected}
        onClose={() => setSelected(null)}
        onStatusChange={(id, status) => {
          setEnquiries(prev =>
            prev.map(e => e.id === id ? { ...e, status } : e)
          );
          setSelected(null);
        }}
      />
    </div>
  );
}