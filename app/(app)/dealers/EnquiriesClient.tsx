"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, SlidersHorizontal, X, LayoutGrid, LayoutList, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Dealer, Enquiry } from "./types";
import { api } from "@/lib/axiosInstance";

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
  status: "all" | "new" | "closed";
};

interface Category {
  id: number | string;
  name: string;
}

const emptyFilters: Filters = {
  query: "",
  category: "all",
  district: "all",
  status: "all",
};

// ── Sub-components ─────────────────────────────────────────────────────────────

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

function StatusBadge({ status }: { status: Enquiry["status"] }) {
  const map = {
    new: "bg-[#EAF3DE] text-[#3B6D11]",
    reviewed: "bg-[#E6F1FB] text-[#185FA5]",
    closed: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${map[status]}`}>
      {status}
    </span>
  );
}

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
      <button className={btnCls(false, page === 1)} disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={13} />
      </button>
      {totalPages > 1 && pages.map((p) => (
        <button key={p} className={btnCls(p === page)} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      <button className={btnCls(false, page === totalPages)} disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 last:border-none">
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-32 animate-pulse rounded bg-black/[0.06]" />
          <div className="h-2.5 w-20 animate-pulse rounded bg-black/[0.06]" />
        </div>
      </td>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 w-20 animate-pulse rounded bg-black/[0.06]" />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="h-5 w-14 animate-pulse rounded-full bg-black/[0.06]" />
      </td>
    </tr>
  );
}

function GridCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5">
          <div className="h-3.5 w-36 animate-pulse rounded bg-black/[0.06]" />
          <div className="h-2.5 w-24 animate-pulse rounded bg-black/[0.06]" />
        </div>
        <div className="h-5 w-16 animate-pulse rounded-full bg-black/[0.06]" />
      </div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-2 w-12 animate-pulse rounded bg-black/[0.06]" />
            <div className="h-3 w-20 animate-pulse rounded bg-black/[0.06]" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-5 w-24 animate-pulse rounded-full bg-black/[0.06]" />
        <div className="h-3 w-20 animate-pulse rounded bg-black/[0.06]" />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function EnquiriesClient({
  enquiries,
  initialMeta,
  setEnquiries,
  setFetchedDealers,
}: {
  enquiries: Enquiry[];
  initialMeta: Meta;
  setEnquiries: React.Dispatch<React.SetStateAction<Enquiry[]>>;
  setFetchedDealers: React.Dispatch<React.SetStateAction<Dealer[]>>;
}) {

  const [meta, setMeta] = useState<Meta>(initialMeta);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [view, setView] = useState<ViewMode>("table");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // ── Category state ─────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const districtTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {

    // Reset state
    setFilters(emptyFilters);

    // Fetch fresh data
    fetchData(emptyFilters, 1);
  }, []);


  const activeFiltersCount = [
    filters.query,
    filters.category !== "all" ? filters.category : "",
    filters.district !== "all" ? filters.district : "",
    filters.status !== "all" ? filters.status : "",
  ].filter(Boolean).length;

  // ── Fetch categories on mount ──────────────────────────────────────────────
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");

        // Support both shapes: { data: Category[] } OR Category[]
        const list: Category[] = Array.isArray(res)
          ? res
          : (res.data ?? []);

        setCategories(
          list.sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (err: any) {
        console.error("Failed to load categories:", err.message);

        if (err.details) {
          console.error("Details:", err.details);
        }
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);


  // ── Fetch enquiries ────────────────────────────────────────────────────────

  const fetchData = useCallback(
    async (currentFilters: Filters, currentPage: number) => {
      setLoading(true);

      try {
        const res = await api.get("/dealers/requests", {
          params: {
            page: currentPage,
            limit: 10,
            ...(currentFilters.status !== "all" && { status: currentFilters.status }),
            ...(currentFilters.query && { search: currentFilters.query }),
            ...(currentFilters.district !== "all" && { district: currentFilters.district }),
            ...(currentFilters.category !== "all" && { categoryId: currentFilters.category }),
          },
        });
        const payload: any = res;
        setEnquiries(payload.data);
        setMeta(payload.meta);

      } catch (error: any) {
        console.error("Failed to fetch enquiries:", error.message);

        if (error.details) {
          console.error("Details:", error.details);
        }
      } finally {
        setLoading(false);
      }
    },
    [setEnquiries]
  );

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

  const markAs = async (id: string, status: Enquiry["status"]) => {
    // optimistic update
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );

    try {
      const result = await api.patch("/api/v1/dealers/requests", {
        id,
        status,
      });

      // result is already response.data

      if (status === "reviewed") {
        if (result?.data) {
          setFetchedDealers((prev) => [result.data, ...prev]);
        }

        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }

      if (status === "closed") {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }

      setSelected(null);
    } catch (error: any) {
      console.error("Update failed:", error.message);

      // rollback to previous state (assuming previous was "new")
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "new" } : e))
      );

      if (error.details) {
        console.error("Details:", error.details);
      }
    }
  };



  return (
    <div className="p-6 font-sans">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">New Enquiries</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {meta.total} submission{meta.total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-medium text-[#3B6D11]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3B6D11]" />
            {enquiries.filter((e) => e.status === "new").length} New
          </span>
          <button
            onClick={() => fetchData(filters, page)}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-[#2d5a27] hover:border-[#b6debb] transition cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Filter card ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 space-y-3 mb-4">

        {/* Search + view toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb4a1] pointer-events-none" />
            <input
              value={filters.query}
              onChange={(e) => setFilter("query", e.target.value)}
              placeholder="Search by firm, district, category, GST or mobile…"
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
          <div className="hidden sm:flex border border-[#cfe0d2] rounded-xl overflow-hidden">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-2.5 border-r border-[#cfe0d2] transition-colors cursor-pointer ${view === "table" ? "bg-[#edf8ee] text-[#1f7a36]" : "text-[#9bb4a1] hover:text-[#61756a]"
                }`}
            >
              <LayoutList size={15} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2.5 transition-colors cursor-pointer ${view === "grid" ? "bg-[#edf8ee] text-[#1f7a36]" : "text-[#9bb4a1] hover:text-[#61756a]"
                }`}
            >
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
            onChange={(e) => { setFilter("category", e.target.value); }}
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

          {/* Status pills */}
          <div className="flex items-center gap-1.5 border-l border-[#e2ece3] pl-2">
            <FilterPill label="All" active={filters.status === "all"} onClick={() => { setFilter("status", "all");  }} />
            <FilterPill label="New" active={filters.status === "new"} onClick={() => { setFilter("status", "new");  }} />
            <FilterPill label="Closed" active={filters.status === "closed"} onClick={() => { setFilter("status", "closed");  }} />
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
            {meta.total} result{meta.total !== 1 ? "s" : ""}
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
                  {["Firm Name", "GST Number", "Mobile No", "District", "Category", "Vol / mo", "Submitted", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3">
                      <div className="h-2.5 w-16 animate-pulse rounded bg-black/[0.06]" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Loading — grid skeleton ───────────────────────────────────────────── */}
      {loading && view === "grid" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <GridCardSkeleton key={i} />)}
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────────────── */}
      {!loading && enquiries.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <div className="mb-3 text-4xl">📭</div>
          <p className="text-sm font-medium text-gray-700">
            {meta.total === 0 ? "All caught up!" : "No results found"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {meta.total === 0 ? "No new enquiries at the moment." : "Try adjusting your filters."}
          </p>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#2d5a27] px-4 py-2 text-xs font-medium text-white hover:bg-[#234820] transition cursor-pointer border-none">
              <X size={11} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Grid view ─────────────────────────────────────────────────────────── */}
      {!loading && view === "grid" && enquiries.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              onClick={() => setSelected(enquiry)}
              className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{enquiry.firmName}</p>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">GST: {enquiry.gstNumber}</p>
                </div>
                <StatusBadge status={enquiry.status} />
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mb-4">
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">District</p>
                  <p className="text-gray-700">{enquiry.district}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">Mobile</p>
                  <a href={`tel:${enquiry.mobileNo}`} onClick={(e) => e.stopPropagation()}
                    className="text-[#2d5a27] font-medium hover:underline">{enquiry.mobileNo}</a>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">Monthly Volume</p>
                  <p className="text-gray-700">{enquiry.monthlyVolume ?? <span className="italic text-gray-300">Not provided</span>}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                  🌿 {enquiry.categories.name}
                </span>
                <p className="text-[11px] text-gray-400">{enquiry.submittedAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Table view ────────────────────────────────────────────────────────── */}
      {!loading && view === "table" && enquiries.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  {["Firm Name", "GST Number", "Mobile No", "District", "Category", "Vol / mo", "Submitted", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry, i) => (
                  <tr key={enquiry.id} onClick={() => setSelected(enquiry)}
                    className={`cursor-pointer transition hover:bg-[#f9faf7] ${i < enquiries.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 whitespace-nowrap">{enquiry.firmName}</p>
                      <p className="text-[11px] font-mono text-gray-400 mt-0.5">{enquiry.gstNumber}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{enquiry.gstNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={`tel:${enquiry.mobileNo}`} onClick={(e) => e.stopPropagation()}
                        className="text-[#2d5a27] text-xs font-medium hover:underline">{enquiry.mobileNo}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{enquiry.district}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 border border-gray-200 whitespace-nowrap">
                        🌿 {enquiry.categories.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {enquiry.monthlyVolume ?? <span className="italic text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{enquiry.submittedAt}</td>
                    <td className="px-4 py-3"><StatusBadge status={enquiry.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────────────────── */}
      {!loading && meta && (
        <div className="flex items-center justify-between flex-wrap gap-3 pt-4">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {Math.min((meta.page - 1) * meta.limit + 1, meta.total)}–{Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of <span className="font-semibold text-gray-700">{meta.total}</span> enquiries
          </p>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={handlePage} />
        </div>
      )}

      {/* ── Drawer ────────────────────────────────────────────────────────────── */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-white shadow-2xl max-h-[90vh]
            md:inset-x-auto md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-120 md:max-h-full md:rounded-none md:rounded-l-3xl">

            <div className="flex-1 overflow-y-auto px-5 pt-5 md:px-6 md:pt-6">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 md:hidden" />
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900">{selected.firmName}</h2>
                <button onClick={() => setSelected(null)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">✕</button>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  { label: "Firm Name", value: selected.firmName },
                  { label: "GST Number", value: selected.gstNumber, mono: true },
                  { label: "Mobile No", value: selected.mobileNo, mono: true, phone: true },
                  { label: "District", value: selected.district },
                  { label: "Category Interest", value: selected.categories.name },
                  { label: "Monthly Volume", value: selected.monthlyVolume ?? "Not provided", muted: !selected.monthlyVolume },
                ].map(({ label, value, mono, muted, phone }) => (
                  <div key={label}>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">{label}</p>
                    <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 flex items-center justify-between">
                      <p className={`text-sm ${mono ? "font-mono" : ""} ${muted ? "italic text-gray-300" : "text-gray-800"}`}>
                        {value}
                      </p>
                      {phone && (
                        <a href={`tel:${value}`}
                          className="ml-2 shrink-0 rounded-full bg-[#EAF3DE] px-2.5 py-1 text-[11px] font-medium text-[#3B6D11] hover:bg-[#d4ebbc] transition">
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-4 mb-2">Submitted: {selected.submittedAt}</p>
            </div>

            <div className="shrink-0 border-t border-gray-100 px-5 py-4 md:px-6 md:py-6">
              <div className="flex gap-2">
                <button onClick={() => markAs(selected.id, "reviewed")}
                  className="flex-1 rounded-full bg-[#2d5a27] py-2.5 text-sm font-medium text-white hover:bg-[#234820] transition cursor-pointer border-none">
                  Mark as Reviewed
                </button>
                {selected.status === "new" && (
                  <button onClick={() => markAs(selected.id, "closed")}
                    className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer">
                    Cancel request
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}