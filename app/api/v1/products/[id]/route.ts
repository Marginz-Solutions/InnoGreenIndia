import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/auth";
import { extractStoragePath, rollbackUploads, uploadImage } from "../../brands/_upload";

// ─────────────────────────────────────────────────────────────
// GET SINGLE PRODUCT
// ─────────────────────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { id } = await params;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

// ─────────────────────────────────────────────────────────────
// UPDATE PRODUCT
// ─────────────────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } =
    await params;

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
    const existing =
      await prisma.product.findUnique({
        where: { id },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Product not found",
        },

        {
          status: 404,
        }
      );
    }

    const contentType =
  request.headers.get(
    "content-type"
  ) || "";

let body: any = {};

let formData:
  FormData | null = null;

// JSON request
if (
  contentType.includes(
    "application/json"
  )
) {
  body =
    await request.json();
}

// FormData request
else {
  formData =
    await request.formData();
}

    const image =
      formData?.get(
        "image"
      ) as File | null;

    let imageUrl =
      existing.imageUrl;

    // upload new image
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
        formData?.get("tags") ||
          "[]"
      )
    );

    const updated =
  await prisma.product.update({
    where: { id },

    data:
      contentType.includes(
        "application/json"
      )

        // JSON partial update
        ? {
            ...(body.featured !==
              undefined && {
              featured:
                body.featured,
            }),

            ...(body.is_active !==
              undefined && {
              isActive:
                body.is_active,
            }),
          }

        // FormData full update
        : {
            name: String(
              formData?.get(
                "name"
              )
            ),

            slug: String(
              formData?.get(
                "slug"
              )
            ),

            brandId:
              formData?.get(
                "brand_id"
              )
                ? String(
                    formData.get(
                      "brand_id"
                    )
                  )
                : null,

            categoryId:
              formData?.get(
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
                formData?.get(
                  "description"
                )
              ),

            shortDescription:
              String(
                formData?.get(
                  "short_description"
                )
              ),

            imageUrl,

            tags,

            isActive:
              formData?.get(
                "is_active"
              ) === "true",

            sku: String(
              formData?.get(
                "sku"
              )
            ),

            featured:
              formData?.get(
                "featured"
              ) === "true",

            status: String(
              formData?.get(
                "status"
              )
            ),
          },
  });

    // delete old image AFTER success
    if (
      image &&
      existing.imageUrl
    ) {
      const oldPath =
        extractStoragePath(
          existing.imageUrl,
          "brand-assets"
        );

      if (oldPath) {
        await supabase.storage
          .from(
            "brand-assets"
          )
          .remove([oldPath]);
      }
    }

    return NextResponse.json({
      data: {
        id: updated.id,

        name: updated.name,

        slug: updated.slug,

        brand_id:
          updated.brandId,

        category_id:
          updated.categoryId,

        description:
          updated.description,

        short_description:
          updated.shortDescription,

        image_url:
          updated.imageUrl,

        tags:
          updated.tags,

        is_active:
          updated.isActive,

        created_at:
          updated.createdAt,

        updated_at:
          updated.updatedAt,

        sku: updated.sku,

        featured:
          updated.featured,

        status:
          updated.status,
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

// ─────────────────────────────────────────────────────────────
// DELETE PRODUCT
// ─────────────────────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } =
    await params;

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

  try {
    const existing =
      await prisma.product.findUnique({
        where: { id },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    // delete image from storage
    if (existing.imageUrl) {
      const path =
        extractStoragePath(
          existing.imageUrl,
          "brand-assets"
        );

      if (path) {
        await supabase.storage
          .from(
            "brand-assets"
          )
          .remove([path]);
      }
    }

    // delete DB row
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}