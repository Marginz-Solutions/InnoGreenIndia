"use client";

import { useState, useMemo, useEffect } from "react";
import EnquiriesClient from "./EnquiriesClient";
import ReviewedDealersClient from "./ReviewedClient";
import type { Enquiry, Dealer } from "./types";
import { Breadcrumb } from "@/components/website-customization/shared/Breadcrumb";

type Tab = "dashboard" | "enquiries" | "reviewed";

type DealerForm = {
    firmName: string;
    gstNumber: string;
    mobileNo: string;
    district: string;
    categoryInterest: string;
    monthlyVolume: string;
};

const emptyForm: DealerForm = {
    firmName: "",
    gstNumber: "",
    mobileNo: "",
    district: "",
    categoryInterest: "",
    monthlyVolume: "",
};

// ── Dashboard sub-components ───────────────────────────────────────────────────

function KpiCard({
    label,
    value,
    sub,
    accent,
}: {
    label: string;
    value: string | number;
    sub?: string;
    accent?: string;
}) {
    return (
        <div className={`rounded-2xl border bg-white p-5 shadow-sm ${accent ?? "border-gray-200"}`}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );
}

function BarRow({
    label,
    value,
    max,
    color,
}: {
    label: string;
    value: number;
    max: number;
    color: string;
}) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <p className="text-xs text-gray-600 w-36 truncate shrink-0">{label}</p>
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <p className="text-xs font-semibold text-gray-700 w-5 text-right shrink-0">{value}</p>
        </div>
    );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">{title}</p>
            {children}
        </div>
    );
}

