import * as XLSX from "xlsx";

import {
    NextRequest,
    NextResponse,
} from "next/server";

import { prisma }
    from "@/lib/prisma";

import slugify from "slugify";

export async function POST(
    request: NextRequest
) {
    try {
        const formData =
            await request.formData();

        const file =
            formData.get(
                "file"
            ) as File;

        if (!file) {
            return NextResponse.json(
                {
                    error:
                        "File required",
                },
                {
                    status: 400,
                }
            );
        }

        const buffer =
            await file.arrayBuffer();

        const workbook =
            XLSX.read(buffer, {
                type: "buffer",
            });

        const sheet =
            workbook.Sheets[
            workbook.SheetNames[0]
            ];

        const rawRows =
            XLSX.utils.sheet_to_json(
                sheet
            );

        const rows = rawRows.map(
            (row: any) => {
                const normalized: any =
                    {};

                Object.keys(row).forEach(
                    (key) => {
                        normalized[
                            key
                                .trim()
                                .toLowerCase()
                                .replace(/\s+/g, "_")
                        ] = row[key];
                    }
                );

                return normalized;
            }
        );

        const created = [];
        const failed = [];

        for (const row of rows as any[]) {
            try {

                // ─── Required Fields Validation ─────────────────
                const requiredFields = [
                    "name",
                    "sku",
                    "brand",
                    "category",
                    "description",
                    "short_description",
                    "status",
                    "quantity",
                    "quantity_unit",
                ];

                const missingFields =
                    requiredFields.filter(
                        (field) =>
                            row[field] ===
                            undefined ||
                            row[field] ===
                            null ||
                            String(
                                row[field]
                            )
                                .trim()
                                .length === 0
                    );

                if (
                    missingFields.length > 0
                ) {
                    failed.push({
                        product:
                            row.name ||
                            "Unknown",

                        reason:
                            `Missing required fields: ${missingFields.join(", ")}`,
                    });

                    continue;
                }

                // ─── Status Validation ─────────────────────────
                const allowedStatuses = [
                    "active",
                    "inactive",
                ];

                if (
                    !allowedStatuses.includes(
                        String(
                            row.status
                        ).toLowerCase()
                    )
                ) {
                    failed.push({
                        product:
                            row.name,

                        reason:
                            `Invalid status "${row.status}"`,
                    });

                    continue;
                }

                // ─── Quantity Unit Validation ──────────────────
                const allowedUnits = [
                    "ml",
                    "l",
                    "g",
                    "kg",
                    "pcs",
                    "pack",
                ];

                if (
                    !allowedUnits.includes(
                        String(
                            row.quantity_unit
                        ).toLowerCase()
                    )
                ) {
                    failed.push({
                        product:
                            row.name,

                        reason:
                            `Invalid quantity unit "${row.quantity_unit}"`,
                    });

                    continue;
                }

                // ─── Check Duplicate SKU ───────────────────────
                const existingProduct =
                    await prisma.product.findUnique({
                        where: {
                            sku: String(
                                row.sku
                            ),
                        },
                    });

                if (existingProduct) {
                    failed.push({
                        product:
                            row.name,

                        reason:
                            `SKU "${row.sku}" already exists`,
                    });

                    continue;
                }

                // ─── Find Brand ────────────────────────────────
                const brand =
                    await prisma.brand.findFirst({
                        where: {
                            name: {
                                equals:
                                    String(
                                        row.brand
                                    ),
                                mode:
                                    "insensitive",
                            },
                        },
                    });

                // Brand required
                if (!brand) {
                    failed.push({
                        product:
                            row.name,

                        reason:
                            `Brand "${row.brand}" not found`,
                    });

                    continue;
                }

                // ─── Find/Create Category ─────────────────────
                let category =
                    await prisma.category.findFirst({
                        where: {
                            name: {
                                equals:
                                    String(
                                        row.category
                                    ),
                                mode:
                                    "insensitive",
                            },
                        },
                    });

                // Create category if not exists
                if (!category) {
                    category =
                        await prisma.category.create({
                            data: {
                                name:
                                    String(
                                        row.category
                                    ),

                                slug: slugify(
                                    String(
                                        row.category
                                    ),
                                    {
                                        lower: true,
                                        strict: true,
                                    }
                                ),
                            },
                        });
                }

                // ─── Safe Image URL Handling ──────────────────
                let imageUrl: string | null =
                    null;

                if (row.image_url) {
                    try {
                        const parsedUrl =
                            new URL(
                                String(
                                    row.image_url
                                )
                            );

                        const allowedExtensions = [
                            ".jpg",
                            ".jpeg",
                            ".png",
                            ".webp",
                            ".svg",
                        ];

                        const pathname =
                            parsedUrl.pathname.toLowerCase();

                        const isValidImage =
                            allowedExtensions.some(
                                (ext) =>
                                    pathname.endsWith(ext)
                            );

                        if (isValidImage) {
                            imageUrl =
                                parsedUrl.toString();
                        }
                    } catch {
                        imageUrl = null;
                    }
                }

                // ─── Create Product ───────────────────────────
                const product =
                    await prisma.product.create({
                        data: {
                            name: String(
                                row.name
                            ),

                            slug: slugify(
                                String(
                                    row.name
                                ),
                                {
                                    lower: true,
                                    strict: true,
                                }
                            ),

                            sku: String(
                                row.sku
                            ),

                            brandId:
                                brand.id,

                            categoryId:
                                category.id,

                            description:
                                row.description
                                    ? String(
                                        row.description
                                    )
                                    : null,

                            shortDescription:
                                row.short_description
                                    ? String(
                                        row.short_description
                                    )
                                    : null,

                            tags: row.tags
                                ? String(
                                    row.tags
                                )
                                    .split(",")
                                    .map((t) =>
                                        t.trim()
                                    )
                                    .filter(Boolean)
                                : [],

                            featured:
                                String(
                                    row.featured
                                ).toLowerCase() ===
                                "true",

                            status:
                                row.status
                                    ? String(
                                        row.status
                                    ).toLowerCase()
                                    : "active",

                            isActive: true,

                            quantity:
                                row.quantity
                                    ? Number(
                                        row.quantity
                                    )
                                    : null,

                            quantityUnit:
                                row.quantity_unit
                                    ? String(
                                        row.quantity_unit
                                    )
                                    : null,
                            imageUrl,
                        },
                    });

                created.push(product);

            } catch (err: any) {

                failed.push({
                    product:
                        row.name ||
                        "Unknown",

                    reason:
                        err.message,
                });
            }
        }

        return NextResponse.json({
            success: true,

            created:
                created.length,

            failed:
                failed.length,

            errors: failed,
        });

    } catch (error: any) {

        return NextResponse.json(
            {
                error:
                    error.message ||
                    "Import failed",
            },
            {
                status: 500,
            }
        );
    }
}