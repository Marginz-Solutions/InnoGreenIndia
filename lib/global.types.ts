export interface Category {
    id: string;
    name: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
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
    contacts?: BrandContact | null;
    categories: { id: string; name: string; slug: string }[];
    createdAt: string;
    updatedAt: string;
}

export interface PaginationType {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
}

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
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