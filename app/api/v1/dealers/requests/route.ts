import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const last24Hours = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .or(`status.eq.new,and(status.eq.closed,submittedAt.gte.${last24Hours})`)
    .order("submittedAt", { ascending: false });

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
    updates.reviewedAt = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("dealers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}