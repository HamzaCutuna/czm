"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";
import { fetchEventsByDate } from "@/lib/calendar";
import { CalendarEvent, CalendarCategory } from "@/lib/calendar";
import EventModal from "@/components/calendar/EventModal";
import { SolidNavbar } from "@/components/navbar/SolidNavbar";
import { TimelineJSComponent } from "@/components/timeline/TimelineJSComponent";

function VremenskaLinijaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CalendarCategory | 'Sve'>('Sve');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<CalendarEvent | null>(null);

  // Category counts
  const categoryCounts = {
    Sve: events.length,
    BiH: events.filter(e => e.category === 'BiH').length,
    Region: events.filter(e => e.category === 'Region').length,
    Svijet: events.filter(e => e.category === 'Svijet').length,
  };

  // Load data
  useEffect(() => {
    loadEvents();
  }, []);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'Sve') params.set('cat', selectedCategory);
    if (searchQuery) params.set('q', searchQuery);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/vremenska-linija${newUrl}`, { scroll: false });
  }, [selectedCategory, searchQuery, router]);

  // Filter events
  useEffect(() => {
    let filtered = events;

    // Category filter
    if (selectedCategory !== 'Sve') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.shortText.toLowerCase().includes(query) ||
        e.fullText.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(filtered);
  }, [events, selectedCategory, searchQuery]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load events for multiple dates to get a comprehensive dataset
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      const allEvents: CalendarEvent[] = [];
      for (const date of dates) {
        try {
          const dayEvents = await fetchEventsByDate(date);
          allEvents.push(...dayEvents);
        } catch (err) {
          console.warn(`Failed to load events for ${date}:`, err);
        }
      }

      // Remove duplicates based on id
      const uniqueEvents = allEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      );

      setEvents(uniqueEvents);
    } catch (err) {
      setError('Greška pri učitavanju događaja');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (event: CalendarEvent) => {
    setModalEvent(event);
    setModalOpen(true);
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setModalEvent(event);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SolidNavbar />
      <main className="min-h-dvh bg-stone-50 flex-1">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
              <Clock className="h-12 w-12 text-amber-700" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">
            Vremenska linija
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Hronološki pregled historijskih događaja.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Category Filter */}
            <div className="flex gap-2">
              {(['Sve', 'BiH', 'Region', 'Svijet'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? cat === 'BiH' ? 'bg-blue-100 text-blue-700' :
                        cat === 'Region' ? 'bg-green-100 text-green-700' :
                        cat === 'Svijet' ? 'bg-amber-100 text-amber-700' :
                        'bg-stone-100 text-stone-700'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                  <span className="ml-1 text-xs opacity-75">({categoryCounts[cat]})</span>
                </button>
              ))}
            </div>



            {/* Search */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Pretraži događaje..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 border border-stone-300 rounded text-sm w-48"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <style jsx global>{`
          .timeline-container {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          
          .tl-timeline {
            font-family: 'PT Sans', sans-serif;
          }
          
          .tl-timeline h1, .tl-timeline h2, .tl-timeline h3 {
            font-family: 'PT Sans', sans-serif;
          }
          
          .tl-slide {
            border-radius: 8px;
          }
          
          .tl-slide-content {
            border-radius: 8px;
          }
          
          .tl-timenav {
            background: linear-gradient(to right, #f5f5f4, #e7e5e4);
          }
          
          .tl-timenav-slider {
            background: #78716c;
          }
          
          .tl-timenav-slider-button {
            background: #d97706;
          }
          
          .tl-timenav-slider-button:hover {
            background: #b45309;
          }
        `}</style>
        {loading && (
          <div className="h-96 flex items-center justify-center">
            <div className="text-stone-500">Učitavanje...</div>
          </div>
        )}

        {error && (
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={loadEvents}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Pokušaj ponovo
            </button>
          </div>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <div className="h-96 flex items-center justify-center">
            <div className="text-stone-500">Nema događaja za odabrane kriterije.</div>
          </div>
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <div className="w-full">
            <TimelineJSComponent 
              events={filteredEvents}
              onEventSelect={handleEventSelect}
            />
          </div>
        )}
      </div>

      {/* Event Modal */}
      {modalEvent && (
        <EventModal
          event={modalEvent}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
      </main>
    </div>
  );
}

export default function VremenskaLinijaPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VremenskaLinijaPageContent />
    </Suspense>
  );
}