function ActivityRow({ enquiry }: { enquiry: Enquiry }) {
    const statusColor: Record<string, string> = {
        new: "bg-[#EAF3DE] text-[#3B6D11]",
        reviewed: "bg-[#E6F1FB] text-[#185FA5]",
        closed: "bg-gray-100 text-gray-500",
    };
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-none">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#EAF3DE] flex items-center justify-center text-xs font-semibold text-[#2d5a27] shrink-0">
                    {enquiry.firmName?.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-800 leading-tight">{enquiry.firmName}</p>
                    <p className="text-[11px] text-gray-400">{enquiry.district} · {enquiry.categories.name}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusColor[enquiry.status]}`}>
                    {enquiry.status}
                </span>
                <p className="text-[11px] text-gray-400 hidden sm:block">{enquiry.submittedAt}</p>
            </div>
        </div>
    );
}

function DonutRing({ slices }: { slices: { color: string; pct: number }[] }) {
    let offset = 0;
    const r = 40;
    const circ = 2 * Math.PI * r;
    return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
            {slices.map((s, i) => {
                const dash = (s.pct / 100) * circ;
                const el = (
                    <circle
                        key={i}
                        cx="50" cy="50" r={r}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="18"
                        strokeDasharray={`${dash} ${circ - dash}`}
                        strokeDashoffset={-offset}
                    />
                );
                offset += dash;
                return el;
            })}
        </svg>
    );
}

// ── Dashboard view ─────────────────────────────────────────────────────────────

export function Dashboard({ enquiries, dealers }: { enquiries: Enquiry[]; dealers: Dealer[] }) {
    const newCount = enquiries.filter((e) => e.status === "new").length;
    const closedCount = enquiries.filter((e) => e.status === "closed").length;
    const reviewedCount = dealers.length;

    const conversionRate = enquiries.length > 0
        ? Math.round((reviewedCount / enquiries.length) * 100)
        : 0;

    // Category breakdown across both enquiries + dealers
    const categoryMap = useMemo(() => {
        const map: Record<string, number> = {};
        enquiries.forEach((e) => { map[e.categories.name] = (map[e.categories.name] ?? 0) + 1; });
        dealers.forEach((d) => { map[d.categories.name] = (map[d.categories.name] ?? 0) + 1; });
        return Object.entries(map).sort((a, b) => b[1] - a[1]);
    }, [enquiries, dealers]);

    // District breakdown
    const districtMap = useMemo(() => {
        const map: Record<string, number> = {};
        enquiries.forEach((e) => { map[e.district] = (map[e.district] ?? 0) + 1; });
        dealers.forEach((d) => { map[d.district] = (map[d.district] ?? 0) + 1; });
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
    }, [enquiries, dealers]);

    const maxCategory = categoryMap[0]?.[1] ?? 1;
    const maxDistrict = districtMap[0]?.[1] ?? 1;

    const categoryColors = [
        "bg-[#2d5a27]", "bg-[#4a8f42]", "bg-[#74b56b]",
        "bg-[#a8d5a2]", "bg-[#185FA5]", "bg-[#6baed6]",
    ];

    const donutTotal = newCount + closedCount + reviewedCount || 1;
    const donutSlices = [
        { color: "#2d5a27", pct: (newCount / donutTotal) * 100 },
        { color: "#185FA5", pct: (reviewedCount / donutTotal) * 100 },
        { color: "#d1d5db", pct: (closedCount / donutTotal) * 100 },
    ];

    const recent = [...enquiries].slice(0, 6);

    return (
        <div className="p-6 space-y-5">

            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <KpiCard
                    label="Total Enquiries"
                    value={enquiries.length}
                    sub="All time"
                    accent="border-gray-200"
                />
                <KpiCard
                    label="New"
                    value={newCount}
                    sub="Awaiting review"
                    accent="border-[#b6debb]"
                />
                <KpiCard
                    label="Reviewed Dealers"
                    value={reviewedCount}
                    sub="Converted"
                    accent="border-[#bdd7f5]"
                />
                <KpiCard
                    label="Conversion Rate"
                    value={`${conversionRate}%`}
                    sub="Enquiry → Dealer"
                    accent="border-gray-200"
                />
            </div>

            {/* Middle row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Status donut */}
                <SectionCard title="Status breakdown">
                    <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                            <DonutRing slices={donutSlices} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-700">{enquiries.length + reviewedCount}</span>
                            </div>
                        </div>
                        <div className="space-y-2.5 flex-1">
                            {[
                                { label: "New", count: newCount, color: "bg-[#2d5a27]" },
                                { label: "Reviewed", count: reviewedCount, color: "bg-[#185FA5]" },
                                { label: "Closed", count: closedCount, color: "bg-gray-300" },
                            ].map((s) => (
                                <div key={s.label} className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${s.color}`} />
                                    <span className="text-xs text-gray-600 flex-1">{s.label}</span>
                                    <span className="text-xs font-semibold text-gray-800">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionCard>

                {/* Category breakdown */}
                <SectionCard title="Top categories">
                    <div className="space-y-3">
                        {categoryMap.slice(0, 5).map(([cat, count], i) => (
                            <BarRow
                                key={cat}
                                label={cat}
                                value={count}
                                max={maxCategory}
                                color={categoryColors[i % categoryColors.length]}
                            />
                        ))}
                        {categoryMap.length === 0 && (
                            <p className="text-xs text-gray-400 italic">No data yet</p>
                        )}
                    </div>
                </SectionCard>

                {/* District breakdown */}
                <SectionCard title="Top districts">
                    <div className="space-y-3">
                        {districtMap.map(([dist, count]) => (
                            <BarRow
                                key={dist}
                                label={dist}
                                value={count}
                                max={maxDistrict}
                                color="bg-[#4a8f42]"
                            />
                        ))}
                        {districtMap.length === 0 && (
                            <p className="text-xs text-gray-400 italic">No data yet</p>
                        )}
                    </div>
                </SectionCard>
            </div>

            {/* Recent activity */}
            <SectionCard title="Recent enquiries">
                {recent.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No enquiries yet.</p>
                ) : (
                    <div>
                        {recent.map((e) => <ActivityRow key={e.id} enquiry={e} />)}
                    </div>
                )}
            </SectionCard>

            {/* Dealers with volume */}
            {dealers.filter((d) => d.monthlyVolume).length > 0 && (
                <SectionCard title="Monthly volume — top dealers">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dealers
                            .filter((d) => d.monthlyVolume)
                            .slice(0, 6)
                            .map((d) => (
                                <div key={d.id}
                                    className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 leading-tight">{d.firmName}</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">{d.district}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-[#2d5a27]">{d.monthlyVolume}</span>
                                </div>
                            ))}
                    </div>
                </SectionCard>
            )}
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DealersHubClient({
    enquiries,
    dealers,
}: {
    enquiries: {data: Enquiry[],meta:{
        total:number,
        page:number,
        limit:number,
        totalPages:number,
        hasNextPage: boolean,
        hasPrevPage: boolean,
    }};
    dealers:{data: Dealer[],meta:{
        total:number,
        page:number,
        limit:number,
        totalPages:number,
        hasNextPage: boolean,
        hasPrevPage: boolean,
    }};
}) {
    console.log(enquiries, dealers);
    const [tab, setTab] = useState<Tab>("enquiries");
    const [fetchedEnquiries, setFetchedEnquiries] = useState<Enquiry[]>(enquiries.data);
    const [fetchedDealers, setFetchedDealers] = useState<Dealer[]>(dealers.data);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<DealerForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        getCategories()
    }, [])

    const getCategories = async () => {
        const res = await fetch("/api/v1/categories", { cache: "no-store" });
        const data = await res.json();
        setCategories(data.data);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        console.log("Submitting form:", form);
        const res = await fetch("/api/v1/dealers/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, status: "new" }),
        });

        const result = await res.json();
        setFetchedEnquiries((prev) => [...prev, result.data]);
        setSaving(false);

        if (!res.ok) {
            setError(result.error ?? "Something went wrong");
            return;
        }

        setModalOpen(false);
        setForm(emptyForm);
    };

    const closeModal = () => {
        setModalOpen(false);
        setForm(emptyForm);
        setError(null);
    };

    const tabs: { key: Tab; label: string; badge?: string | number }[] = [
        // { key: "dashboard", label: "Dashboard" },
        {
            key: "enquiries",
            label: "New Enquiries",
            badge: fetchedEnquiries.filter((e) => e.status === "new").length,
        },
        { key: "reviewed", label: "Reviewed Dealers", badge: fetchedDealers?.length },
    ];

    return (
        <div className="min-h-screen font-sans relative">
            <Breadcrumb section="Dealers" />

            {/* Tab bar */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 pt-4 flex-wrap gap-y-2">
                <div className="flex items-center gap-1 flex-wrap">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`relative pb-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${tab === t.key ? "text-[#2d5a27]" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t.label}
                            {t.badge !== undefined && (
                                <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tab === t.key
                                    ? t.key === "reviewed"
                                        ? "bg-[#E6F1FB] text-[#185FA5]"
                                        : "bg-[#EAF3DE] text-[#2d5a27]"
                                    : "bg-gray-100 text-gray-500"
                                    }`}>
                                    {t.badge}
                                </span>
                            )}
                            {tab === t.key && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2d5a27]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Add dealer button */}
                <button
                    onClick={() => setModalOpen(true)}
                    className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#2d5a27] px-4 py-2 text-xs font-medium text-white hover:bg-[#234820] transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Dealer
                </button>
            </div>

            {/* Tab content
            {tab === "dashboard" && (
                <Dashboard enquiries={fetchedEnquiries} dealers={fetchedDealers} />
            )} */}
            {tab === "enquiries" && (
                <EnquiriesClient
                    enquiries={fetchedEnquiries}
                    initialMeta={enquiries.meta}
                    setEnquiries={setFetchedEnquiries}
                    setFetchedDealers={setFetchedDealers}
                />
            )}
            {tab === "reviewed" && (
                <ReviewedDealersClient
                    dealers={fetchedDealers}
                    setFetchedDealers={setFetchedDealers}
                    initialMeta={dealers.meta}
                />
            )}

            {/* Add Dealer Modal */}
            {modalOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">

                            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">Add Dealer</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Fill in the dealer details below</p>
                                </div>
                                <button onClick={closeModal}
                                    className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                                    aria-label="Close">✕</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                                    {[
                                        { name: "firmName", label: "Firm Name", placeholder: "Firm / Shop", required: true },
                                        { name: "gstNumber", label: "GST Number", placeholder: "GST", mono: true },
                                        { name: "mobileNo", label: "Mobile No", placeholder: "+91 98765 43210", type: "tel", required: true },
                                        { name: "district", label: "District", placeholder: "District", required: true },
                                    ].map(({ name, label, placeholder, type, required, mono }) => (
                                        <div key={name}>
                                            <label className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1 block">
                                                {label} {required && <span className="text-red-400">*</span>}
                                            </label>
                                            <input
                                                name={name}
                                                value={form[name as keyof DealerForm]}
                                                onChange={handleChange}
                                                required={required}
                                                type={type ?? "text"}
                                                placeholder={placeholder}
                                                className={`w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800
                                                    placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20
                                                    focus:border-[#2d5a27] ${mono ? "font-mono" : ""}`}
                                            />
                                        </div>
                                    ))}

                                    <div>
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1 block">
                                            Category Interest <span className="text-red-400">*</span>
                                        </label>
                                        <select
                                            name="categoryInterest"
                                            value={form.categoryInterest}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]"
                                        >
                                            <option value="" disabled>
                                                Select category
                                            </option>

                                            {categories?.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1 block">
                                            Monthly Volume <span className="text-gray-300">(optional)</span>
                                        </label>
                                        <input name="monthlyVolume" value={form.monthlyVolume}
                                            onChange={handleChange} placeholder="Approx. movement"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800
                                                placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27]" />
                                    </div>

                                    {error && (
                                        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
                                    )}
                                </div>

                                <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
                                    <button type="button" onClick={closeModal}
                                        className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving}
                                        className="flex-1 rounded-full bg-[#2d5a27] py-2.5 text-sm font-medium text-white
                                            hover:bg-[#234820] transition disabled:opacity-60 flex items-center justify-center gap-2">
                                        {saving ? (
                                            <>
                                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                Saving…
                                            </>
                                        ) : "Add Dealer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}