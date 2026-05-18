import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import type { Category } from '@/lib/global.types';
import { fetchAdminApi } from '@/hooks/admin-server-fetch';
import { BrandSection } from './BrandSection';
import { BrandsPageResponse } from './types';

export default async function BrandsPage() {
  const [brandsPayload, categoriesPayload] = await Promise.all([
    fetchAdminApi<BrandsPageResponse>('/api/v1/brands?page=1&limit=12'),
    fetchAdminApi<{ data: Category[] }>('/api/v1/categories'),
  ]);

  const { data: items, pagination } = brandsPayload;
  const { data: categories } = categoriesPayload;

  return (
    <section>
      <Breadcrumb section="Brands" />
      <BrandSection
        initialItems={items ?? []}
        initialPagination={pagination}
        categories={categories ?? []}
      />
    </section>
  );
}
