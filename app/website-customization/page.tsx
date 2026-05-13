'use client';

import dynamic from 'next/dynamic';
import { AuthGuard } from '@/components/auth-guard';
import { Topbar } from '@/components/topbar';
import { Footer } from '@/components/footer';

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