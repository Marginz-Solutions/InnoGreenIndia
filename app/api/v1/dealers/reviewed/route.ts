import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();

 const { data, error } = await supabase
  .from("dealers")
  .select(`
    *,
    categories:category_interest (
      id,
      name
    )
  `)
  .not("reviewed_at", "is", null)
  .order("reviewed_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log(data);
    return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
    const supabase = await createClient();

    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    console.log("Deleting dealer with id:", id); // 👈 Debug log

    const { error } = await supabase
        .from("dealers")
        .delete()
        .eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}