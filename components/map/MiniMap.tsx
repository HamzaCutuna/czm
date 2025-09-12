"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import React-Leaflet components (client-only)
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

interface MiniMapProps {
  lat: number;
  lng: number;
  title?: string;
}

export default function MiniMap({ lat, lng, title }: MiniMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-full h-64 rounded-xl border border-stone-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-600" />
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        center={[lat, lng]}
        zoom={6}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={true}
        attributionControl={false}
        className="w-full h-64 rounded-xl border border-stone-200"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={["a","b","c","d"]}
        />
        <Marker position={[lat, lng]}>
          {title && (
            <Popup>
              <div className="text-sm font-medium">{title}</div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}


