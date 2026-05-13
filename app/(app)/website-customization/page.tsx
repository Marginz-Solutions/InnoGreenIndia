'use client';

import dynamic from 'next/dynamic';
import { AuthGuard } from '@/components/auth-guard';

const WebsiteCustomization = dynamic(
  () => import('@/components/website-customization/website-customization'),
  { ssr: false }
);

export default function WebsiteCustomizationPage() {
  return (
    <AuthGuard>
      <div className="">
        <WebsiteCustomization />
      </div>
    </AuthGuard>
  );
}