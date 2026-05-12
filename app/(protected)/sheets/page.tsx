import { Panel, SheetCard } from "@/components/ui";

const sheets = [
  {
    id: "read-me",
    title: "Read_Me",
    description:
      "Krishnagiri IGIM workbook with block-wise and representative village-wise planning sheets.",
    rows: 10,
    columns: 2,
  },
  {
    id: "block-master",
    title: "Block_Master",
    description:
      "Krishnagiri block-wise master. Soil-property fields are dominant block-level estimates.",
    rows: 10,
    columns: 20,
  },
  {
    id: "cluster-master",
    title: "Cluster_Master",
    description:
      "Krishnagiri true village cluster map master. Clustering is by production system, soil behavior, irrigation logic, crop pattern, and agri-input business relevance.",
    rows: 6,
    columns: 14,
  },
  {
    id: "village-master",
    title: "Village_Master",
    description:
      "Village-wise planning sheet for Krishnagiri. Values are inherited block-level generalizations for representative villages, not lab-test substitutes.",
    rows: 72,
    columns: 23,
  },
  {
    id: "village-cluster-map",
    title: "Village_Cluster_Map",
    description:
      "Krishnagiri village cluster map. Villages are clustered into real planning belts using block position, market linkage, soil type, irrigation pattern, and crop business system.",
    rows: 72,
    columns: 18,
  },
  {
    id: "cluster-opportunity",
    title: "Cluster_Opportunity",
    description:
      "Cluster-level scoring and business strategy for Krishnagiri village belts.",
    rows: 6,
    columns: 16,
  },
  {
    id: "cluster-map-view",
    title: "Cluster_Map_View",
    description:
      "Krishnagiri cluster view by block. This is a planning map, not a GIS polygon map.",
    rows: 10,
    columns: 8,
  },
  {
    id: "crop-cluster-matrix",
    title: "Crop_Cluster_Matrix",
    description:
      "Krishnagiri crop-cluster matrix: crop fit, input demand, risk, and product priority by practical village cluster",
    rows: 29,
    columns: 16,
  },
  {
    id: "cluster-product-priority",
    title: "Cluster_Product_Priority",
    description:
      "Krishnagiri cluster-wise priority product matrix for stocking, campaigns, and dealer focus",
    rows: 6,
    columns: 14,
  },
  {
    id: "crop-cluster-summary",
    title: "Crop_Cluster_Summary",
    description:
      "Krishnagiri crop-cluster summary dashboard for commercial focus",
    rows: 6,
    columns: 10,
  },
  {
    id: "igim-scoring",
    title: "IGIM_Scoring",
    description:
      "Formula-based IGIM scoring: higher soil/nutrient scores mean higher constraint/risk.",
    rows: 10,
    columns: 11,
  },
  {
    id: "village-scoring",
    title: "Village_Scoring",
    description:
      "Village-level IGIM scoring for representative Krishnagiri villages. Scores are inherited or lightly interpreted from block-level opportunity logic.",
    rows: 72,
    columns: 14,
  },
  {
    id: "soil-guide",
    title: "Soil_Guide",
    description:
      "Dominant soil-group guide used to interpret Krishnagiri block soils.",
    rows: 5,
    columns: 14,
  },
];

export default function SheetsPage() {
  return (
    <>
      <Panel>
        <h2 className="text-xl font-bold mb-2">IGIM planning sheets</h2>
        <p className="text-[#61756a]">
          Browse the operational workbook as branded web pages. Source-reference
          sheets have been removed from staff-facing navigation.
        </p>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {sheets.map((sheet) => (
          <SheetCard
            key={sheet.id}
            title={sheet.title}
            description={sheet.description}
            rows={sheet.rows}
            columns={sheet.columns}
            href={`/sheets/${sheet.id}`}
          />
        ))}
      </div>
    </>
  );
}
