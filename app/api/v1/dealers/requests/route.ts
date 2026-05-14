import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const last24Hours = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("dealers")
    .select("*, categories:category_interest (id, name)")
    .or(`status.eq.new,and(status.eq.closed,submitted_at.gte.${last24Hours})`)
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json(
      { error: "id and status are required" },
      { status: 400 }
    );
  }

  if (!["new", "reviewed", "closed"].includes(status)) {
    return NextResponse.json(
      { error: "status must be new, reviewed or closed" },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = { status };


  if (status === "reviewed") {
    updates.reviewed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("dealers")
    .update(updates)
    .eq("id", id)
    .select(`*, categories:category_interest (id, name)`)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json();

    const {
      firm_name,
      gst_number,
      mobile_no,
      district,
      category_interest,
      monthly_volume,
      status,
    } = body;

    // Basic validation
    if (!firm_name || !gst_number || !mobile_no || !district || !category_interest) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("dealers")
      .insert([
        {
          firm_name,
          gst_number,
          mobile_no,
          district,
          category_interest,
          monthly_volume: monthly_volume || null,
          status: status || "new",
          submitted_at: new Date().toISOString(),
        },
      ])
      .select(`
    *,
    categories:category_interest (
      id,
      name
    )
  `)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}