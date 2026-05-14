// ─── Product Entity ────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sku: string;
  featured: boolean;
  status: 'active' | 'inactive';
}

// ─── Filter State ──────────────────────────────────────────────────────────────
export interface ProductFilters {
  query: string;
  category: string;
  status: 'all' | 'active' | 'inactive';
  featured: 'all' | 'yes' | 'no';
}

// ─── Brand / Category lookup ───────────────────────────────────────────────────
export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}