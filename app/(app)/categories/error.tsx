'use client';

import { useEffect } from 'react';
import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import PageError from '@/components/PageError';
import { ErrorProps } from '@/lib/global.types';

export default function CategoriesError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('[Categories] Page error:', error);
    }, [error]);

    return (
        <section>
            <Breadcrumb section="Categories" />
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#102018] mb-1">Categories</h1>
                    <p className="muted text-sm">Organize products with reusable category labels</p>
                </div>
            </div>
            <PageError 
                error={error} 
                reset={reset} 
                heading="Failed to load categories" 
                description="Something went wrong while fetching category data. This is usually temporary — try again or go back." 
            />
        </section>
    );
}
