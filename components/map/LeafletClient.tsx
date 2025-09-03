"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-markercluster";

import type { GroupedPin } from '@/utils/geoGroup';
import { EventModal } from '@/components/hero/EventModal';
import type { NaDanasnjiDanResponseDogadaj } from '@/types/today';
import type { NormalizedEvent } from '@/lib/eventsSchema';
import { pickImageUrl } from '@/types/today';

export default function LeafletClient({
  pins, hmrKey,
}: { pins: GroupedPin[]; hmrKey: string }) {
  return (
    <MapContainer
      key={hmrKey}           // force remount in dev (Turbo HMR)
      center={[20, 0]}
      zoom={3}
      minZoom={2}
      maxZoom={6}
      maxBounds={[[-85, -180], [85, 180]]}
      maxBoundsViscosity={1.0}
      worldCopyJump={false}
      scrollWheelZoom
      doubleClickZoom
      zoomControl
      attributionControl={false}
      className="w-full h-full"
    >
      <SafeLayers pins={pins} />
    </MapContainer>
  );
}

// Convert NormalizedEvent to NaDanasnjiDanResponseDogadaj format
function convertToEventModalFormat(event: NormalizedEvent): NaDanasnjiDanResponseDogadaj {
  // Use preserved API fields if available, otherwise fallback to normalized fields
  const godina = event.godina || (event.dateISO ? new Date(event.dateISO).getFullYear() : new Date().getFullYear());
  const dan = event.dan || (event.dateISO ? new Date(event.dateISO).getDate() : 1);
  const opis = event.description || event.title || 'Nepoznato';
  const regija = event.regija || 'Svijet';
  const kategorija = event.kategorija || 'Historijski događaj';
  const slike = event.slike || null;
  
  return {
    id: parseInt(event.id) || 0,
    godina: godina,
    dan: dan,
    opis: opis,
    regija: regija,
    kategorija: kategorija,
    slike: slike,
    dokumenti: []
  };
}

