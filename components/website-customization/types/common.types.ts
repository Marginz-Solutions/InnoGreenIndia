export type SidebarSection =
| 'pulse'
| 'dashboard'
| 'products'
| 'brands'
| 'dealer'
| 'contacts'
| 'categories';

export interface PulseItem {
  id: string;
  title: string;
  price: number;
  unit: string;
  available: boolean;
  status: 'active' | 'draft';
  category: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
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

export interface Dealer {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  district: string;
  status: 'active' | 'inactive';
}

export interface ContactItem {
  id: string;
  label: string;
  type: 'email' | 'phone' | 'address' | 'social';
  value: string;
  platform?: string;
  primary: boolean;
}
