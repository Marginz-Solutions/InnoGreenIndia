"use client";

import { useMemo, useState } from "react";
import type { Product, Category, Brand } from "./page";
import { Dealer, Enquiry } from "../dealers/types";
import { Dashboard } from "../dealers/DealersHubClient";

// ── Helpers ────────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

// ── Primitives ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon, accent = "border-gray-200",
}: {
  label: string; value: string | number; sub?: string; icon: string; accent?: string;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm flex items-start justify-between gap-3 ${accent}`}>
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-semibold text-gray-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  );
}

function SectionCard({ title, children, action }: {
  title: string; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function BarRow({ label, value, max, color = "bg-[#2d5a27]", sub }: {
  label: string; value: number; max: number; color?: string; sub?: string;
}) {
  const pct = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 group">
      <p className="text-xs text-gray-600 w-32 truncate shrink-0 group-hover:text-gray-900 transition-colors">
        {label}
      </p>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center gap-1 shrink-0 w-12 justify-end">
        <span className="text-xs font-semibold text-gray-700">{value}</span>
        {sub && <span className="text-[10px] text-gray-400">{sub}</span>}
      </div>
    </div>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex h-2 w-2 rounded-full shrink-0 ${active ? "bg-emerald-400" : "bg-gray-300"}`} />
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-gray-500 border border-gray-200">
      {label}
    </span>
  );
}

// ── Donut chart (pure SVG) ─────────────────────────────────────────────────────

