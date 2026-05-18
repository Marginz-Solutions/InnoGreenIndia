'use client';

import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import ErrorBanner from '@/components/ErrorBanner';

export default function CategoriesError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <section>
            <Breadcrumb section="Categories" />
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#102018] mb-1">Categories</h1>
                    <p className="muted text-sm">Organize products with reusable category labels</p>
                </div>
            </div>
            <ErrorBanner error={error.message || 'Failed to load categories'} className="mb-4" />
            <button type="button" className="btn primary" onClick={reset}>Try again</button>
        </section>
    );
}
