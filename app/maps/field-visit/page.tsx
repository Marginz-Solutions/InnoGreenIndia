'use client';

import dynamic from 'next/dynamic';
import { AuthGuard } from '@/components/auth-guard';
import { Topbar } from '@/components/topbar';
import { Footer } from '@/components/footer';
import { FIELD_VISIT_MAP } from '@/lib/map-data';

const LeafletMap = dynamic(() => import('@/components/leaflet-map'), { ssr: false });

export default function FieldVisitMapPage() {
  return (
    <AuthGuard>
      <Topbar />
      <div className="container">
        <div className="panel">
          <h2>IGIM Field Visit Route Map</h2>
          <p className="muted">Practical visit-order route page for field staff execution planning.</p>
        </div>
        <div style={{ marginTop: 18, height: '75vh', borderRadius: 12, overflow: 'hidden' }}>
          <LeafletMap config={FIELD_VISIT_MAP} height="100%" />
        </div>
      </div>
      <Footer />
    </AuthGuard>
  );
}
