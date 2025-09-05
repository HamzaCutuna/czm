"use client";

import { useState } from "react";
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
      <AboutUs />
      <LatestNews />
    </>
  );
}
