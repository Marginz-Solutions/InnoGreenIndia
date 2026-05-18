'use client';

import { useEffect } from 'react';
import { Breadcrumb } from '@/components/website-customization/shared/Breadcrumb';
import PageError from '@/components/PageError';
import { ErrorProps } from '@/lib/global.types';

export default function ContactsError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('[AdminContact] Page error:', error);
    }, [error]);

    return (
        <div className="min-h-screen">
            <Breadcrumb section="Contact" />
            <main className="max-w-[1280px] mx-auto px-7 py-10 pb-20">
                <div className="mb-9">
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Manage GPS coordinates, communication channels, and operational parameters for this command node.
                    </p>
                </div>
                <PageError 
                    error={error} 
                    reset={reset} 
                    heading="Failed to load contact data" 
                    description="Something went wrong while fetching this page. This is usually a temporary issue — try again or go back." 
                />
            </main>
        </div>
    );
}
