import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─────────────────────────────────────────────────────────────
// GET ALL PRODUCTS
// ─────────────────────────────────────────────────────────────
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

// ─────────────────────────────────────────────────────────────
// CREATE PRODUCT
// ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();

  const {
    name,
    slug,
    brandId,
    categoryId,
    description,
    shortDescription,
    imageUrl,
    tags,
    isActive,
    sku,
    featured,
    status,
  } = body;

  // Basic validation
  if (!name || !slug || !sku) {
    return NextResponse.json(
      {
        error: "name, slug and sku are required",
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name,
        slug,
        brandId,
        categoryId,
        description,
        shortDescription,
        imageUrl,
        tags,
        isActive,
        sku,
        featured,
        status,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}