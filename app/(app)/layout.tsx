'use client';

import type { ReactNode } from 'react';
import { Topbar } from '@/components/topbar';
import { Footer } from '@/components/footer';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Topbar />
      {children}
      <Footer />
    </>
  );
}

