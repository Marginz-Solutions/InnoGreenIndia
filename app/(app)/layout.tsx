'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AuthGuard } from '@/components/auth-guard';
import { MobileSidebar } from '@/components/website-customization/layout/MobileSidebar';
import { PageHeader } from '@/components/website-customization/layout/PageHeader';
import { Sidebar } from '@/components/website-customization/layout/Sidebar';
import { SidebarSection } from '@/components/website-customization/types/common.types';
import { Toaster } from "sonner";

const SECTION_PATHS: Record<SidebarSection, string> = {
  dashboard: '/dashboard',
  pulse: '/pulse',
  products: '/products',
  brands: '/brands',
  dealer: '/dealers',
  smartEnquiries: '/smart-enquiries',
  contacts: '/contacts',
  categories: '/categories',
};

const getSectionFromPathname = (pathname: string): SidebarSection => {
  if(pathname.startsWith('/dashboard')) return 'dashboard';
  if(pathname.startsWith('/brands')) return 'brands';
  if(pathname.startsWith('/contacts')) return 'contacts';
  if(pathname.startsWith('/dealers')) return 'dealer';
  if(pathname.startsWith('/smart-enquiries')) return 'smartEnquiries';
  if(pathname.startsWith('/products')) return 'products';
  if(pathname.startsWith('/pulse')) return 'pulse';
  if(pathname.startsWith('/categories')) return 'categories';
  return 'dashboard';
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/dashboard';
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activeSection = useMemo(() => getSectionFromPathname(pathname), [pathname]);

  const handleSectionChange = (section: SidebarSection) => {
    const href = SECTION_PATHS[section];
    router.push(href);
    setMobileSidebarOpen(false);
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f8fbf8]">
        <div className="hidden lg:block">
          <Sidebar
            active={activeSection}
            onChange={handleSectionChange}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((value) => !value)}
          />
        </div>

        <MobileSidebar
          open={mobileSidebarOpen}
          active={activeSection}
          onClose={() => setMobileSidebarOpen(false)}
          onChange={handleSectionChange}
        />

        <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
          <div className="p-4 lg:p-8 w-full max-w-[1400px] mx-auto">
            <PageHeader onMenuClick={() => setMobileSidebarOpen(true)} />
            
            <section className="card" style={{ minHeight: 'calc(100vh - 200px)' }}>
              {children}
            </section>
          </div>
        </main>
      </div>
      <Toaster richColors />
    </AuthGuard>
  );
}
