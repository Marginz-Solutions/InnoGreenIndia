"use client";

import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/components/auth-provider";

export default function ClusterMapPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Topbar />
      <div className="container max-w-[1380px] mx-auto p-6">
        <div className="panel">
          <h2 className="m-0 mb-3 text-lg font-semibold">IGIM Cluster Route Map</h2>
          <p className="text-[var(--muted)]">Cluster beat map for grouped execution planning.</p>
        </div>
        <div className="map-frame mt-4">
          <iframe
            src="/raw-clustered-route-map.html"
            title="IGIM Cluster Route Map"
            className="w-full h-full border-0 rounded-[18px]"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
