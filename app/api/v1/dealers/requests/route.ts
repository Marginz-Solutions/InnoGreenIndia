import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const data = await prisma.dealer.findMany({
      where: {
        OR: [
          { status: "new" },
          {
            AND: [
              { status: "closed" },
              { submittedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            ]
          },
        ]
      }, include: { categories: { select: { id: true, name: true } } }, orderBy: { submittedAt: "desc" }
    });
    console.log("Fetched Dealers:", data); // Debug log
    return NextResponse.json({ data });
  }
  catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}

export async function POST(request: Request) {

  try {
    const body = await request.json();

    const {
      firmName,
      gstNumber,
      mobileNo,
      district,
      categoryInterest,
      monthlyVolume,
      status,
    } = body;

    // Basic validation
    if (!firmName || !gstNumber || !mobileNo || !district || !categoryInterest) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const data = await prisma.dealer.create({
      data: {
        firmName,
        gstNumber,
        mobileNo,
        district,
        categoryInterest,
        monthlyVolume: monthlyVolume || null,
        status: status || "new",
        submittedAt: new Date(),
      },
    }).then((dealer) => {
      return prisma.dealer.findUnique({
        where: { id: dealer.id },
        include: { categories: { select: { id: true, name: true } } },
      });
    });
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json(
      { error: err.message || "Failed to create dealer request" },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try{

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
   const data = await prisma.dealer.update({
      where: { id },
      data: updates,
      include: { categories: { select: { id: true, name: true } } },
    });
   
    return NextResponse.json({ data });
  }
  catch(err:any){
    return NextResponse.json(
      { error: err.message || "Failed to update dealer request" },
      { status: 400 }
    );
  }
}