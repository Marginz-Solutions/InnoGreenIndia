import ProductsClient from "./ProductsClient";

export default async function Page() {
  const [productsRes, brandsRes, categoriesRes] =
    await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/products`,
        {
          cache: "no-store",
        }
      ),

      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/brands`,
        {
          cache: "no-store",
        }
      ),

      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/categories`,
        {
          cache: "no-store",
        }
      ),
    ]);

  const { data: products } = await productsRes.json();

  const { data: brands } = await brandsRes.json();

  const { data: categories } = await categoriesRes.json();

  return (
    <ProductsClient
      initialProducts={products ?? []}
      brands={brands ?? []}
      categories={categories ?? []}
    />
  );
}