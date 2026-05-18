import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import { fetchAdminApi } from '@/hooks/admin-server-fetch';
import { CategoriesSection } from './CategoriesSection';
import type { Category } from '@/lib/global.types';

export default async function CategoriesPage() {
  const { data: categories } = await fetchAdminApi<{ data: Category[] }>(
    '/categories',
  );

  return (
    <section>
      <Breadcrumb section="Categories" />
      <CategoriesSection categories={categories ?? []} />
    </section>
  );
}