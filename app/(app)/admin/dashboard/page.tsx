// app/dashboard/page.tsx — Server Component
import { createClient } from "@/lib/supabase/server";
import ProductsDashboardClient from "./ProductsDashboardClient";

export type Product = {
    id: string;
    name: string;
    slug: string;
    brandId: string | null;
    categoryId: string | null;
    description: string | null;
    imageUrl: string | null;
    tags: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    sku: string | null;
    featured: boolean;
    status: string;
    shortDescription: string | null;
};

export type Category = {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
};

export type Brand = {
    id: string;
    name: string;
    slug: string | null;
    description: string | null;
    logo_url: string;
    image_url: string | null;
    website_url: string | null;
    tags: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

function ErrorCard({ message }: { message: string }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f5f0] p-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center max-w-sm w-full">
                <p className="text-sm font-semibold text-red-600 mb-1">Failed to load dashboard</p>
                <p className="text-xs text-red-400">{message}</p>
            </div>
        </div>
    );
}

export default async function DashboardPage() {
    const supabase = await createClient();

    const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        supabase.from("products").select("*").order("createdAt", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
        supabase.from("brands").select("*").order("name"),
    ]);

    const [enquiriesRes, reviewedRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dealers/requests`, {
            cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dealers/reviewed`, {
            cache: "no-store",
        }),
    ]);

    if (productsRes.error) return <ErrorCard message={productsRes.error.message} />;
    if (categoriesRes.error) return <ErrorCard message={categoriesRes.error.message} />;
    if (brandsRes.error) return <ErrorCard message={brandsRes.error.message} />;
    if (enquiriesRes.error) return <ErrorCard message={enquiriesRes.error.message} />;
    if (reviewedRes.error) return <ErrorCard message={reviewedRes.error.message} />;

    return (
        <ProductsDashboardClient
            products={productsRes.data ?? []}
            categories={categoriesRes.data ?? []}
            brands={brandsRes.data ?? []}
            enquiries={(await enquiriesRes.json()).data ?? []}
            dealers={(await reviewedRes.json()).data ?? []}
        />
    );
}