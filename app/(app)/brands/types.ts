import { Brand, BrandContact, PaginationType } from "@/lib/global.types";

export type BrandsPageResponse = {
    data: Brand[];
    pagination: PaginationType;
}

export type FormState = {
  name: string;
  description: string;
  websiteUrl: string;
  tags: string[];
  categoryIds: string[];
  isActive: boolean;
  contact: Omit<Required<BrandContact>, 'id'> & { id?: string };
  logoFile: File | null;
  imageFile: File | null;
  logoPreview: string | null;
  imagePreview: string | null;
}