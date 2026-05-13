'use client';

import dynamic from 'next/dynamic';

import { useState } from 'react';

import { AuthGuard } from '@/components/auth-guard';
import { MobileSidebar } from '@/components/website-customization/layout/MobileSidebar';
import { PageHeader } from '@/components/website-customization/layout/PageHeader';
import { BrandsSection } from '@/components/website-customization/sections/BrandsSection';
import { ContactsSection } from '@/components/website-customization/sections/ContactSection';
import { DealerSection } from '@/components/website-customization/sections/DealerSection';
import { ProductsSection } from '@/components/website-customization/sections/ProductsSection';
import { PulseSection } from '@/components/website-customization/sections/PulseSection';
import { SidebarSection } from '@/components/website-customization/types/common.types';
import { Sidebar } from '@/components/website-customization/layout/Sidebar';


export default function WebsiteCustomizationPage() {
  const [section, setSection] = useState<SidebarSection>('pulse');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sectionMap: Record<SidebarSection, React.ReactNode> = {
    pulse: <PulseSection />,
    products: <ProductsSection />,
    brands: <BrandsSection />,
    dealer: <DealerSection />,
    contacts: <ContactsSection />,
  };

  const handleSectionChange = (s: SidebarSection) => {
    setSection(s);
    setMobileSidebarOpen(false);
  };

  return (
    <AuthGuard>
      <MobileSidebar
        open={mobileSidebarOpen}
        active={section}
        onClose={() => setMobileSidebarOpen(false)}
        onChange={handleSectionChange}
      />

      <div className="container">
        <PageHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        {/* Main layout: sidebar + content */}
        <div className="flex gap-5 items-start">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <Sidebar
              active={section}
              onChange={setSection}
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed((v) => !v)}
            />
          </div>

          {/* Content area */}
          <div className="flex-1 min-w-0">
            <div className="card" style={{ minHeight: 500 }}>
              {sectionMap[section]}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}