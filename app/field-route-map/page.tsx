"use client";

import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/components/auth-provider";

export default function FieldRouteMapPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Topbar />
      <div className="container max-w-[1380px] mx-auto p-6">
        <div className="panel">
          <h2 className="m-0 mb-3 text-lg font-semibold">IGIM Field Visit Route Map</h2>
          <p className="text-[var(--muted)]">Practical field visit order map for daily movement planning.</p>
        </div>
        <div className="map-frame mt-4">
          <iframe
            src="/raw-field-visit-route-map.html"
            title="IGIM Field Visit Route Map"
            className="w-full h-full border-0 rounded-[18px]"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