function Donut({ slices, label }: {
  slices: { color: string; value: number }[];
  label: string | number;
}) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const r = 38; const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
        {slices.map((s, i) => {
          const dash = (s.value / total) * circ;
          const el = (
            <circle key={i} cx="50" cy="50" r={r} fill="none"
              stroke={s.color} strokeWidth="16"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset} />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

type ProductTab = "all" | "active" | "inactive" | "featured";

export default function ProductsDashboardClient({
  products,
  categories,
  brands,
  dealers,
  enquiries,
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  dealers: Dealer[]; // TODO
  enquiries: Enquiry[]; // TODO
}) {
  const [productTab, setProductTab] = useState<ProductTab>("all");
  const [search, setSearch] = useState("");

  // Lookup maps
  const categoryMap = useMemo(() =>
    Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);
  const brandMap = useMemo(() =>
    Object.fromEntries(brands.map((b) => [b.id, b.name])), [brands]);

  // KPIs
  const activeProducts = products.filter((p) => p.is_active);
  const featuredProducts = products.filter((p) => p.featured);
  const activeBrands = brands.filter((b) => b.is_active);

  // Products per category
  const perCategory = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      const name = p.category_id ? (categoryMap[p.category_id] ?? "Unknown") : "Uncategorised";
      map[name] = (map[name] ?? 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [products, categoryMap]);

  // Products per brand
  const perBrand = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      const name = p.brand_id ? (brandMap[p.brand_id] ?? "Unknown") : "No brand";
      map[name] = (map[name] ?? 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [products, brandMap]);

  // Tags frequency
  const topTags = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => p.tags?.forEach((t) => { map[t] = (map[t] ?? 0) + 1; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [products]);

  // Filtered products table
  const tabFiltered = useMemo(() => {
    let list = products;
    if (productTab === "active") list = list.filter((p) => p.is_active);
    if (productTab === "inactive") list = list.filter((p) => !p.is_active);
    if (productTab === "featured") list = list.filter((p) => p.featured);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [products, productTab, search]);

  const donutSlices = [
    { color: "#2d5a27", value: activeProducts.length },
    { color: "#d1d5db", value: products.length - activeProducts.length },
  ];

  const brandDonutSlices = [
    { color: "#185FA5", value: activeBrands.length },
    { color: "#d1d5db", value: brands.length - activeBrands.length },
  ];

  const barColors = [
    "bg-[#2d5a27]", "bg-[#4a8f42]", "bg-[#74b56b]",
    "bg-[#a8d5a2]", "bg-[#185FA5]", "bg-[#6baed6]",
  ];

  return (
    <div className="min-h-screen p-6 font-sans space-y-5">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of products, brands, Dealers and categories</p>
        </div>
        <span className="text-xs text-gray-400">
          Last updated: {timeAgo(products[0]?.updated_at ?? new Date().toISOString())}
        </span>
      </div>

      {/* ── KPI row ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total Products"
          value={products.length}
          sub={`${activeProducts.length} active`}
          icon="📦"
          accent="border-gray-200"
        />
        <KpiCard
          label="Brands"
          value={brands.length}
          sub={`${activeBrands.length} active`}
          icon="🏷️"
          accent="border-[#bdd7f5]"
        />
        <KpiCard
          label="Categories"
          value={categories.length}
          sub={`${perCategory.length} mapped`}
          icon="🗂️"
          accent="border-[#b6debb]"
        />
        <KpiCard
          label="Featured"
          value={featuredProducts.length}
          sub={`${products.length > 0 ? Math.round((featuredProducts.length / products.length) * 100) : 0}% of catalogue`}
          icon="⭐"
          accent="border-amber-200"
        />
      </div>

      {/* ── Row 2: donuts + category + brand bars ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Product status donut */}
        <SectionCard title="Product status">
          <div className="flex items-center gap-5">
            <Donut slices={donutSlices} label={products.length} />
            <div className="space-y-3 flex-1">
              {[
                { label: "Active", count: activeProducts.length, color: "bg-[#2d5a27]" },
                { label: "Inactive", count: products.length - activeProducts.length, color: "bg-gray-300" },
                { label: "Featured", count: featuredProducts.length, color: "bg-amber-400" },
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

        {/* Products per category */}
        <SectionCard title="Products by category">
          <div className="space-y-3">
            {perCategory.slice(0, 5).map(([cat, count], i) => (
              <BarRow key={cat} label={cat} value={count}
                max={perCategory[0]?.[1] ?? 1}
                color={barColors[i % barColors.length]} />
            ))}
            {perCategory.length === 0 && <p className="text-xs text-gray-400 italic">No data</p>}
          </div>
        </SectionCard>

        {/* Products per brand */}
        <SectionCard title="Products by brand">
          <div className="space-y-3">
            {perBrand.map(([brand, count], i) => (
              <BarRow key={brand} label={brand} value={count}
                max={perBrand[0]?.[1] ?? 1}
                color={i % 2 === 0 ? "bg-[#185FA5]" : "bg-[#6baed6]"} />
            ))}
            {perBrand.length === 0 && <p className="text-xs text-gray-400 italic">No data</p>}
          </div>
        </SectionCard>
      </div>

      {/* ── Row 3: Brands list + Tags ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Brands */}
        <SectionCard title="Brands">
          <div className="space-y-2">
            {brands.slice(0, 6).map((b) => (
              <div key={b.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-none">
                {b.logo_url ? (
                  <img src={b.logo_url} alt={b.name}
                    className="h-8 w-8 rounded-lg object-contain border border-gray-100 bg-white shrink-0" />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-[#EAF3DE] flex items-center justify-center
                    text-[11px] font-bold text-[#2d5a27] shrink-0">
                    {initials(b.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{b.name}</p>
                  {b.description && (
                    <p className="text-[11px] text-gray-400 truncate">{b.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <StatusDot active={b.is_active} />
                  <span className="text-[11px] text-gray-400">
                    {perBrand.find(([n]) => n === b.name)?.[1] ?? 0} products
                  </span>
                </div>
              </div>
            ))}
            {brands.length === 0 && <p className="text-xs text-gray-400 italic">No brands yet</p>}
          </div>
        </SectionCard>

        {/* Brand status donut + categories list */}
        <div className="space-y-4">
          <SectionCard title="Brand status">
            <div className="flex items-center gap-5">
              <Donut slices={brandDonutSlices} label={brands.length} />
              <div className="space-y-3 flex-1">
                {[
                  { label: "Active brands", count: activeBrands.length, color: "bg-[#185FA5]" },
                  { label: "Inactive brands", count: brands.length - activeBrands.length, color: "bg-gray-300" },
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

          {/* Tags cloud */}
          {topTags.length > 0 && (
            <SectionCard title="Top tags">
              <div className="flex flex-wrap gap-1.5">
                {topTags.map(([tag, count]) => (
                  <span key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 border border-gray-200
                      px-2.5 py-1 text-[11px] font-medium text-gray-600">
                    {tag}
                    <span className="text-[10px] text-gray-400 font-normal">×{count}</span>
                  </span>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {/* ── Products table ────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* Table toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 flex-wrap">
            {(["all", "active", "inactive", "featured"] as ProductTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setProductTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border capitalize ${productTab === t
                  ? "bg-[#edf8ee] text-[#1f7a36] border-[#b6debb]"
                  : "bg-white text-[#61756a] border-[#d1dfd5] hover:border-[#9bb4a1]"
                  }`}
              >
                {t}
                <span className="ml-1.5 text-[10px] opacity-70">
                  {t === "all" ? products.length
                    : t === "active" ? activeProducts.length
                      : t === "inactive" ? products.length - activeProducts.length
                        : featuredProducts.length}
                </span>
              </button>
            ))}
          </div>



          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs
                text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2
                focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] w-52"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-left">
                {["Product", "SKU", "Category", "Brand", "Tags", "Status", "Created"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider
                    text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabFiltered.slice(0, 20).map((p, i) => (
                <tr key={p.id}
                  className={`transition hover:bg-[#f9faf7] ${i < tabFiltered.length - 1 ? "border-b border-gray-100" : ""
                    }`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name}
                          className="h-8 w-8 rounded-lg object-cover border border-gray-100 shrink-0" />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-[#EAF3DE] flex items-center justify-center
                          text-[10px] font-bold text-[#2d5a27] shrink-0">
                          {initials(p.name)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 whitespace-nowrap leading-tight">{p.name}</p>
                        {p.short_description && (
                          <p className="text-[11px] text-gray-400 truncate max-w-[180px]">{p.short_description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                    {p.sku ?? <span className="italic text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    {p.category_id ? (categoryMap[p.category_id] ?? "—") : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    {p.brand_id ? (brandMap[p.brand_id] ?? "—") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap max-w-[160px]">
                      {p.tags?.slice(0, 2).map((t) => <Tag key={t} label={t} />)}
                      {p.tags?.length > 2 && (
                        <span className="text-[10px] text-gray-400">+{p.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <StatusDot active={p.is_active} />
                      <span className={`text-[11px] font-medium ${p.is_active ? "text-emerald-600" : "text-gray-400"}`}>
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                      {p.featured && (
                        <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200
                          rounded-full px-1.5 py-0.5 font-medium ml-1">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {timeAgo(p.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tabFiltered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm font-medium text-gray-600">No products found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different filter or search term</p>
            </div>
          )}
        </div>

        {tabFiltered.length > 20 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 text-center">
            Showing 20 of {tabFiltered.length} products
          </div>
        )}
      </div>
      <h1 className="text-xl font-semibold text-gray-900">Dealers</h1>
      <Dashboard dealers={dealers} enquiries={enquiries} />
    </div>
  );
}