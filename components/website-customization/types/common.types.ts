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

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface BrandContact {
  id: string;
  name: string;
  email?: string | null;
  phoneNo: string;
  whatsapp: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  logoUrl: string;
  imageUrl?: string | null;
  websiteUrl?: string | null;
  isActive: boolean;
  tags: string[];
  contactId?: string | null;
  contact?: BrandContact | null;
  categories: { id: string; name: string; slug: string }[];
  createdAt: string;
  updatedAt: string;
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
