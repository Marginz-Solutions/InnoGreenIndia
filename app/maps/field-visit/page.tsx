'use client';

import { AuthGuard } from '@/components/auth-guard';
import { Topbar } from '@/components/topbar';
import { Footer } from '@/components/footer';

export default function FieldVisitMapPage() {
  return (
    <AuthGuard>
      <Topbar />
      <div className="container">
        <div className="panel">
          <h2>IGIM Field Visit Route Map</h2>
          <p className="muted">Practical visit-order route page for field staff execution planning.</p>
        </div>
        <div className="map-frame" style={{ marginTop: '18px' }}>
          <iframe
            src="/maps/raw-field-visit-route-map.html"
            title="IGIM Field Visit Route Map"
          />
        </div>
      </div>
      <Footer />
    </AuthGuard>
  );
}
