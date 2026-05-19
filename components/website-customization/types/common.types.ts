export type SidebarSection =
| 'dashboard'
| 'pulse'
| 'products'
| 'brands'
| 'dealer'
| 'smartEnquiries'
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
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  category_id: string;
  quantity: number;
  quantity_unit: string;
  description: string;
  short_description: string;
  image_url?: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
