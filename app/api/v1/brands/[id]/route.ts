import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { updateBrandSchema } from "../_validation";
import { rollbackUploads, uploadImage, extractStoragePath } from "../_upload";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * @method PATCH /api/v1/admin/brands/[id]
 * @description Update an existing brand with the given ID
 * @param {string} id - ID of the brand to be updated
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
    const { id } = await context.params;
    const { supabase, user } = await getAuthContext();

    if(!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    }
    catch(error: any) {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    // Fetch existing brand (need current URLs for rollback + deletion)
    const existing = await prisma.brand.findUnique({
        where: { id },
        select: { id: true, logoUrl: true, imageUrl: true, contactId: true },
    });
    
    if(!existing) {
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const rawInput = {
        name: formData.get('name') as string,
        description: formData.get('description') as string || '',
        websiteUrl: formData.get('websiteUrl') as string || '',
        tags: JSON.parse(formData.get('tags') as string || '[]'),
        categoryIds: JSON.parse(formData.get('categoryIds') as string || '[]'),
        isActive: formData.get('isActive') === 'true',
        contact: JSON.parse(formData.get('contact') as string || '{}'),
        logoFile: formData.get('logo') as File || undefined,
        imageFile: formData.get('image') as File || undefined,
    };
    const removeImage = formData.get('removeImage') === 'true';

    const validatedResult = updateBrandSchema.safeParse(rawInput);

    if(!validatedResult.success) {
        const fieldErrors: Record<string, string> = {};
        validatedResult.error.issues.forEach(issue => {
            const key = issue.path.join('.');
            if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        });
        return NextResponse.json({ error: 'Validation failed', details: fieldErrors }, { status: 400 });
    }

    const { name, description, websiteUrl, tags, categoryIds, contact, logoFile, imageFile, isActive } = validatedResult.data;
    const slug = generateSlug(name);

    const uploadedPaths: string[] = [];
    const pathsToDelete: string[] = [];
    try {
        const [logo, image] = await Promise.all([
            logoFile instanceof File 
                ? uploadImage(logoFile, 'logos', supabase) 
                : Promise.resolve(null),
            imageFile instanceof File 
                ? uploadImage(imageFile, 'banner-images', supabase) 
                : Promise.resolve(null)
        ]);

        if(logo) {
            uploadedPaths.push(logo.path);
            const old = extractStoragePath(existing.logoUrl, 'brand-assets');
            if(old) pathsToDelete.push(old);
        }
        if(image) {
            uploadedPaths.push(image.path);
            if(removeImage && existing.imageUrl) {
                const old = extractStoragePath(existing.imageUrl, 'brand-assets');
                if(old) pathsToDelete.push(old);
            }
        }

        // Updating the related data
        const brand = await prisma.$transaction(async (tx: any) => {
            // Updating the brand details
            await tx.brand.update({
                where: { id },
                data: {
                    name, slug, description, websiteUrl: websiteUrl || null, tags,
                    ...(logo && { logoUrl: logo.url }),
                    ...(image && { imageUrl: image.url }),
                    ...(typeof isActive === 'boolean' && { isActive }),
                    ...(removeImage && !image && { imageUrl: null }),
                },
            });

            if(existing.contactId) {
                // Updating the contact details
                await tx.contact.update({
                    where: { id: existing.contactId },
                    data: {
                        name: contact.name,
                        email: contact.email || null,
                        phoneNo: contact.phoneNo,
                        whatsapp: contact.whatsapp,
                        addressLine1: contact.addressLine1 || null,
                        addressLine2: contact.addressLine2 || null,
                        city: contact.city || null,
                        state: contact.state || null,
                        pincode: contact.pincode || null,
                    },
                });
            }

            // Updating the brand_categories
            if(categoryIds.length > 0) {
                await tx.brandCategory.deleteMany({ where: { brandId: id } });
                await tx.brandCategory.createMany({
                    data: categoryIds.map(categoryId => ({ brandId: id, categoryId })),
                });
            }

            return tx.brand.findUniqueOrThrow({
                where: { id },
                include: {
                    contact: {
                        select: {
                            id: true, name: true, email: true, phoneNo: true, whatsapp: true,
                            addressLine1: true, addressLine2: true, city: true, state: true, pincode: true,
                        },
                    },
                    brandCategories: {
                        include: { categories: { select: { id: true, name: true, slug: true } } },
                    }
                }
            });
        }, { 
            timeout: 10000, 
            maxWait: 5000,
            isolationLevel: 'Serializable' 
        });

        const formatted = {
            ...brand,
            categories: brand.brandCategories.map((bc: any) => bc.categories),
            brandCategories: undefined,
        };

        // Clean up old storage files after successful DB update
        if(pathsToDelete.length > 0) {
            await rollbackUploads(pathsToDelete, 'brand-assets', supabase);
        }

        return NextResponse.json({ data: formatted }, { status: 201 });
    } 
    catch(error: any) {
        await rollbackUploads(uploadedPaths, 'brand-assets', supabase);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * @method DELETE /api/v1/admin/brands/[id]
 * @description Delete an existing brand with the given id
 * @param {string} id - id of the brand to be deleted
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
    const { id } = await context.params;
    const { supabase, user } = await getAuthContext();

    if(!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.brand.findUnique({
        where: { id },
        select: { logoUrl: true, imageUrl: true, contactId: true },
    });

    if(!existing) { 
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    };

    try {
        await prisma.$transaction(async (tx: any) => {
            await tx.brandCategory.deleteMany({ where: { brandId: id } });
            await tx.brand.delete({ where: { id } });
            await tx.product.deleteMany({ where: { brandId: id }});
            if(existing.contactId) {
                await tx.contact.delete({ where: { id: existing.contactId } });
            }
        });

        // Clean up storage files
        const paths = [
            extractStoragePath(existing.logoUrl, 'brand-assets'),
            existing.imageUrl ? extractStoragePath(existing.imageUrl, 'brand-assets') : null,
        ].filter(Boolean) as string[];

        if(paths.length > 0) {
            await rollbackUploads(paths, 'brand-assets', supabase);;
        }

        return NextResponse.json({ ok: true });
    } 
    catch(error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}