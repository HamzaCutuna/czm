"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { normalizeApiResponse, type NormalizedEvent } from "@/lib/eventsSchema";
import { detectCountry } from "@/utils/countryDetector";
import { geocodeCountryOnce } from "@/utils/geocode";
import { groupByCoordinate } from "@/utils/geoGroup";
import sampleEvents from "@/data/sampleEvents";

const LeafletClient = dynamic(() => import("./LeafletClient"), { ssr: false });

interface HistoricalMapProps {
  selectedDate: Date;
}

function HistoricalMap({ selectedDate }: HistoricalMapProps) {
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<NormalizedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);
  const [coordinateStats, setCoordinateStats] = useState({
    withCoords: 0,
    viaCountry: 0,
    unresolved: 0
  });
  
  useEffect(() => setMounted(true), []);

  const hmrKey = useMemo(
    () => (process.env.NODE_ENV === "development" ? String(Date.now()) : "prod"),
    []
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setIsUsingSampleData(false);
      
      // Convert selected date to day/month format for the API
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      
      let json: unknown = null;
      try {
        const qs = new URLSearchParams({ dan: String(day), mjesec: String(month) });
        const res = await fetch(`/api/today-events?${qs.toString()}`, { cache: 'no-store' });
        if (res.ok) {
          json = await res.json();
          console.log('API response received:', json);
        } else {
          console.warn('API response not ok:', res.status, res.statusText);
        }
      } catch (err) {
        console.warn('API fetch failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      }
      
      if (!json) {
        json = { events: sampleEvents };
        setIsUsingSampleData(true);
        console.info('API unavailable; using sample events');
      }

      const normalized = normalizeApiResponse(json);

      // Resolve coordinates
      const resolved: NormalizedEvent[] = [];
      let withCoords = 0, viaCountry = 0, unresolved = 0;

      for (const ev of normalized) {
        if (typeof ev.lat === 'number' && typeof ev.lng === 'number') {
          withCoords++;
          resolved.push(ev);
          continue;
        }
        
        const hit = detectCountry([ev.rawLocation, ev.title, ev.description]);
        if (hit) {
          const pt = await geocodeCountryOnce(hit.name);
          if (pt) {
            viaCountry++;
            resolved.push({ ...ev, lat: pt.lat, lng: pt.lng });
            continue;
          }
        }
        unresolved++;
      }

      setCoordinateStats({ withCoords, viaCountry, unresolved });
      console.log('Coordinate resolution stats:', { withCoords, viaCountry, unresolved });
      
      if (unresolved > 0) {
        console.info(`Events without coordinates: ${unresolved}`);
      }
      
      setEvents(resolved);
      setLoading(false);
    })();
  }, [selectedDate]);

  const pins = useMemo(() => groupByCoordinate(events, 3), [events]);

  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 font-heading">
            Historijska Karta
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-body">
            Istražite svijet kroz interaktivnu mapu. Pogledajte događaje na današnji datum.
          </p>
          
          {/* Status indicators */}
          {loading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-stone-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-600" />
              Učitavanje događaja...
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-red-600 mb-2">
                Greška pri učitavanju događaja: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
              >
                Pokušaj ponovo
              </button>
            </div>
          )}
          
          {isUsingSampleData && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-yellow-700">
                Prikazuju se primjer događaja. API nije dostupan.
              </p>
            </div>
          )}
          
          
        </div>

        <div className="relative z-10">
          <div className="w-full h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] max-h-[600px] sm:max-h-[800px] rounded-2xl border border-neutral-300/60 shadow-lg overflow-hidden">
            {!mounted ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600" />
              </div>
            ) : (
              <LeafletClient pins={pins} hmrKey={hmrKey} />
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-base text-stone-600 font-medium font-body">
          Pritisnite na ikonu da pogledate detalje događaja. {pins.length > 0 && "Brojevi označavaju više događaja na istoj lokaciji."}
        </p>
      </div>
    </section>
  );
}

export default HistoricalMap;   // ⬅️ BITNO
