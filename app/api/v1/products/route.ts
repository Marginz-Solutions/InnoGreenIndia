import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma }
from "@/lib/prisma";
import { getAuthContext } from "@/lib/auth";
import { rollbackUploads, uploadImage } from "../brands/_upload";

export async function GET(
  request: NextRequest
) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const query =
      searchParams.get(
        "query"
      ) || "";

    const status =
      searchParams.get(
        "status"
      ) || "all";

    const featured =
      searchParams.get(
        "featured"
      ) || "all";

    const category =
      searchParams.get(
        "category"
      ) || "all";

    const page = Math.max(
      1,
      Number(
        searchParams.get("page") ||
          1
      )
    );

    const limit = Math.min(
      20,
      Number(
        searchParams.get(
          "limit"
        ) || 20
      )
    );

    const skip =
      (page - 1) * limit;

    const where: any = {
      ...(query && {
        OR: [
          {
            name: {
              contains:
                query,

              mode:
                "insensitive",
            },
          },

          {
            sku: {
              contains:
                query,

              mode:
                "insensitive",
            },
          },
        ],
      }),

      ...(status !==
        "all" && {
        status,
      }),

      ...(featured !==
        "all" && {
        featured:
          featured ===
          "yes",
      }),

      ...(category !==
        "all" && {
        categoryId:
          category,
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          sku: true,
          description: true,
          shortDescription: true,
          imageUrl: true,
          tags: true,
          isActive: true,
          featured: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          brandId: true,
          categoryId: true,
          quantity: true,
          quantityUnit: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);


    return NextResponse.json({
      data: products.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brand_id: p.brandId,
        category_id: p.categoryId,
        description: p.description,
        short_description: p.shortDescription,
        image_url: p.imageUrl,
        tags: p.tags ?? [],
        is_active: p.isActive,
        featured: p.featured,
        status: p.status,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
        quantity: p.quantity,
        quantity_unit: p.quantityUnit,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message,
      },

      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  const {
    supabase,
    user,
  } = await getAuthContext();

  if (!user) {
    return NextResponse.json(
      {
        error:
          "Unauthorized",
      },

      {
        status: 401,
      }
    );
  }

  const uploadedPaths:
    string[] = [];

  try {
    const formData =
      await request.formData();

    const image =
      formData.get(
        "image"
      ) as File | null;

    let imageUrl = "";

    // upload image
    if (image) {
      const uploaded =
        await uploadImage(
          image,
          "products",
          supabase
        );

      imageUrl =
        uploaded.url;

      uploadedPaths.push(
        uploaded.path
      );
    }

    const tags = JSON.parse(
      String(
        formData.get("tags") ||
          "[]"
      )
    );

    const product =
      await prisma.product.create({
        data: {
          name: String(
            formData.get("name")
          ),

          slug: String(
            formData.get("slug")
          ),

          brandId:
  formData.get(
    "brand_id"
  )
    ? String(
        formData.get(
          "brand_id"
        )
      )
    : null,

          categoryId:
  formData.get(
    "category_id"
  )
    ? String(
        formData.get(
          "category_id"
        )
      )
    : null,

          description:
            String(
              formData.get(
                "description"
              )
            ),

          shortDescription:
            String(
              formData.get(
                "short_description"
              )
            ),

          imageUrl,

          tags,

          isActive:
            formData.get(
              "is_active"
            ) === "true",

          sku: String(
            formData.get("sku")
          ),

          featured:
            formData.get(
              "featured"
            ) === "true",

          status: String(
            formData.get(
              "status"
            )
          ),

          quantity: Number(
            formData.get(
              "quantity"
            )
                    ),

          quantityUnit: String(
            formData.get(
              "quantity_unit"
            ) || ""
          ),
        },
      });

    return NextResponse.json({
      data: {
        id: product.id,

        name: product.name,

        slug: product.slug,

        brand_id:
          product.brandId,

        category_id:
          product.categoryId,

        description:
          product.description,

        short_description:
          product.shortDescription,

        image_url:
          product.imageUrl,

        tags:
          product.tags,

        is_active:
          product.isActive,

        created_at:
          product.createdAt,

        updated_at:
          product.updatedAt,

        sku: product.sku,

        featured:
          product.featured,

        status:
          product.status,

        quantity:
          (product as any).quantity,
        
        quantity_unit:
          (product as any).quantityUnit,
      },
    });
  } catch (error: any) {
    await rollbackUploads(
      uploadedPaths,
      "brand-assets",
      supabase
    );

    return NextResponse.json(
      {
        error:
          error.message,
      },

      {
        status: 500,
      }
    );
  }
}