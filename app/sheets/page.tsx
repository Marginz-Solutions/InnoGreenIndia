"use client";

import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/components/auth-provider";

const sheets = [
  {
    slug: "read-me",
    name: "Read_Me",
    description: "Krishnagiri IGIM workbook with block-wise and representative village-wise planning sheets.",
    rows: 10,
    columns: 2,
  },
  {
    slug: "block-master",
    name: "Block_Master",
    description: "Krishnagiri block-wise master. Soil-property fields are dominant block-level estimates.",
    rows: 10,
    columns: 20,
  },
  {
    slug: "cluster-master",
    name: "Cluster_Master",
    description: "Krishnagiri true village cluster map master. Clustering is by production system, soil behavior, irrigation logic, crop pattern, and agri-input business relevance.",
    rows: 6,
    columns: 14,
  },
  {
    slug: "cluster-opportunity",
    name: "Cluster_Opportunity",
    description: "Cluster-level scoring and business strategy for Krishnagiri village belts.",
    rows: 6,
    columns: 16,
  },
  {
    slug: "cluster-product-priority",
    name: "Cluster_Product_Priority",
    description: "Krishnagiri cluster-wise priority product matrix for stocking, campaigns, and dealer focus",
    rows: 6,
    columns: 14,
  },
  {
    slug: "crop-cluster-matrix",
    name: "Crop_Cluster_Matrix",
    description: "Krishnagiri crop-cluster matrix: crop fit, input demand, risk, and product priority by practical village cluster",
    rows: 29,
    columns: 16,
  },
  {
    slug: "crop-cluster-summary",
    name: "Crop_Cluster_Summary",
    description: "Krishnagiri crop-cluster summary dashboard for commercial focus",
    rows: 6,
    columns: 10,
  },
  {
    slug: "igim-scoring",
    name: "IGIM_Scoring",
    description: "Formula-based IGIM scoring: higher soil/nutrient scores mean higher constraint/risk.",
    rows: 10,
    columns: 11,
  },
  {
    slug: "cluster-map-view",
    name: "Cluster_Map_View",
    description: "Krishnagiri cluster view by block. This is a planning map, not a GIS polygon map.",
    rows: 10,
    columns: 8,
  },
  {
    slug: "village-master",
    name: "Village_Master",
    description: "Village-wise planning sheet for Krishnagiri. Values are inherited block-level generalizations for representative villages, not lab-test substitutes.",
    rows: 72,
    columns: 23,
  },
  {
    slug: "village-cluster-map",
    name: "Village_Cluster_Map",
    description: "Krishnagiri village cluster map. Villages are clustered into real planning belts using block position, market linkage, soil type, irrigation pattern, and crop business system.",
    rows: 72,
    columns: 18,
  },
  {
    slug: "village-scoring",
    name: "Village_Scoring",
    description: "Village-level IGIM scoring for representative Krishnagiri villages. Scores are inherited or lightly interpreted from block-level opportunity logic.",
    rows: 72,
    columns: 14,
  },
  {
    slug: "soil-guide",
    name: "Soil_Guide",
    description: "Dominant soil-group guide used to interpret Krishnagiri block soils.",
    rows: 5,
    columns: 14,
  },
];

export default function SheetsPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Topbar />
      <div className="container max-w-[1380px] mx-auto p-6">
        <div className="panel">
          <h2 className="m-0 mb-3 text-lg font-semibold">IGIM planning sheets</h2>
          <p className="text-[var(--muted)]">
            Browse the operational workbook as branded web pages. Source-reference sheets have been removed from
            staff-facing navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {sheets.map((sheet) => (
            <div key={sheet.slug} className="sheet-card">
              <h3 className="m-0 mb-2 text-base font-semibold">{sheet.name}</h3>
              <p className="text-[var(--muted)] text-sm">{sheet.description}</p>
              <div className="flex gap-2 flex-wrap mt-3">
                <span className="tag">Rows: {sheet.rows}</span>
                <span className="tag">Columns: {sheet.columns}</span>
              </div>
              <div className="mt-3.5">
                <Link href={`/sheets/${sheet.slug}`} className="btn primary">
                  View sheet
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
