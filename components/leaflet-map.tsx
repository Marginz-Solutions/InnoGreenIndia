'use client';

import { useEffect, useRef } from 'react';
import type { MapConfig } from '@/lib/map-data';

// Leaflet CSS must be imported in a client component
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  config: MapConfig;
  height?: string;
}

export default function LeafletMap({ config, height = '100%' }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: config.center,
        zoom: config.zoom,
        zoomControl: true,
      });
      mapRef.current = map;

      L.control.scale().addTo(map);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Polylines
      for (const pl of config.polylines) {
        L.polyline(pl.positions, {
          color: pl.color,
          weight: 4,
          opacity: 0.8,
        })
          .bindTooltip(`<div>${pl.tooltip}</div>`, { sticky: true })
          .addTo(map);
      }

      // Markers
      for (const m of config.markers) {
        let icon: import('leaflet').Icon | import('leaflet').DivIcon;

        if (m.icon === 'home') {
          // Red home marker using a simple styled divIcon
          icon = L.divIcon({
            className: '',
            html: `<div style="
              background:${m.color};color:white;border-radius:50% 50% 50% 0;
              width:30px;height:30px;line-height:30px;text-align:center;
              font-size:14px;border:2px solid white;transform:rotate(-45deg);
              box-shadow:0 2px 6px rgba(0,0,0,0.4);">
              <span style="display:block;transform:rotate(45deg);">⌂</span>
            </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -32],
          });
        } else if (m.icon === 'numbered' && m.number !== undefined) {
          icon = L.divIcon({
            className: '',
            html: `<div style="
              background:${m.color};color:white;border-radius:50%;
              width:28px;height:28px;line-height:28px;text-align:center;
              font-weight:bold;border:2px solid white;
              box-shadow:0 2px 6px rgba(0,0,0,0.4);">
              ${m.number}
            </div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -16],
          });
        } else {
          // Colored circle marker for cluster stops
          icon = L.divIcon({
            className: '',
            html: `<div style="
              background:${m.color};border-radius:50%;
              width:14px;height:14px;
              border:2px solid white;
              box-shadow:0 2px 6px rgba(0,0,0,0.4);">
            </div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            popupAnchor: [0, -10],
          });
        }

        L.marker(m.position, { icon })
          .bindPopup(`<div>${m.popup}</div>`, { maxWidth: 300 })
          .bindTooltip(`<div>${m.tooltip}</div>`, { sticky: true })
          .addTo(map);
      }

      // fitBounds
      if (config.fitBounds.length > 0) {
        map.fitBounds(config.fitBounds as [number, number][], { padding: [30, 30] });
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {config.legend && (
        <div
          dangerouslySetInnerHTML={{ __html: config.legend }}
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            width: 520,
            maxWidth: 'calc(100% - 40px)',
            zIndex: 1000,
            background: 'white',
            border: '2px solid #555',
            borderRadius: 8,
            padding: 10,
            fontSize: 13,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        />
      )}
    </div>
  );
}
