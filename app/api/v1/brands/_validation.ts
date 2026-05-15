import { z } from "zod";
import { ALLOWED_FILES, MAX_FILE_SIZE } from "@/lib/utils";

const fileSchema = z.instanceof(File)
    .refine(f => ALLOWED_FILES.includes(f.type), 'Must be jpg, jpeg, png, webp or svg')
    .refine(f => f.size <= MAX_FILE_SIZE, 'Must be under 2MB');

export const createBrandSchema = z.object({
    name: z
        .string('Brand name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be under 100 characters')
        .trim(),
    description: z.string().max(1000, 'Description must be under 1000 characters').trim().optional(),
    websiteUrl: z.url('Invalid URL format').optional().or(z.literal('')),
    tags: z.array(z
        .string()
        .max(50, 'Tag must be under 50 characters')
        .trim()).max(10, 'Maximum of 10 tags allowed').default([]),
    categoryIds: z.array(z.uuid('Invalid category ID format'))
        .min(1, 'At least one category must be selected')
        .max(10, 'Maximum of 10 categories allowed'),
    contact: z.object({
        name: z.string().min(2, 'Contact name is required').trim(),
        email: z.email('Invalid email address').optional().or(z.literal('')),
        phoneNo: z.string().regex(/^[0-9]{10}$/, 'Must be exactly 10 digits'),
        whatsapp: z.string().regex(/^[0-9]{10}$/, 'Must be exactly 10 digits'),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().regex(/^[0-9]{6}$/, 'Must be exactly 6 digits').optional().or(z.literal('')),
    }),
    isActive: z.boolean().optional(),
    logoFile: fileSchema,
    imageFile: fileSchema.optional().nullable(),
});

export const updateBrandSchema = createBrandSchema.omit({ logoFile: true, imageFile: true }).extend({
    logoFile: fileSchema.optional(),
    imageFile: fileSchema.optional().nullable(),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;