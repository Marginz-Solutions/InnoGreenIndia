'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AuthGuard } from '@/components/auth-guard';
import { MobileSidebar } from '@/components/website-customization/layout/MobileSidebar';
import { PageHeader } from '@/components/website-customization/layout/PageHeader';
import { Sidebar } from '@/components/website-customization/layout/Sidebar';
import { SidebarSection } from '@/components/website-customization/types/common.types';

const SECTION_PATHS: Record<SidebarSection, string> = {
  pulse: '/admin/pulse',
  dashboard: '/admin/dashboard',
  products: '/admin/products',
  brands: '/admin/brands',
  dealer: '/admin/dealers',
  contacts: '/admin/contacts',
  categories: '/admin/categories',
};

const getSectionFromPathname = (pathname: string): SidebarSection => {
  if(pathname.startsWith('/admin/brands')) return 'brands';
  if(pathname.startsWith('/admin/dashboard')) return 'dashboard';
  if(pathname.startsWith('/admin/contacts')) return 'contacts';
  if(pathname.startsWith('/admin/dealers')) return 'dealer';
  if(pathname.startsWith('/admin/products')) return 'products';
  if(pathname.startsWith('/admin/pulse')) return 'pulse';
  if(pathname.startsWith('/admin/categories')) return 'categories';
  return 'pulse';
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/admin';
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
            <div className="card" style={{ minHeight: 500 }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
