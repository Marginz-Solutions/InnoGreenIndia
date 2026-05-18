'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AuthGuard } from '@/components/auth-guard';
import { MobileSidebar } from '@/components/website-customization/layout/MobileSidebar';
import { PageHeader } from '@/components/website-customization/layout/PageHeader';
import { Sidebar } from '@/components/website-customization/layout/Sidebar';
import { SidebarSection } from '@/components/website-customization/types/common.types';
import { Toaster } from "sonner";
import { Topbar } from '@/components/topbar';

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
      <Topbar/>
      <MobileSidebar
        open={mobileSidebarOpen}
        active={activeSection}
        onClose={() => setMobileSidebarOpen(false)}
        onChange={handleSectionChange}
      />

      <div className="container">
        <PageHeader onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className="flex gap-5 items-start">
          <div className="hidden lg:block">
            <Sidebar
              active={activeSection}
              onChange={handleSectionChange}
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed((value) => !value)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <section className="card" style={{ minHeight: 500 }}>
              {children}
            </section>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </AuthGuard>
  );
}
