"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HeroToday } from "@/components/hero/HeroToday";
import HistoricalMap from "@/components/map/HistoricalMap";
import AboutUs from "@/components/about/AboutUs";
import LatestNews from "@/components/news/LatestNews";
import { todayInSarajevo } from "@/lib/tz";

export default function Home() {
  const today = todayInSarajevo();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, today.mjesec - 1, today.dan));

  return (
    <>
      <HeroToday 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <HistoricalMap 
        selectedDate={selectedDate}
      />
      {/* Daily Challenge teaser below the map */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="max-w-3xl mx-auto rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200 shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="text-left">
            <div className="text-stone-900 text-base sm:text-lg font-semibold leading-snug">Testiraj svoje znanje uz današnji izazov!</div>
            <div className="text-stone-600 text-sm mt-1">Pogodi godinu ili tačan odgovor i osvoji bodove.</div>
          </div>
          <Link
            href="/igre/dnevni-izazov"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[--color-primary] text-white text-sm font-medium hover:bg-[--color-primary]/90 transition-colors"
            aria-label="Igraj dnevni izazov"
          >
            Igraj sada
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <AboutUs />
      <LatestNews />
    </>
  );
}
