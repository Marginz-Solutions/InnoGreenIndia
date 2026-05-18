'use client';

import { useEffect } from 'react';
import { Plus } from 'lucide-react';

import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import PageError from '@/components/PageError';
import { ErrorProps } from '@/lib/global.types';

export default function ProductsError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('[Products] Page error:', error);
    }, [error]);

    return (
        <section>
            <Breadcrumb section="Products" />
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-[#102018] mb-1">Products</h1>
                    <p className="muted text-sm">Manage products displayed on the website</p>
                </div>
                <button disabled className="btn primary opacity-40 cursor-not-allowed">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            <PageError
                error={error}
                reset={reset}
                heading="Failed to load products"
                description="Something went wrong while fetching product data. This is usually temporary — try again or go back."
            />
        </section>
    );
}
