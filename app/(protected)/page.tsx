import {
  Panel,
  Card,
  KpiCard,
  Button,
  Tag,
  TableWrap,
  ListItem,
  SheetCard,
} from "@/components/ui";

const summaryData = [
  {
    cluster: "Urban_Horticulture_Belt",
    villages: 8,
    dominantCrops: "Vegetables, flowers, banana, mango",
    topProducts: "WSF, micronutrients, crop protection, drip accessories",
    bestCrops: "Tomato, flowers, mixed vegetables",
    avgIntensity: 4.4,
    avgScore: 3.5,
    channelStrategy: "Advisory-led premium dealer",
    prioritySeason: "Round-year + flush campaigns",
    remarks: "Fast-repeat, high-service cluster",
  },
  {
    cluster: "Flower_Vegetable_Intensive_Belt",
    villages: 6,
    dominantCrops: "Tomato, beans, brassicas, flowers",
    topProducts: "Crop protection, WSF, Ca-B, Zn-B, adjuvants",
    bestCrops: "Tomato, flowers, beans, cabbage",
    avgIntensity: 4.5,
    avgScore: 3.6,
    channelStrategy: "Campaign + technical sales",
    prioritySeason: "Peak vegetable + flower windows",
    remarks: "Highest crop-protection pull",
  },
  {
    cluster: "Highland_Horticulture_Belt",
    villages: 10,
    dominantCrops: "Vegetables, flowers, mango, pulses",
    topProducts: "WSF, micronutrients, organics, fungicides",
    bestCrops: "Beans, brassicas, flowers",
    avgIntensity: 3.9,
    avgScore: 3.2,
    channelStrategy: "Specialty horticulture support",
    prioritySeason: "Cool-belt windows",
    remarks: "Quality-focused, moderate market access",
  },
  {
    cluster: "Mango_Orchard_Belt",
    villages: 18,
    dominantCrops: "Mango, pulses, millets, groundnut",
    topProducts: "Micronutrients, orchard nutrition, biostimulants",
    bestCrops: "Mango, intercrop pulses, groundnut",
    avgIntensity: 2.7,
    avgScore: 2.2,
    channelStrategy: "Seasonal orchard campaign",
    prioritySeason: "Pre-flowering to fruit development",
    remarks: "Seasonal but strategic cluster",
  },
  {
    cluster: "Mixed_Dryland_Belt",
    villages: 18,
    dominantCrops: "Ragi, pulses, groundnut, millets",
    topProducts: "Basal fertilizers, seed treatment, herbicides",
    bestCrops: "Millets, pulses, groundnut",
    avgIntensity: 2.7,
    avgScore: 2.2,
    channelStrategy: "Value-volume dealer model",
    prioritySeason: "Rainfed pattam season",
    remarks: "Large coverage, lower ticket size",
  },
  {
    cluster: "Irrigated_Valley_Mixed_Belt",
    villages: 12,
    dominantCrops: "Paddy, sugarcane, vegetables, groundnut",
    topProducts: "Basal + WSF, micronutrients, crop protection",
    bestCrops: "Paddy, sugarcane, vegetables",
    avgIntensity: 3.6,
    avgScore: 2.9,
    channelStrategy: "Balanced intensive model",
    prioritySeason: "Monsoon + rabi windows",
    remarks: "Broader input portfolio needed",
  },
];

const priorityBlocks = [
  {
    name: "Hosur",
    score: "3.9 dealer opportunity",
    description: "Mixed premium horticulture potential",
  },
  {
    name: "Shoolagiri",
    score: "4.0 dealer opportunity",
    description: "Excellent campaign block for vegetables and flowers",
  },
  {
    name: "Kaveripattinam",
    score: "3.4 dealer opportunity",
    description: "Balanced block for irrigated mixed business",
  },
  {
    name: "Thally",
    score: "3.3 dealer opportunity",
    description: "Selective specialty horticulture focus",
  },
];

export default function DashboardPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 mb-5">
        <Panel dark>
          <h2 className="text-xl font-bold mb-3">
            Branded IGIM operational command center
          </h2>
          <p className="text-white/90 mb-3">
            This web app is structured for daily field execution, retail
            territory planning, and management review. Teams can browse planning
            sheets, open route maps, review commercial clusters, and use the
            portal as a single branded IGIM workspace.
          </p>
          <div className="flex gap-2 flex-wrap mt-3">
            <Tag>Field staff</Tag>
            <Tag>Retail planning</Tag>
            <Tag>Management review</Tag>
            <Tag>IGIM branded</Tag>
          </div>
          <div className="flex gap-3 flex-wrap mt-5">
            <Button href="/sheets" variant="primary">
              Open planning sheets
            </Button>
            <Button href="/cluster-map">Open clustered route map</Button>
            <Button href="/field-route-map">Open field route map</Button>
          </div>
        </Panel>

        <Panel>
          <h2 className="text-xl font-bold mb-3">Management quick view</h2>
          <div className="grid gap-3">
            <ListItem title="Daily use">
              Field staff can search every planning sheet and export filtered
              views to CSV.
            </ListItem>
            <ListItem title="Retail planning">
              Cluster opportunity and product-priority views support stocking
              and campaign decisions.
            </ListItem>
            <ListItem title="Beat execution">
              Cluster and visit-route maps are available in branded portal
              pages.
            </ListItem>
          </div>
        </Panel>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-5">
        <KpiCard label="Planning sheets" value={13} />
        <KpiCard label="Commercial clusters" value={6} />
        <KpiCard label="Mapped villages" value={72} />
        <KpiCard label="Operational maps" value={2} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Summary Table */}
        <Card className="lg:col-span-8">
          <h2 className="text-xl font-bold mb-2">Cluster commercial summary</h2>
          <p className="text-[#61756a] mb-4">
            Quick management view of commercial focus by cluster.
          </p>
          <TableWrap>
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
                {summaryData.map((row) => (
                  <tr key={row.cluster}>
                    <td>{row.cluster}</td>
                    <td>{row.villages}</td>
                    <td>{row.dominantCrops}</td>
                    <td>{row.topProducts}</td>
                    <td>{row.bestCrops}</td>
                    <td>{row.avgIntensity}</td>
                    <td>{row.avgScore}</td>
                    <td>{row.channelStrategy}</td>
                    <td>{row.prioritySeason}</td>
                    <td>{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Card>

        {/* Priority Blocks */}
        <Card className="lg:col-span-4">
          <h2 className="text-xl font-bold mb-3">Priority action blocks</h2>
          <div className="grid gap-3">
            {priorityBlocks.map((block) => (
              <ListItem key={block.name} title={block.name} badge={block.score}>
                {block.description}
              </ListItem>
            ))}
          </div>
        </Card>

        {/* Quick Navigation */}
        <Card className="lg:col-span-12">
          <h2 className="text-xl font-bold mb-4">Quick navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SheetCard
              title="Planning Sheets"
              description="Open all sheet pages converted from the workbook for search and export."
              href="/sheets"
            />
            <SheetCard
              title="Cluster Route Map"
              description="Branded route page for cluster-based field movement and beat planning."
              href="/cluster-map"
            />
            <SheetCard
              title="Field Visit Route Map"
              description="Practical visit-order route page for field staff execution planning."
              href="/field-route-map"
            />
          </div>
        </Card>
      </div>
    </>
  );
}
