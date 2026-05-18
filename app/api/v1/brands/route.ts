import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { getAuthContext } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { createBrandSchema } from "./_validation";
import { rollbackUploads, uploadImage } from "./_upload";

/**
 * @method GET /api/v1/admin/brands
 * @description Retrieve all brands based on the query, filter and paginations
 * @param {Object} query - Query parameters
 * @param {string} [query.search] - Search term to filter brands
 * @param {string} [query.status] - Filter by active status (active, inactive)
 * @param {string} [query.category] - Filter by category name
 * @param {string} [query.sort] - Field to sort by (name, created, etc.)
 * @param {number} [query.page] - Page number for pagination (default: 1)
 * @param {number} [query.limit] - Items per page (default: 10)
 */
export async function GET(request: NextRequest) {
    const { user } = await getAuthContext();

    if(!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const categoryId = searchParams.get('categoryId') || 'all';
    const sort = searchParams.get('sort') || 'createdAt';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));

    const where = {
        ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
        ...(status === 'active' && { isActive: true }),
        ...(status === 'inactive' && { isActive: false }),
        ...(categoryId !== 'all' && { brandCategories: { some: { categoryId } } }),
    };

    try {
        const [data, total] = await Promise.all([
            prisma.brand.findMany({
                where,
                include: {
                    contacts: {
                        select: {
                            id: true, name: true, email: true, phoneNo: true, whatsapp: true,
                            addressLine1: true, addressLine2: true, city: true, state: true, pincode: true,
                        },
                    },
                    brandCategories: {
                        include: { categories: { select: { id: true, name: true, slug: true } } },
                    }
                },
                orderBy: { [sort]: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.brand.count(),
            // prisma.brand.count({ where: { ...where, isActive: true } }),
            // prisma.brand.count({ where: { ...where, isActive: false } }),
        ]);
    
        const totalPages = Math.ceil(total / limit);
    
        const formattedData = data?.map((brand: any) => ({
            ...brand,
            categories: brand.brandCategories.map((bc: any) => bc.categories),
            brandCategories: undefined
        }))
    
        return NextResponse.json({
            data: formattedData,
            pagination: {
                total, page, limit, totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            }
        });
    }
    catch(error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}

/**
 * @method POST /api/v1/admin/brands
 * @description Create a new brand with the given details
 * @param {Object} body - Request body parameters
 * @param {string} body.name - Name of the brand to be created
 * @param {string} [body.description] - Optional description of the brand
 * @param {string} [body.website_url] - Optional URL for the brand's website
 * @param {string[]} [body.tags] - Optional array of tags associated with the brand
 * @param {string[]} [body.category_ids] - Optional category ID array to associate the brand with
 * @param {Object} [body.contact] - Contact information for the brand
 * @param {string} [body.contact.name] - Contact name
 * @param {string} [body.contact.email] - Optional contact email
 * @param {string} [body.contact.phone_no] - Contact phone number
 * @param {string} [body.contact.whatsapp] - Contact WhatsApp number
 * @param {string} [body.contact.address_line1] - Contact address line 1
 * @param {string} [body.contact.address_line2] - Optional Contact address line 2
 * @param {string} [body.contact.city] - Contact city
 * @param {string} [body.contact.state] - Contact state
 * @param {string} [body.contact.pincode] - Contact pincode
 * @returns {Object} The created brand object with its details
 */
export async function POST(request: NextRequest) {
    const { supabase, user } = await getAuthContext();

    if(!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    }
    catch(error: any) {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const rawInput = {
        name: formData.get('name') as string,
        description: formData.get('description') as string || '',
        websiteUrl: formData.get('websiteUrl') as string || '',
        tags: JSON.parse(formData.get('tags') as string || '[]'),
        categoryIds: JSON.parse(formData.get('categoryIds') as string || '[]'),
        contact: JSON.parse(formData.get('contact') as string || '{}'),
        isActive: formData.get('isActive') === 'true',
        logoFile: formData.get('logo') as File | null,
        imageFile: formData.get('image') as File | null,
    };

    const validatedResult = createBrandSchema.safeParse(rawInput);

    if(!validatedResult.success) {
        const fieldErrors: Record<string, string> = {};
        validatedResult.error.issues.forEach(issue => {
            const key = issue.path.join('.');
            if(!fieldErrors[key]) fieldErrors[key] = issue.message;
        });
        return NextResponse.json({ error: 'Validation failed', details: fieldErrors }, { status: 400 });
    }

    const { name, description, websiteUrl, tags, categoryIds, contact, logoFile, imageFile, isActive } = validatedResult.data;
    const slug = generateSlug(name);

    const uploadedPaths: string[] = [];
    try {
        const [logo, image] = await Promise.all([
            uploadImage(logoFile, 'logos', supabase),
            imageFile ? uploadImage(imageFile, 'banner-images', supabase) : Promise.resolve(null),
        ]);

        uploadedPaths.push(logo.path);
        if(image) {
            uploadedPaths.push(image.path);
        }

        // Inserting the other datas
        const brand = await prisma.$transaction(async (tx: any) => {
            // Inserting the contact details
            const newContact = await tx.contact.create({
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
                    createdAt: new Date(),
                },
            });

            // Inserting the brand details with the contact id
            const newBrand = await tx.brand.create({
                data: {
                    name, slug, description, websiteUrl: websiteUrl || null,
                    logoUrl: logo.url, imageUrl: image?.url ?? null,
                    tags, isActive, contactId: newContact.id,
                },
            });

            // Inserting the brand_categories,
            await tx.brandCategory.createMany({
                data: categoryIds.map((categoryId) => ({
                    brandId: newBrand.id,
                    categoryId
                }))
            })

            // Returning the result of the transaction
            return tx.brand.findUniqueOrThrow({
                where: { id: newBrand.id },
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
                },
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

        return NextResponse.json({ data: formatted }, { status: 201 });
    } 
    catch(error: any) {
        await rollbackUploads(uploadedPaths, 'brand-assets', supabase);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
