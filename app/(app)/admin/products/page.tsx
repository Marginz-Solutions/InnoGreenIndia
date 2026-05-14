import ProductsClient from "./ProductsClient";

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/products`,
    {
      cache: "no-store",
    }
  );

  const { data } = await res.json();

  return <ProductsClient initialProducts={data ?? []} />;
}