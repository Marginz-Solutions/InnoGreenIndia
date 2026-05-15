import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabaese = await createClient();
    const { data, error } = await supabaese.from("admin_contact").select("*")

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data })
}

export async function PUT(request:Request) {

    const supabaese = await createClient();
    const body = await request.json();

    const {data,error} = await supabaese.from("admin_contact").update(body).eq("id", body.id).select().single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data })
    
}