"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, LayoutGrid, LayoutList } from "lucide-react";
import { Dealer, Enquiry } from "./types";



// ── Types ──────────────────────────────────────────────────────────────────────

type ViewMode = "grid" | "table";

type Filters = {
    query: string;
    category: string;
    district: string;
    status: "all" | "new" | "closed";
};

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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${active
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

// ── Main component ─────────────────────────────────────────────────────────────

export default function EnquiriesClient({
    enquiries,
    setEnquiries,
    setFetchedDealers,
}: {
    enquiries: Enquiry[];
    setEnquiries: React.Dispatch<React.SetStateAction<Enquiry[]>>;
    setFetchedDealers: React.Dispatch<React.SetStateAction<Dealer[]>>;
}) {
    const [selected, setSelected] = useState<Enquiry | null>(null);
    const [filters, setFilters] = useState<Filters>(emptyFilters);
    const [view, setView] = useState<ViewMode>("grid");

    const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
        setFilters((prev) => ({ ...prev, [key]: value }));

    const clearFilters = () => setFilters(emptyFilters);

    // Dynamic dropdown values
    const categories = useMemo(
        () => [...new Set(enquiries.map((e) => e.categories.name))].sort(),
        [enquiries]
    );
    const districts = useMemo(
        () => [...new Set(enquiries.map((e) => e.district))].sort(),
        [enquiries]
    );

    const activeFiltersCount = [
        filters.query,
        filters.category !== "all" ? filters.category : "",
        filters.district !== "all" ? filters.district : "",
        filters.status !== "all" ? filters.status : "",
    ].filter(Boolean).length;

    const filtered = useMemo(() => {
        return enquiries?.filter((e) => {
            const q = filters.query.toLowerCase();
            const matchQuery =
                !q ||
                e.firmName?.toLowerCase().includes(q) ||
                e.district?.toLowerCase().includes(q) ||
                e.categories.name?.toLowerCase().includes(q) ||
                e.gstNumber?.toLowerCase().includes(q) ||
                e.mobileNo?.toLowerCase().includes(q);

            const matchCategory =
                filters.category === "all" || e.categories.name === filters.category;

            const matchDistrict =
                filters.district === "all" || e.district === filters.district;

            const matchStatus =
                filters.status === "all" || e.status === filters.status;

            return matchQuery && matchCategory && matchDistrict && matchStatus;
        });
    }, [enquiries, filters]);

    const markAs = async (id: number, status: Enquiry["status"]) => {
        setEnquiries((prev) =>
            prev.map((e) => (e.id === id ? { ...e, status } : e))
        );

        const res = await fetch("/api/v1/dealers/requests", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });

        if (!res.ok) {
            const { error } = await res.json();
            console.error("Update failed:", error);
            setEnquiries((prev) =>
                prev.map((e) => (e.id === id ? { ...e, status: "new" } : e))
            );
            return;
        }

        if (status === "reviewed") {
            const result = await res.json();
            setFetchedDealers((prev) => [result.data, ...prev]);
        }

        setEnquiries((prev) => prev.filter((e) => e.status !== "reviewed"));
        setSelected(null);
    };

    return (
        <div className="min-h-screen p-6 font-sans overflow-y-scroll">

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">New Enquiries</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {enquiries?.length} unreviewed submission{enquiries?.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-medium text-[#3B6D11]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3B6D11]" />
                    {enquiries?.filter(e => e.status === "new").length} New
                </span>
            </div>

            {/* ── Filter card ─────────────────────────────────────────────────────── */}
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
                            onClick={() => setView("grid")}
                            className={`px-3 py-2.5 transition-colors ${view === "grid" ? "bg-[#edf8ee] text-[#1f7a36]" : "text-[#9bb4a1] hover:text-[#61756a]"
                                }`}
                            aria-label="Grid view"
                        >
                            <LayoutGrid size={15} />
                        </button>
                        <button
                            onClick={() => setView("table")}
                            className={`px-3 py-2.5 border-l border-[#cfe0d2] transition-colors ${view === "table" ? "bg-[#edf8ee] text-[#1f7a36]" : "text-[#9bb4a1] hover:text-[#61756a]"
                                }`}
                            aria-label="Table view"
                        >
                            <LayoutList size={15} />
                        </button>
                    </div>
                </div>

                {/* Filter pills */}
                <div className="flex flex-wrap items-center gap-2">
                    <SlidersHorizontal size={13} className="text-[#9bb4a1]" />

                    {/* Category */}
                    <select
                        value={filters.category}
                        onChange={(e) => setFilter("category", e.target.value)}
                        className="px-3 py-1.5 border border-[#d1dfd5] rounded-lg text-xs font-semibold
                            bg-white text-[#61756a] focus:outline-none focus:border-[#2d5a27] transition-all"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>

                    {/* District */}
                    <select
                        value={filters.district}
                        onChange={(e) => setFilter("district", e.target.value)}
                        className="px-3 py-1.5 border border-[#d1dfd5] rounded-lg text-xs font-semibold
                            bg-white text-[#61756a] focus:outline-none focus:border-[#2d5a27] transition-all"
                    >
                        <option value="all">All Districts</option>
                        {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>

                    {/* Status pills */}
                    <div className="flex items-center gap-1.5 border-l border-[#e2ece3] pl-2">
                        <FilterPill label="All" active={filters.status === "all"} onClick={() => setFilter("status", "all")} />
                        <FilterPill label="New" active={filters.status === "new"} onClick={() => setFilter("status", "new")} />
                        <FilterPill label="Closed" active={filters.status === "closed"} onClick={() => setFilter("status", "closed")} />
                    </div>

                    {/* Clear */}
                    {activeFiltersCount > 0 && (
                        <button onClick={clearFilters}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-400
                                hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto">
                            <X size={11} />
                            Clear ({activeFiltersCount})
                        </button>
                    )}

                    {/* Results count */}
                    <span className="ml-auto text-xs text-[#9bb4a1] font-medium">
                        {filtered?.length} result{filtered?.length !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>

            {/* Empty state */}
            {filtered?.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                    <div className="mb-3 text-4xl">📭</div>
                    <p className="text-sm font-medium text-gray-700">
                        {enquiries?.length === 0 ? "All caught up!" : "No results found"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {enquiries?.length === 0 ? "No new enquiries at the moment." : "Try adjusting your filters."}
                    </p>
                </div>
            )}

            {/* ── GRID VIEW ──────────────────────────────────────────────────────── */}
            {view === "grid" && filtered?.length > 0 && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {filtered?.map((enquiry) => (
                        <div
                            key={enquiry.id}
                            onClick={() => setSelected(enquiry)}
                            className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300"
                        >
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{enquiry.firmName}</p>
                                    <p className="text-xs font-mono text-gray-400 mt-0.5">GST No.: {enquiry.gstNumber}</p>
                                </div>
                                <StatusBadge status={enquiry.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mb-4">
                                <div>
                                    <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">District</p>
                                    <p className="text-gray-700">{enquiry.district}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">Mobile No</p>
                                    <a href={`tel:${enquiry.mobileNo}`} onClick={(e) => e.stopPropagation()}
                                        className="text-[#2d5a27] font-medium hover:underline">
                                        {enquiry.mobileNo}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-gray-400 uppercase tracking-wide text-[10px] font-medium mb-0.5">Monthly Volume</p>
                                    <p className="text-gray-700">
                                        {enquiry.monthlyVolume ?? <span className="italic text-gray-300">Not provided</span>}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center flex-wrap gap-3">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                                    🌿 {enquiry.categories.name}
                                </span>
                                <p className="text-[11px] text-gray-400">{enquiry.submittedAt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── TABLE VIEW ─────────────────────────────────────────────────────── */}
            {view === "table" && filtered?.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                                    {["Firm Name", "GST Number", "Mobile No", "District", "Category", "Vol / mo", "Submitted", "Status"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider
                                            text-gray-400 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((enquiry, i) => (
                                    <tr key={enquiry.id} onClick={() => setSelected(enquiry)}
                                        className={`cursor-pointer transition hover:bg-[#f9faf7] ${i < filtered.length - 1 ? "border-b border-gray-100" : ""
                                            }`}>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-gray-900 whitespace-nowrap">{enquiry.firmName}</p>
                                                <p className="text-[11px] font-mono text-gray-400 mt-0.5">{enquiry.gstNumber}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{enquiry.gstNumber}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <a href={`tel:${enquiry.mobileNo}`} onClick={(e) => e.stopPropagation()}
                                                className="text-[#2d5a27] text-xs font-medium hover:underline">{enquiry.mobileNo}</a>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{enquiry.district}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1
                                                text-[11px] font-medium text-gray-600 border border-gray-200 whitespace-nowrap">
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

            {/* ── Drawer ─────────────────────────────────────────────────────────── */}
            {selected && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />

                    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col
                        rounded-t-3xl bg-white shadow-2xl max-h-[90vh]
                        md:inset-x-auto md:inset-y-0 md:right-0 md:left-auto
                        md:h-full md:w-120 md:max-h-full md:rounded-none md:rounded-l-3xl">

                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto px-5 pt-5 md:px-6 md:pt-6">
                            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 md:hidden" />

                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-semibold text-gray-900">{selected.firmName}</h2>
                                <button onClick={() => setSelected(null)}
                                    className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                                    aria-label="Close">✕</button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {[
                                    { label: "Firm Name", value: selected.firmName },
                                    { label: "GST Number", value: selected.gstNumber, mono: true },
                                    { label: "Mobile No", value: selected.mobileNo, mono: true, phone: true },
                                    { label: "District", value: selected.district },
                                    { label: "Category Interest", value: selected.categories.name },
                                    {
                                        label: "Monthly Volume (optional)",
                                        value: selected.monthlyVolume ?? "Not provided",
                                        muted: !selected.monthlyVolume,
                                    },
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

                        {/* Pinned actions */}
                        <div className="shrink-0 border-t border-gray-100 px-5 py-4 md:px-6 md:py-6">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => markAs(selected.id, "reviewed")}
                                    className="flex-1 rounded-full bg-[#2d5a27] py-2.5 text-sm font-medium text-white hover:bg-[#234820] transition"
                                >
                                    Mark as Reviewed
                                </button>
                                {selected.status === "new" && (
                                    <button
                                        onClick={() => markAs(selected.id, "closed")}
                                        className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
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