"use client";

import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/components/auth-provider";

const summaryData = [
  {
    cluster: "Urban_Horticulture_Belt",
    villages: 8,
    crops: "Vegetables, flowers, banana, mango",
    products: "WSF, micronutrients, crop protection, drip accessories",
    bestCrops: "Tomato, flowers, mixed vegetables",
    avgIntensity: 4.4,
    avgRiskScore: 3.5,
    channel: "Advisory-led premium dealer",
    season: "Round-year + flush campaigns",
    remarks: "Fast-repeat, high-service cluster",
  },
  {
    cluster: "Flower_Vegetable_Intensive_Belt",
    villages: 6,
    crops: "Tomato, beans, brassicas, flowers",
    products: "Crop protection, WSF, Ca-B, Zn-B, adjuvants",
    bestCrops: "Tomato, flowers, beans, cabbage",
    avgIntensity: 4.5,
    avgRiskScore: 3.6,
    channel: "Campaign + technical sales",
    season: "Peak vegetable + flower windows",
    remarks: "Highest crop-protection pull",
  },
  {
    cluster: "Highland_Horticulture_Belt",
    villages: 10,
    crops: "Vegetables, flowers, mango, pulses",
    products: "WSF, micronutrients, organics, fungicides",
    bestCrops: "Beans, brassicas, flowers",
    avgIntensity: 3.9,
    avgRiskScore: 3.2,
    channel: "Specialty horticulture support",
    season: "Cool-belt windows",
    remarks: "Quality-focused, moderate market access",
  },
  {
    cluster: "Mango_Orchard_Belt",
    villages: 18,
    crops: "Mango, pulses, millets, groundnut",
    products: "Micronutrients, orchard nutrition, biostimulants",
    bestCrops: "Mango, intercrop pulses, groundnut",
    avgIntensity: 2.7,
    avgRiskScore: 2.2,
    channel: "Seasonal orchard campaign",
    season: "Pre-flowering to fruit development",
    remarks: "Seasonal but strategic cluster",
  },
  {
    cluster: "Mixed_Dryland_Belt",
    villages: 18,
    crops: "Ragi, pulses, groundnut, millets",
    products: "Basal fertilizers, seed treatment, herbicides",
    bestCrops: "Millets, pulses, groundnut",
    avgIntensity: 2.7,
    avgRiskScore: 2.2,
    channel: "Value-volume dealer model",
    season: "Rainfed pattam season",
    remarks: "Large coverage, lower ticket size",
  },
  {
    cluster: "Irrigated_Valley_Mixed_Belt",
    villages: 12,
    crops: "Paddy, sugarcane, vegetables, groundnut",
    products: "Basal + water-solubles, micronutrients, crop protection",
    bestCrops: "Paddy, vegetables, groundnut",
    avgIntensity: 3.8,
    avgRiskScore: 3.0,
    channel: "Balanced dealer + campaign model",
    season: "Multiple crop windows",
    remarks: "Balanced irrigated mixed farming",
  },
];

