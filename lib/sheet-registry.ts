export interface SheetInfo {
  id: string;
  title: string;
  description: string;
  rows: number;
  columns: number;
}

export const SHEET_REGISTRY: SheetInfo[] = [
  {
    id: 'read-me',
    title: 'Read_Me',
    description: 'Krishnagiri IGIM workbook with block-wise and representative village-wise planning sheets.',
    rows: 10,
    columns: 2,
  },
  {
    id: 'block-master',
    title: 'Block_Master',
    description: 'Krishnagiri block-wise master. Soil-property fields are dominant block-level estimates.',
    rows: 10,
    columns: 20,
  },
  {
    id: 'cluster-master',
    title: 'Cluster_Master',
    description: 'Krishnagiri true village cluster map master. Clustering is by production system, soil behavior, irrigation logic, crop pattern, and agri-input business relevance.',
    rows: 8,
    columns: 7,
  },
  {
    id: 'village-master',
    title: 'Village_Master',
    description: 'Village-wise master with all relevant planning variables for Krishnagiri.',
    rows: 74,
    columns: 28,
  },
  {
    id: 'crop-cluster-matrix',
    title: 'Crop_Cluster_Matrix',
    description: 'Village-wise crops mapped to clusters for planning purposes.',
    rows: 74,
    columns: 4,
  },
  {
    id: 'crop-cluster-summary',
    title: 'Crop_Cluster_Summary',
    description: 'Summary of crop patterns by cluster for commercial planning.',
    rows: 8,
    columns: 5,
  },
  {
    id: 'cluster-opportunity',
    title: 'Cluster_Opportunity',
    description: 'Commercial opportunity analysis by cluster.',
    rows: 8,
    columns: 10,
  },
  {
    id: 'cluster-product-priority',
    title: 'Cluster_Product_Priority',
    description: 'Product priority ranking by cluster for stocking decisions.',
    rows: 8,
    columns: 8,
  },
  {
    id: 'village-scoring',
    title: 'Village_Scoring',
    description: 'Village-wise business scoring and prioritization.',
    rows: 74,
    columns: 12,
  },
  {
    id: 'igim-scoring',
    title: 'IGIM_Scoring',
    description: 'IGIM comprehensive scoring methodology.',
    rows: 15,
    columns: 6,
  },
  {
    id: 'soil-guide',
    title: 'Soil_Guide',
    description: 'Soil interpretation and management guide.',
    rows: 12,
    columns: 8,
  },
  {
    id: 'village-cluster-map',
    title: 'Village_Cluster_Map',
    description: 'Village to cluster mapping reference.',
    rows: 74,
    columns: 3,
  },
  {
    id: 'sources',
    title: 'Sources',
    description: 'Data sources and references.',
    rows: 8,
    columns: 3,
  },
];

export const CLUSTER_SUMMARY_DATA = [
  {
    cluster: 'Urban_Horticulture_Belt',
    villages: 8,
    crops: 'Vegetables, flowers, banana, mango',
    products: 'WSF, micronutrients, crop protection, drip accessories',
    bestCrops: 'Tomato, flowers, mixed vegetables',
    inputIntensity: 4.4,
    riskScore: 3.5,
    strategy: 'Advisory-led premium dealer',
    season: 'Round-year + flush campaigns',
    remarks: 'Fast-repeat, high-service cluster',
  },
  {
    cluster: 'Flower_Vegetable_Intensive_Belt',
    villages: 6,
    crops: 'Tomato, beans, brassicas, flowers',
    products: 'Crop protection, WSF, Ca-B, Zn-B, adjuvants',
    bestCrops: 'Tomato, flowers, beans, cabbage',
    inputIntensity: 4.5,
    riskScore: 3.6,
    strategy: 'Campaign + technical sales',
    season: 'Peak vegetable + flower windows',
    remarks: 'Highest crop-protection pull',
  },
  {
    cluster: 'Highland_Horticulture_Belt',
    villages: 10,
    crops: 'Vegetables, flowers, mango, pulses',
    products: 'WSF, micronutrients, organics, fungicides',
    bestCrops: 'Beans, brassicas, flowers',
    inputIntensity: 3.9,
    riskScore: 3.2,
    strategy: 'Specialty horticulture support',
    season: 'Cool-belt windows',
    remarks: 'Quality-focused, moderate market access',
  },
  {
    cluster: 'Mango_Orchard_Belt',
    villages: 18,
    crops: 'Mango, pulses, millets, groundnut',
    products: 'Micronutrients, orchard nutrition, biostimulants',
    bestCrops: 'Mango, intercrop pulses, groundnut',
    inputIntensity: 2.7,
    riskScore: 2.2,
    strategy: 'Seasonal orchard campaign',
    season: 'Pre-flowering to fruit development',
    remarks: 'Seasonal but strategic cluster',
  },
  {
    cluster: 'Mixed_Dryland_Belt',
    villages: 18,
    crops: 'Ragi, pulses, groundnut, millets',
    products: 'Basal fertilizers, seed treatment, herbicides',
    bestCrops: 'Millets, pulses, groundnut',
    inputIntensity: 2.7,
    riskScore: 2.3,
    strategy: 'Rainfed campaign-based',
    season: 'Kharif-focused',
    remarks: 'Price-sensitive, volume focus',
  },
  {
    cluster: 'Irrigated_Mixed_Belt',
    villages: 12,
    crops: 'Vegetables, maize, pulses, fodder',
    products: 'Balanced NPK, micronutrients, protection',
    bestCrops: 'Vegetables, maize',
    inputIntensity: 3.4,
    riskScore: 2.8,
    strategy: 'Balanced multi-crop dealer',
    season: 'Year-round with peaks',
    remarks: 'Diverse, stable demand',
  },
];

export const PRIORITY_BLOCKS = [
  {
    name: 'Hosur',
    score: 3.9,
    description: 'Mixed premium horticulture potential',
  },
  {
    name: 'Shoolagiri',
    score: 4.0,
    description: 'Excellent campaign block for vegetables and flowers',
  },
  {
    name: 'Kaveripattinam',
    score: 3.4,
    description: 'Balanced block for irrigated mixed business',
  },
  {
    name: 'Thally',
    score: 3.3,
    description: 'Selective specialty horticulture focus',
  },
];

// Derive KPI values from registry
export const KPI_VALUES = {
  sheets: SHEET_REGISTRY.length,
  clusters: 6,
  villages: 72,
  maps: 2,
};
