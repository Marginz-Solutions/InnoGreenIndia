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
      "/api/v1/products?page=1&limit=20"
    ),

    fetchAdminApi<{
      data: Brand[];
    }>("/api/v1/brands"),

    fetchAdminApi<{
      data: Category[];
    }>("/api/v1/categories"),
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