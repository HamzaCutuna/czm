"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { CalendarEvent } from "@/lib/calendar";
import EventCard from "./EventCard";

interface EventsCarouselProps {
  events: CalendarEvent[];
  onReadMore: (e: CalendarEvent) => void;
}

export default function EventsCarousel({ events, onReadMore }: EventsCarouselProps) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="relative">
      {/* Arrows */}
      <button
        ref={prevRef}
        aria-label="Prethodno"
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 focus-ring items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        ref={nextRef}
        aria-label="Sljedeće"
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 focus-ring items-center justify-center"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        onBeforeInit={(swiper) => {
          // @ts-expect-error: navigation types
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error: navigation types
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
      >
        {events.map((ev) => (
          <SwiperSlide key={String(ev.id)}>
            <EventCard event={ev} onReadMore={onReadMore} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}


