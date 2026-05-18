'use client';

import { useEffect } from 'react';
import PageError from '@/components/PageError';
import { ErrorProps } from '@/lib/global.types';

export default function SmartEnquiriesError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('[SmartEnquiries] Page error:', error);
    }, [error]);

    return (
        <PageError 
            error={error} 
            reset={reset} 
            heading="Failed to load smart enquiries" 
            description="Something went wrong while fetching enquiry data. This is usually temporary — try again or go back." 
        />
    );
}
