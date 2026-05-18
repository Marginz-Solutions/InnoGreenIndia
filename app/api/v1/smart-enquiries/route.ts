import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.max(1, Number.parseInt(searchParams.get("limit") ?? "20"));
    const skip = (page - 1) * limit;

    const status = searchParams.get("status");
    const senderType = searchParams.get("senderType");
    const district = searchParams.get("district");
    const categoryId = searchParams.get("categoryId");
    const brand = searchParams.get("brand");


    const search = searchParams.get("search");

    const where: Prisma.SmartEnquiryWhereInput = {
      ...(status && { status }),
      ...(senderType && { senderType }),
      ...(district && {
        district: {
          contains: district,
          mode: Prisma.QueryMode.insensitive,  // ← use enum, not string literal
        },
      }),
      ...(categoryId && { categoryId }),
      ...(brand && { brand }),
      ...(search && {
        OR: [
          { need: { contains: search, mode: "insensitive" } },
          { message: { contains: search, mode: "insensitive" } },
          { mobileNo: { contains: search, mode: "insensitive" } },
          { crop: { contains: search, mode: "insensitive" } },
          { district: { contains: search, mode: "insensitive" } },
        ],
      }),
    };


    const [data, total] = await prisma.$transaction([
      prisma.smartEnquiry.findMany({
        where,
        include: {
          brands: { select: { id: true, name: true, logoUrl: true } },
          categories: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.smartEnquiry.count({ where }),
    ]);

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch enquiries" },
      { status: 500 }
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

    if (status === "closed") {
      updates.closedAt = new Date().toISOString();
    }

    const data = await prisma.smartEnquiry.update({
      where: { id },
      data: updates,
      include: {
        categories: { select: { id: true, name: true } },
        brands: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update smart enquiry" },
      { status: 500 }
    );
  }
}