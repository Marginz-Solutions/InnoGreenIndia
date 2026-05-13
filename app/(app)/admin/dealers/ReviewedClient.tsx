"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Dealer } from "./types";

// ── Icons ──────────────────────────────────────────────────────────────────────

function IconGrid({ active }: { active: boolean }) {
  const c = active ? "#2d5a27" : "#9ca3af";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconTable({ active }: { active: boolean }) {
  const c = active ? "#2d5a27" : "#9ca3af";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="9" x2="9" y2="21" />
    </svg>
  );
}

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

// ── Helpers ────────────────────────────────────────────────────────────────────

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

function DrawerField({
  label, value, mono = false, muted = false, phone = false,
}: {
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

// ── Main client component ──────────────────────────────────────────────────────

type ViewMode = "table" | "grid";

export default function ReviewedDealersClient({
  dealers: initial,
  setFetchedDealers,
}: {
  dealers: Dealer[];
  setFetchedDealers: React.Dispatch<React.SetStateAction<Dealer[]>>;
}) {
  const router = useRouter();
  
  const [dealers, setDealers] = useState<Dealer[]>(initial);
  const [selected, setSelected] = useState<Dealer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Dealer | null>(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("table");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const supabase = createClient();

  const filtered = dealers?.filter(
    (d) =>
      d?.firmName?.toLowerCase().includes(search.toLowerCase()) ||
      d?.district?.toLowerCase().includes(search.toLowerCase()) ||
      d?.categoryInterest?.toLowerCase().includes(search.toLowerCase())
  );

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
    
    setFetchedDealers((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    
    setDeletingId(null);
    setDeleteTarget(null);

    if (!res.ok) {
      const { error } = await res.json();
      console.error("Delete failed:", error);
      return;
    }

    // Optimistic remove from UI + revalidate server data
    setDealers((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    startTransition(() => router.refresh());
  };
  const ViewToggleBtn = ({ mode, icon }: { mode: ViewMode; icon: React.ReactNode }) => (
    <button
      onClick={() => setView(mode)}
      className={`flex items-center justify-center rounded-lg p-2 transition
        ${view === mode ? "bg-[#EAF3DE]" : "hover:bg-gray-100"}`}
      aria-label={`Switch to ${mode} view`}
    >
      {icon}
    </button>
  );

  return (
    <div className="min-h-screen p-6 font-sans overflow-y-scroll">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Reviewed Dealers</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {dealers?.length} dealer{dealers?.length !== 1 ? "s" : ""} on record
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-medium text-[#185FA5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#185FA5]" />
          Reviewed
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 md:max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by firm, district or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm
              text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2
              focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
              ✕
            </button>
          )}
        </div>
        <div className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white p-1">
          <ViewToggleBtn mode="table" icon={<IconTable active={view === "table"} />} />
          <ViewToggleBtn mode="grid" icon={<IconGrid active={view === "grid"} />} />
        </div>
      </div>

      {/* Empty state */}
      {filtered?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <div className="mb-3 text-4xl">🔎</div>
          <p className="text-sm font-medium text-gray-700">No dealers found</p>
          <p className="text-xs text-gray-400 mt-1">Try a different search term.</p>
        </div>
      )}

      {/* ── GRID VIEW ─────────────────────────────────────────────────────────── */}
      {view === "grid" && filtered?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          {filtered?.map((dealer) => (
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
                <CategoryTag value={dealer.categoryInterest} />
                <p className="text-[10px] text-gray-400">{dealer.reviewedAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TABLE VIEW ────────────────────────────────────────────────────────── */}
      {view === "table" && filtered?.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  {["Firm Name", "GST Number", "Mobile No", "District", "Category", "Vol / mo", "Reviewed At", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider
                      text-gray-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((dealer, i) => (
                  <tr key={dealer.id} onClick={() => setSelected(dealer)}
                    className={`cursor-pointer transition hover:bg-[#f9faf7]
                      ${i < filtered.length - 1 ? "border-b border-gray-100" : ""}`}>
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
                    <td className="px-4 py-3"><CategoryTag value={dealer.categoryInterest} /></td>
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

      {/* ── Detail Drawer ──────────────────────────────────────────────────────── */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white px-5 pt-5 pb-8 shadow-2xl
            md:bottom-auto md:right-0 md:top-0 md:left-auto md:h-full md:w-[30rem]
            md:rounded-none md:rounded-l-3xl md:px-6 md:pt-6 md:pb-10 overflow-y-auto">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 md:hidden " />
            <div className="flex items-center justify-between mb-2 sm:mt-40 mt-70 lg:mt-35 xl:mt-20">
              <h2 className="text-base font-semibold text-gray-900">{selected.firmName}</h2>
              <button onClick={() => setSelected(null)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                aria-label="Close">✕</button>
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
              <DrawerField label="Category Interest" value={selected.categoryInterest} />
              <DrawerField
                label="Monthly Volume (optional)"
                value={selected.monthlyVolume ?? "Not provided"}
                muted={!selected.monthlyVolume}
              />
              <DrawerField label="Reviewed At" value={selected.reviewedAt} />
            </div>
            <div className="mt-6">
              <button onClick={() => openDelete(selected)}
                className="w-full rounded-full border border-red-200 bg-red-50 py-2.5 text-sm
                  font-medium text-red-500 hover:bg-red-100 hover:text-red-700 transition">
                🗑 Delete Dealer
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Confirmation Modal ──────────────────────────────────────────── */}
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
                  text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={!!deletingId}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-medium text-white
                  hover:bg-red-600 transition disabled:opacity-70 flex items-center justify-center gap-2">
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