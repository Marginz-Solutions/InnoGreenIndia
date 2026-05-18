import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const data = await prisma.dealer.findMany({
            where: { reviewedAt: { not: null } },
            include: { categories: { select: { id: true, name: true } } },
            orderBy: { reviewedAt: "desc" }
        })
        console.log("Fetched Reviewed Dealers:", data);

        return NextResponse.json({ data });
    }
    catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to fetch reviewed dealers" }, { status: 500 });
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