'use client';

import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import ErrorBanner from '@/components/ErrorBanner';

export default function BrandsError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <section>
            <Breadcrumb section="Brands" />
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-[#102018] mb-1">Brands</h1>
                    <p className="muted text-sm">Manage brand partnerships and logos displayed on the website</p>
                </div>
            </div>
            <ErrorBanner error={error.message || 'Failed to load brands'} className="mb-4" />
            <button type="button" className="btn primary" onClick={reset}>Try again</button>
        </section>
    );
}