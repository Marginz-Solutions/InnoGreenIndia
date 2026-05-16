import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all admin contacts
export async function GET() {
  try {
    const data = await prisma.adminContact.findMany();
    console.log("Admin Contacts:", data); // Debug log
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch" },
      { status: 500 }
    );
  }
}

// UPDATE admin contact
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const data = await prisma.adminContact.update({
      where: {
        id: body.id,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Update failed" },
      { status: 500 }
    );
  }
}