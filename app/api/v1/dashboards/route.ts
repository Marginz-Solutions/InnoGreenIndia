import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Define timeframe for 'recent' enquiries (e.g., last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      productStats,
      featuredCount,
      categories,
      brands,
      perCategoryRaw,
      perBrandRaw,
      allTagsRaw,
      dealers,
      enquiryStats,
      recentEnquiriesCount,
      enquiryTotal,
    ] = await Promise.all([
      prisma.product.groupBy({
        by: ["isActive"],
        _count: { _all: true },
      }),
      prisma.product.count({ where: { featured: true } }),
      prisma.category.findMany({ select: { id: true, name: true } }),
      prisma.brand.findMany({
        select: {
          id: true,
          name: true,
          isActive: true,
          logoUrl: true,
          description: true,
        },
      }),
      prisma.product.groupBy({ by: ["categoryId"], _count: { _all: true } }),
      prisma.product.groupBy({ by: ["brandId"], _count: { _all: true } }),
      prisma.product.findMany({ select: { tags: true } }),
      prisma.dealer.findMany({ include: { categories: true } }),

      // Fetch Enquiry counts grouped by status
      prisma.smartEnquiry.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      // Fetch 'Recent' count (New enquiries in last 7 days)
      prisma.smartEnquiry.count({
        where: {
          status: "new",
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      // Total enquiries
      prisma.smartEnquiry.count(),
    ]);

    // 1. Process Product Stats
    let totalProducts = 0;
    let activeProductsCount = 0;
    productStats.forEach((stat: any) => {
      totalProducts += stat._count._all;
      if (stat.isActive === true || stat.isActive === null) {
        activeProductsCount += stat._count._all;
      }
    });

    // 2. Process Enquiry Stats (Mapping status values)
    const enqMap = Object.fromEntries(
      enquiryStats.map((s: any) => [s.status, s._count._all]),
    );

    const enquiryMetrics = {
      total: enquiryTotal,
      opened: enqMap["new"] || 0, // "new" is considered "opened"
      reviewed: enqMap["reviewed"] || 0,
      closed: enqMap["closed"] || 0,
      recent: recentEnquiriesCount,
    };

    // 3. Helper Maps for Analytics
    const categoryMap = Object.fromEntries(
      categories.map((c: any) => [c.id, c.name]),
    );
    const brandMap = Object.fromEntries(brands.map((b: any) => [b.id, b.name]));

    // 4. Process Tags
    const tagCounts: Record<string, number> = {};
    allTagsRaw.forEach((p: any) =>
      p.tags?.forEach((t: string) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }),
    );

    return NextResponse.json({
      data: {
        metrics: {
          products: {
            total: totalProducts,
            active: activeProductsCount,
            featured: featuredCount,
          },
          brands: {
            total: brands.length,
            active: brands.filter((b: any) => b.isActive).length,
          },
          categories: {
            total: categories.length,
          },
          dealers: {
            total: dealers.length,
          },
          enquiries: enquiryMetrics,
        },
        analytics: {
          productsPerCategory: perCategoryRaw.map((item: any) => ({
            name: item.categoryId
              ? categoryMap[item.categoryId] || "Unknown"
              : "Uncategorized",
            count: item._count._all,
          })),
          productsPerBrand: perBrandRaw.map((item: any) => ({
            name: item.brandId
              ? brandMap[item.brandId] || "Unknown"
              : "No Brand",
            count: item._count._all,
          })),
          topTags: Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 12)
            .map(([tag, count]) => ({ tag, count })),
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
