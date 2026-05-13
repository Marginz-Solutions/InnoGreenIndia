'use client';

import dynamic from 'next/dynamic';
import { AuthGuard } from '@/components/auth-guard';
import { CLUSTER_MAP } from '@/lib/map-data';

const LeafletMap = dynamic(() => import('@/components/leaflet-map'), { ssr: false });

export default function ClusterMapPage() {
  return (
    <AuthGuard>
      <div className="container">
        <div className="panel">
          <h2>IGIM Cluster Route Map</h2>
          <p className="muted">Cluster beat map for grouped execution planning.</p>
        </div>
        <div style={{ marginTop: 18, height: '75vh', borderRadius: 12, overflow: 'hidden' }}>
          <LeafletMap config={CLUSTER_MAP} height="100%" />
        </div>
      </div>
    </AuthGuard>
  );
}

