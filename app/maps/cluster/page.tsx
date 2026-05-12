'use client';

import { AuthGuard } from '@/components/auth-guard';
import { Topbar } from '@/components/topbar';
import { Footer } from '@/components/footer';

export default function ClusterMapPage() {
  return (
    <AuthGuard>
      <Topbar />
      <div className="container">
        <div className="panel">
          <h2>IGIM Cluster Route Map</h2>
          <p className="muted">Cluster beat map for grouped execution planning.</p>
        </div>
        <div className="map-frame" style={{ marginTop: '18px' }}>
          <iframe
            src="/maps/raw-clustered-route-map.html"
            title="IGIM Cluster Route Map"
          />
        </div>
      </div>
      <Footer />
    </AuthGuard>
  );
}