function SafeLayers({ pins }: { pins: GroupedPin[] }) {
  const map = useMap();
  const [icon, setIcon] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<NaDanasnjiDanResponseDogadaj | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .leaflet-container { background: transparent !important; border-radius: 1rem; }
      .leaflet-popup-content-wrapper { background:#f4f1e8; border:2px solid #8b7355; border-radius:.5rem; }
      .leaflet-popup-content { color:#5d4e37; margin:.75rem; font-weight:500; }
      .leaflet-popup-tip { background:#f4f1e8; border:2px solid #8b7355; }
      .x-marker-icon { transition: transform .2s ease; }
      .x-marker-icon:hover { transform: scale(1.08); }
      .leaflet-control-zoom a { background:#f4f1e8; border:2px solid #8b7355; color:#5d4e37; font-weight:700; }
      .leaflet-control-zoom a:hover { background:#e9ded4; color:#4a3d2a; }
      
      /* Custom cluster styling */
      .custom-cluster-icon {
        background: transparent !important;
        border: none !important;
      }
      .cluster-marker {
        background: #5B2323;
        border: 3px solid #F7F2EA;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
      }
      .cluster-marker:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
      .cluster-count {
        color: #F7F2EA;
        font-weight: bold;
        font-size: 14px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
      }
      
      /* Popup improvements */
      .custom-popup .leaflet-popup-content-wrapper {
        background: #f4f1e8;
        border: 2px solid #8b7355;
        border-radius: 0.75rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
      }
      .custom-popup .leaflet-popup-content {
        margin: 0;
        padding: 0;
      }
      .custom-popup .leaflet-popup-tip {
        background: #f4f1e8;
        border: 2px solid #8b7355;
      }
      
      /* Ensure proper z-index layering */
      .leaflet-container {
        z-index: 1 !important;
        position: relative;
      }
      
      .leaflet-popup {
        z-index: 1000 !important;
      }
      
      .leaflet-control {
        z-index: 1000 !important;
      }
      
      /* Ensure EventModal appears above everything */
      .event-modal-overlay {
        z-index: 9999 !important;
        position: relative;
      }
      
      /* Ensure EventModal backdrop and content are above map */
      .event-modal-overlay [role="dialog"] {
        z-index: 10000 !important;
      }
      
      .event-modal-overlay .fixed {
        z-index: 10000 !important;
      }
      
      /* Line clamp utility */
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      /* Image marker styling */
      .image-marker {
        position: relative;
        width: 32px;
        height: 32px;
      }
      .image-marker-bg {
        background: #F7F2EA;
        border: 3px solid #5B2323;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        overflow: hidden;
      }
      .image-marker:hover .image-marker-bg {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
      .image-marker-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
      
      /* Grouped image marker styling */
      .grouped-image-marker {
        position: relative;
        width: 36px;
        height: 36px;
      }
      .grouped-image-marker-bg {
        background: #F7F2EA;
        border: 3px solid #5B2323;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        overflow: hidden;
        position: relative;
      }
      .grouped-image-marker:hover .grouped-image-marker-bg {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
      .grouped-image-marker-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        opacity: 0.8;
      }
      .grouped-image-marker-count {
        position: absolute;
        bottom: -2px;
        right: -2px;
        background: #5B2323;
        color: #F7F2EA;
        border: 2px solid #F7F2EA;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 10px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
      
      /* Grouped marker styling (fallback) */
      .grouped-marker {
        position: relative;
        width: 32px;
        height: 32px;
      }
      .grouped-marker-bg {
        background: #5B2323;
        border: 3px solid #F7F2EA;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
      }
      .grouped-marker:hover .grouped-marker-bg {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
      .grouped-marker-count {
        color: #F7F2EA;
        font-weight: bold;
        font-size: 14px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        font-family: 'Poppins', sans-serif;
      }
      
      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .cluster-marker {
          width: 35px;
          height: 35px;
        }
        .cluster-count {
          font-size: 12px;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          max-width: 280px;
        }
        .x-marker-icon {
          width: 20px !important;
          height: 20px !important;
        }
        .image-marker {
          width: 28px;
          height: 28px;
        }
        .image-marker-bg {
          width: 28px;
          height: 28px;
        }
        .grouped-image-marker {
          width: 32px;
          height: 32px;
        }
        .grouped-image-marker-bg {
          width: 32px;
          height: 32px;
        }
        .grouped-image-marker-count {
          width: 16px;
          height: 16px;
          font-size: 9px;
        }
        .grouped-marker {
          width: 28px;
          height: 28px;
        }
        .grouped-marker-bg {
          width: 28px;
          height: 28px;
        }
        .grouped-marker-count {
          font-size: 12px;
        }
      }
      
      @media (max-width: 480px) {
        .cluster-marker {
          width: 30px;
          height: 30px;
        }
        .cluster-count {
          font-size: 11px;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          max-width: 250px;
        }
        .image-marker {
          width: 24px;
          height: 24px;
        }
        .image-marker-bg {
          width: 24px;
          height: 24px;
        }
        .grouped-image-marker {
          width: 28px;
          height: 28px;
        }
        .grouped-image-marker-bg {
          width: 28px;
          height: 28px;
        }
        .grouped-image-marker-count {
          width: 14px;
          height: 14px;
          font-size: 8px;
        }
        .grouped-marker {
          width: 24px;
          height: 24px;
        }
        .grouped-marker-bg {
          width: 24px;
          height: 24px;
        }
        .grouped-marker-count {
          font-size: 11px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // resize guards
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      try { // guard na HMR
        if (map?.invalidateSize) map.invalidateSize(false);
      } catch {}
    });
    ro.observe(map.getContainer());
    // first paint
    setTimeout(() => {
      try { // guard
        if (map?.invalidateSize) map.invalidateSize(false);
      } catch {}
    }, 0);
    return () => ro.disconnect();
  }, [map]);

  // Helper function to get image URL from event
  const getEventImageUrl = (event: NormalizedEvent): string | null => {
    if (!event.slike) return null;
    const { url } = pickImageUrl(event.slike);
    return url || null;
  };

  // Create custom image-based icon for single events
  const createImageIcon = (event: NormalizedEvent) => {
    if (!L) return null;
    
    const imageUrl = getEventImageUrl(event);
    
    if (!imageUrl) {
      // Fallback to X marker if no image
      return L.icon({
        iconUrl: "/icons/x-marker.svg",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -10],
        className: "x-marker-icon",
      });
    }
    
    return L.divIcon({
      html: `
        <div class="image-marker">
          <div class="image-marker-bg">
            <img src="${imageUrl}" alt="Event image" class="image-marker-img" />
          </div>
        </div>
      `,
      className: 'custom-image-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  // Create custom image-based icon for grouped events
  const createGroupedImageIcon = (events: NormalizedEvent[], count: number) => {
    if (!L) return null;
    
    // Try to get the first available image from the events
    let imageUrl: string | null = null;
    for (const event of events) {
      const url = getEventImageUrl(event);
      if (url) {
        imageUrl = url;
        break;
      }
    }
    
    if (!imageUrl) {
      // Fallback to number-based grouped icon
      return L.divIcon({
        html: `
          <div class="grouped-marker">
            <div class="grouped-marker-bg">
              <span class="grouped-marker-count" style="font-family: 'Poppins', sans-serif;">${count}</span>
            </div>
          </div>
        `,
        className: 'custom-grouped-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
    }
    
    return L.divIcon({
      html: `
        <div class="grouped-image-marker">
          <div class="grouped-image-marker-bg">
            <img src="${imageUrl}" alt="Event image" class="grouped-image-marker-img" />
            <div class="grouped-image-marker-count">${count}</div>
          </div>
        </div>
      `,
      className: 'custom-grouped-image-icon',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  };

  // Load Leaflet and create icons
  useEffect(() => {
    import("leaflet").then((leaflet) => {
      const L = leaflet.default;
      setL(L);
      
      // Create single event icon (X marker)
      setIcon(L.icon({
        iconUrl: "/icons/x-marker.svg",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -10],
        className: "x-marker-icon",
      }));
    });
  }, []);

  return (
    <>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains={["a","b","c","d"]}
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        maxZoom={6}
        noWrap={true}
        keepBuffer={2}
      />
      {icon && L && (
        <>
          {pins.map((pin, index) => {
            const markerIcon = pin.eventCount > 1 
              ? createGroupedImageIcon(pin.events, pin.eventCount) 
              : createImageIcon(pin.events[0]);
            
            return (
              <Marker key={`pin_${index}`} position={[pin.lat, pin.lng]} icon={markerIcon}>
                <Popup maxWidth={350} className="custom-popup">
                  <div className="font-body p-2 max-h-96 overflow-y-auto">
                    {pin.eventCount > 1 && (
                      <div className="text-center mb-3">
                        <p className="text-sm text-stone-600 font-medium">
                          {pin.eventCount} događaja na ovoj lokaciji
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {pin.events.map((event) => (
                        <div key={event.id} className="border-b border-stone-200 pb-3 last:border-b-0 last:pb-0">
                          <div className="text-lg font-semibold text-stone-800 mb-2">
                            {event.dateISO && (
                              <span className="text-sm text-stone-500 block mb-1">
                                {new Date(event.dateISO).toLocaleDateString('bs-BA')}
                              </span>
                            )}
                            {(() => {
                              const title = event.description || event.title || 'Nepoznato';
                              const words = title.split(' ').slice(0, 4).join(' ');
                              return words + (title.split(' ').length > 4 ? '...' : '');
                            })()}
                          </div>
                          
                          {event.rawLocation && (
                            <div className="text-xs text-stone-500 mb-2 italic">
                              📍 {event.rawLocation}
                            </div>
                          )}
                          
                          <div className="text-sm text-stone-700 mb-3 line-clamp-3">
                            {event.description}
                          </div>
                          
                          <button
                            onClick={() => {
                              setSelectedEvent(convertToEventModalFormat(event));
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
                                       bg-white text-[#5B2323] border-2 border-[#5B2323] hover:bg-[#5B2323] hover:text-white 
                                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B2323] transition-all duration-200
                                       font-['Poppins'] font-semibold"
                          >
                            Detalji
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </>
      )}
      
      {/* Event Modal */}
      <div className="event-modal-overlay">
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      </div>
    </>
  );
}
