import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { notEqual } from "assert";

export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.max(1, Number.parseInt(searchParams.get("limit") ?? "10"))
    const skip = (page - 1) * limit

    const status = searchParams.get("status")
    const categoryId = searchParams.get("categoryId")
    const search = searchParams.get("search")
    const district = searchParams.get("district")

   const statusCondition: Prisma.DealerWhereInput = status
  ? { status }
  : {
      OR: [
        { status: "new" },
        {
          AND: [
            { status: "closed" },

          ],
        },
      ]
    };

const where: Prisma.DealerWhereInput = {
  AND: [
    // ── Status condition ──────────────────────────────
    statusCondition,

    // ── Category filter ───────────────────────────────
    ...(categoryId ? [{ categoryInterest: categoryId }] : []),

    // ── District filter ───────────────────────────────
    ...(district
      ? [{ district: { contains: district, mode: Prisma.QueryMode.insensitive } }]
      : []),

    // ── Search ────────────────────────────────────────
    ...(search
      ? [
          {
            OR: [
              { firmName: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { gstNumber: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { mobileNo:  { contains: search, mode: Prisma.QueryMode.insensitive } },
              { district:  { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          },
        ]
      : []),
  ],
};

    const [data, total] = await prisma.$transaction([
      prisma.dealer.findMany({ where, include: { categories: { select: { id: true, name: true } } }, orderBy: { submittedAt: "desc" }, skip, take: limit }),
      prisma.dealer.count({ where })
    ])

    console.log("Fetched Dealers:", data);
   
    return NextResponse.json({
      data, meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  }
  catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}

export async function POST(request: NextRequest) {

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
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create dealer request" },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {

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
  catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update dealer request" },
      { status: 400 }
    );
  }
}