const priorityBlocks = [
  { name: "Hosur", score: 3.9, desc: "Mixed premium horticulture potential" },
  { name: "Shoolagiri", score: 4.0, desc: "Excellent campaign block for vegetables and flowers" },
  { name: "Kaveripattinam", score: 3.4, desc: "Balanced block for irrigated mixed business" },
  { name: "Thally", score: 3.3, desc: "Selective specialty horticulture focus" },
];

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Topbar />
      <div className="container max-w-[1380px] mx-auto p-6">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-5">
          <div className="panel dark">
            <h2 className="m-0 mb-3 text-lg font-semibold">Branded IGIM operational command center</h2>
            <p className="text-white/80">
              This web app is structured for daily field execution, retail territory planning, and management review.
              Teams can browse planning sheets, open route maps, review commercial clusters, and use the portal as a
              single branded IGIM workspace.
            </p>
            <div className="flex gap-2 flex-wrap mt-3">
              <span className="tag">Field staff</span>
              <span className="tag">Retail planning</span>
              <span className="tag">Management review</span>
              <span className="tag">IGIM branded</span>
            </div>
            <div className="flex gap-3 flex-wrap mt-4">
              <Link href="/sheets" className="btn primary">
                Open planning sheets
              </Link>
              <Link href="/cluster-map" className="btn">
                Open clustered route map
              </Link>
              <Link href="/field-route-map" className="btn">
                Open field route map
              </Link>
            </div>
          </div>
          <div className="panel">
            <h2 className="m-0 mb-3 text-lg font-semibold">Management quick view</h2>
            <div className="flex flex-col gap-3">
              <div className="list-item">
                <strong>Daily use</strong>
                <br />
                <span className="text-[var(--muted)]">
                  Field staff can search every planning sheet and export filtered views to CSV.
                </span>
              </div>
              <div className="list-item">
                <strong>Retail planning</strong>
                <br />
                <span className="text-[var(--muted)]">
                  Cluster opportunity and product-priority views support stocking and campaign decisions.
                </span>
              </div>
              <div className="list-item">
                <strong>Beat execution</strong>
                <br />
                <span className="text-[var(--muted)]">
                  Cluster and visit-route maps are available in branded portal pages.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-5">
          <div className="kpi">
            <div className="label">Planning sheets</div>
            <div className="value">13</div>
          </div>
          <div className="kpi">
            <div className="label">Commercial clusters</div>
            <div className="value">6</div>
          </div>
          <div className="kpi">
            <div className="label">Mapped villages</div>
            <div className="value">72</div>
          </div>
          <div className="kpi">
            <div className="label">Operational maps</div>
            <div className="value">2</div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-12 gap-4">
          {/* Summary Table */}
          <div className="card col-span-12 lg:col-span-8">
            <h2 className="m-0 mb-3 text-lg font-semibold">Cluster commercial summary</h2>
            <p className="text-[var(--muted)] mb-4">Quick management view of commercial focus by cluster.</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Cluster</th>
                    <th>No. of mapped villages</th>
                    <th>Dominant crops</th>
                    <th>Top product buckets</th>
                    <th>Best commercial crop groups</th>
                    <th>Avg input intensity</th>
                    <th>Avg risk-adjusted business score</th>
                    <th>Top channel strategy</th>
                    <th>Priority season/campaign</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.cluster}</td>
                      <td>{row.villages}</td>
                      <td>{row.crops}</td>
                      <td>{row.products}</td>
                      <td>{row.bestCrops}</td>
                      <td>{row.avgIntensity}</td>
                      <td>{row.avgRiskScore}</td>
                      <td>{row.channel}</td>
                      <td>{row.season}</td>
                      <td>{row.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Priority Action Blocks */}
          <div className="card col-span-12 lg:col-span-4">
            <h2 className="m-0 mb-3 text-lg font-semibold">Priority action blocks</h2>
            <div className="flex flex-col gap-3">
              {priorityBlocks.map((block, i) => (
                <div className="list-item" key={i}>
                  <strong>{block.name}</strong>
                  <br />
                  <span className="badge">{block.score} dealer opportunity</span>
                  <div className="text-[var(--muted)] mt-2">{block.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="card col-span-12">
            <h2 className="m-0 mb-3 text-lg font-semibold">Quick navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="sheet-card">
                <h3 className="m-0 mb-2 text-base font-semibold">Planning Sheets</h3>
                <p className="text-[var(--muted)]">
                  Open all sheet pages converted from the workbook for search and export.
                </p>
                <div className="mt-3.5">
                  <Link href="/sheets" className="btn primary">
                    Open sheet center
                  </Link>
                </div>
              </div>
              <div className="sheet-card">
                <h3 className="m-0 mb-2 text-base font-semibold">Cluster Route Map</h3>
                <p className="text-[var(--muted)]">
                  Branded route page for cluster-based field movement and beat planning.
                </p>
                <div className="mt-3.5">
                  <Link href="/cluster-map" className="btn primary">
                    Open cluster map
                  </Link>
                </div>
              </div>
              <div className="sheet-card">
                <h3 className="m-0 mb-2 text-base font-semibold">Field Visit Route Map</h3>
                <p className="text-[var(--muted)]">
                  Practical visit-order route page for field staff execution planning.
                </p>
                <div className="mt-3.5">
                  <Link href="/field-route-map" className="btn primary">
                    Open field route map
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
