'use client';

import { useEffect } from 'react';
import PageError from '@/components/PageError';

const KPI_SHELLS = [
    { label: 'Total Products', icon: '📦' },
    { label: 'Brands',         icon: '🏷️' },
    { label: 'Categories',     icon: '🗂️' },
    { label: 'Featured',       icon: '⭐' },
];

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error('[Dashboard] Page error:', error);
    }, [error]);

    return (
        <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Overview of products, brands, Dealers and categories</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {KPI_SHELLS.map((k) => (
                    <div key={k.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-start justify-between gap-3 opacity-40">
                        <div>
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className="text-3xl font-semibold text-gray-200 leading-none">—</p>
                        </div>
                        <span className="text-2xl grayscale opacity-50">{k.icon}</span>
                    </div>
                ))}
            </div>

            <PageError 
                error={error} 
                reset={reset} 
                heading="Failed to load dashboard" 
                description="Something went wrong while fetching products, brands, and category data. This is usually temporary — try again or go back." 
            />
        </div>
    );
}
