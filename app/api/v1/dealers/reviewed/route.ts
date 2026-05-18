import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1"));
        const limit = Math.max(1, Number.parseInt(searchParams.get("limit") ?? "10"));
        const skip = (page - 1) * limit;

        const district = searchParams.get("district");
        const search = searchParams.get("search");
        const categoryId = searchParams.get("categoryId");
        const volume = searchParams.get("volume"); // e.g. "50 Tons" or partial

        const where: Prisma.DealerWhereInput = {
            AND: [
                { reviewedAt: { not: null } },

                ...(categoryId ? [{ categoryInterest: categoryId }] : []),

                ...(district
                    ? [{ district: { contains: district, mode: Prisma.QueryMode.insensitive } }]
                    : []),

                // ── volume=true  → has monthly volume
                // ── volume=false → no monthly volume
                // ── volume=null  → all
                ...(volume === "true"
                    ? [{ monthlyVolume: { not: null } }]
                    : volume === "false"
                        ? [{ monthlyVolume: null }]
                        : []),

                ...(search
                    ? [{
                        OR: [
                            { firmName: { contains: search, mode: Prisma.QueryMode.insensitive } },
                            { gstNumber: { contains: search, mode: Prisma.QueryMode.insensitive } },
                            { mobileNo: { contains: search, mode: Prisma.QueryMode.insensitive } },
                            { district: { contains: search, mode: Prisma.QueryMode.insensitive } },
                        ],
                    }]
                    : []),
            ],
        };

        const [data, total] = await prisma.$transaction([
            prisma.dealer.findMany({
                where,
                include: { categories: { select: { id: true, name: true } } },
                orderBy: { reviewedAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.dealer.count({ where }),
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
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Failed to fetch reviewed dealers" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {

    try {
        const { id } = await request.json();
        const data = await prisma.dealer.delete({
            where: {
                id
            }
        })
        console.log("Deleted Dealer:", data);
        return NextResponse.json({ data });

    }
    catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to delete dealer" }, { status: 500 });
    }

}