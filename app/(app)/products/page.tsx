import ProductsClient
  from "./ProductsClient";

import type {
  Product,
  Brand,
  Category,
} from "@/lib/global.types";

import {
  fetchAdminApi,
} from "@/hooks/admin-server-fetch";
import { ProductsPageResponse } from "./types";

export default async function Page() {
  const [
    productsPayload,
    brandsPayload,
    categoriesPayload,
  ] = await Promise.all([
    fetchAdminApi<ProductsPageResponse>(
      "/products?page=1&limit=20"
    ),

    fetchAdminApi<{
      data: Brand[];
    }>("/brands"),

    fetchAdminApi<{
      data: Category[];
    }>("/categories"),
  ]);

  const {
    data: products,
    pagination,
  } = productsPayload;

  const {
    data: brands,
  } = brandsPayload;

  const {
    data: categories,
  } = categoriesPayload;

  return (
    <ProductsClient
      initialProducts={
        products ?? []
      }

      initialPagination={
        pagination
      }

      brands={
        brands ?? []
      }

      categories={
        categories ?? []
      }
    />
  );
}