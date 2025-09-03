"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CategoryFilter from "@/components/calendar/CategoryFilter";
import EventsCarousel from "@/components/calendar/EventsCarousel";
import EventModal from "@/components/calendar/EventModal";
import EventCard from "@/components/calendar/EventCard";
import CustomDatePicker from "@/components/calendar/CustomDatePicker";
import { CalendarEvent, CalendarCategory, fetchEventsByDate } from "@/lib/calendar";
import { useRouter, useSearchParams } from "next/navigation";

type CategoryOrAll = CalendarCategory | 'Sve';

function KalendarPageContent() {
  const router = useRouter();
  const search = useSearchParams();

  const initialDate = (() => {
    const d = search.get('date');
    if (d) {
      const parsed = new Date(d);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  })();
  const initialCat = (search.get('cat') as CategoryOrAll) || 'Sve';

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOrAll>(initialCat);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<CalendarEvent | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const load = async (d: Date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventsByDate(d.toISOString());
      setEvents(data);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Greška pri učitavanju');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate.toDateString()]);

  // sync URL when date/category change
  useEffect(() => {
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const params = new URLSearchParams();
    params.set('date', dateStr);
    if (selectedCategory && selectedCategory !== 'Sve') params.set('cat', selectedCategory);
    router.replace(`/kalendar?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate.toDateString(), selectedCategory]);

  const counts = useMemo(() => {
    return {
      BiH: events.filter(e => e.category === 'BiH').length,
      Region: events.filter(e => e.category === 'Region').length,
      Svijet: events.filter(e => e.category === 'Svijet').length,
    } as Record<CalendarCategory, number>;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'Sve') return events;
    return events.filter(e => e.category === selectedCategory);
  }, [events, selectedCategory]);

  const onPrev = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };
  const onNext = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const handleReadMore = (ev: CalendarEvent) => {
    setModalEvent(ev);
    setModalOpen(true);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <CalendarHeader date={selectedDate} onPrev={onPrev} onNext={onNext} onOpenPicker={() => setPickerOpen(true)} />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[16rem,1fr] gap-6 md:gap-8 items-start">
        <div className={loading ? "opacity-70" : "opacity-100"}>
          <CategoryFilter value={selectedCategory} counts={counts} onChange={setSelectedCategory} />
        </div>

        <section>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => load(selectedDate)} className="px-3 py-1.5 rounded-md border border-red-300 text-red-800 hover:bg-red-100">Pokušaj ponovo</button>
            </div>
          )}
          {!error && loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-stone-200 bg-white p-3 animate-pulse">
                  <div className="aspect-[4/3] rounded-xl bg-stone-200" />
                  <div className="mt-3 space-y-2">
                    <div className="h-5 bg-stone-200 rounded w-2/3" />
                    <div className="h-4 bg-stone-200 rounded w-full" />
                    <div className="h-4 bg-stone-200 rounded w-5/6" />
                    <div className="h-8 bg-stone-200 rounded w-32" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!error && !loading && filteredEvents.length === 0 && (
            <div className="rounded-xl border border-stone-200 bg-white p-6 text-center text-stone-600">Nema događaja za odabrani datum/kategoriju.</div>
          )}
          {!error && !loading && filteredEvents.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(ev => (
                <EventCard key={String(ev.id)} event={ev} onReadMore={handleReadMore} />
              ))}
            </div>
          )}
        </section>
      </div>

      <EventModal open={modalOpen} event={modalEvent} onOpenChange={setModalOpen} />
              <CustomDatePicker open={pickerOpen} date={selectedDate} onOpenChange={setPickerOpen} onConfirm={(d) => setSelectedDate(d)} />
          </main>
    );
  }

export default function KalendarPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KalendarPageContent />
    </Suspense>
  );
}
