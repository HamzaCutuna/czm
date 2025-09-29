"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, A11y } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { pickImageUrl } from "@/types/today";
import { absolutize } from "@/lib/http";
import type { NaDanasnjiDanResponseDogadaj } from "@/types/today";
import { cn } from "@/lib/utils";
import { EventModal } from "./EventModal";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface TodaySwiperProps {
  events: NaDanasnjiDanResponseDogadaj[];
  isLoading?: boolean;
  selectedDate?: Date;
}

// Helper function to extract short title from opis
function shortTitle(opis: string, n = 110): string {
  // Remove leading dots, spaces, and other punctuation
  let cleaned = opis.replace(/^[.\s,;:!?]+/, '').trim();
  
  // If the cleaned text is too short, try to get more content
  if (cleaned.length < 20) {
    // Take first sentence or first part up to n characters
    const firstSentence = opis.length > 100 ? opis.slice(0, 100).trimEnd() + '…' : opis;
    cleaned = firstSentence.replace(/^[.\s,;:!?]+/, '').trim();
  }
  
  // If still too short, take more characters from the original
  if (cleaned.length < 20) {
    cleaned = opis.slice(0, n).replace(/^[.\s,;:!?]+/, '').trim();
  }
  
  return cleaned.length > n ? cleaned.slice(0, n).trimEnd() + "…" : cleaned;
}

// Helper function to get region color
function getRegionColor(regija: string): string {
  const colors = {
    'BiH': 'bg-[#A7C7E7] text-white',
    'Region': 'bg-[#C19A6B] text-white', 
    'Svijet': 'bg-[#A8D5BA] text-white',
    'default': 'bg-stone-400 text-white'
  };
  return colors[regija as keyof typeof colors] || colors.default;
}

export function TodaySwiper({ events, isLoading, selectedDate = new Date() }: TodaySwiperProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<NaDanasnjiDanResponseDogadaj | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center space-x-6 py-16">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "w-72 h-96 rounded-3xl border border-stone-200 bg-white/80 animate-pulse shadow-lg",
              i === 2 ? "scale-100" : "scale-90 opacity-70"
            )}
          >
            <div className="h-56 bg-stone-200 rounded-t-3xl" />
            <div className="p-6 space-y-4">
              <div className="h-5 bg-stone-200 rounded w-3/4" />
              <div className="h-4 bg-stone-200 rounded w-1/2" />
              <div className="h-4 bg-stone-200 rounded w-2/3" />
              <div className="h-10 bg-stone-200 rounded-full w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white/80 rounded-3xl p-8 max-w-md mx-auto shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 bg-stone-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-stone-700 text-lg font-body">
            Nema događaja za današnji datum.
          </p>
        </div>
      </div>
    );
  }

  // Event Card Component
  const EventCard = ({ event }: { event: NaDanasnjiDanResponseDogadaj }) => {
    const img = pickImageUrl(event.slike);
    const imageUrl = img.url ? absolutize(img.url) : undefined;

    const handleOpenModal = () => {
      setSelectedEvent(event);
      setIsModalOpen(true);
    };

    return (
      <div className="group relative w-72 h-[28rem] rounded-3xl border border-stone-200/50 bg-white/90 shadow-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-stone-300">
        {/* Image Container */}
        <div className="h-56 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={img.alt || "Slika događaja"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
              <div className="text-center text-stone-500">
                <div className="w-16 h-16 mx-auto mb-3 bg-stone-300 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-2xl">📜</span>
                </div>
                <span className="text-sm font-medium">Nema slike</span>
              </div>
            </div>
          )}
          
          {/* Region label - top-left corner */}
          <div className="absolute top-3 left-3">
            <span className={cn(
              "text-xs px-3 py-1 rounded-full font-semibold shadow-md border border-white/20",
              getRegionColor(event.regija)
            )}>
              {event.regija}
            </span>
          </div>
          
          {/* Year pill - top-right corner */}
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 text-stone-800 text-xs px-3 py-1 rounded-full font-semibold shadow-lg backdrop-blur-sm">
              {event.godina}
            </span>
          </div>

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col h-48">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-stone-800 leading-tight font-body line-clamp-4">
              {shortTitle(event.opis, 120)}
            </h3>
          </div>

          <div className="mt-auto pt-2">
            <button
              className="group/btn inline-flex items-center gap-2 bg-[--color-primary] hover:bg-[--color-primary]/90 text-white text-sm font-medium px-4 py-2.5 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-offset-2"
              onClick={handleOpenModal}
            >
              Saznaj više
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4">
      {/* Desktop Navigation Arrows */}
      <button 
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/80 hover:bg-white border border-stone-200 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm flex items-center justify-center" 
        onClick={() => swiper?.slidePrev()}
        disabled={events.length <= 3}
        aria-label="Prethodni događaj"
      >
        <ChevronLeft className="h-6 w-6 text-stone-700" />
      </button>
      
      <button 
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/80 hover:bg-white border border-stone-200 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm flex items-center justify-center" 
        onClick={() => swiper?.slideNext()}
        disabled={events.length <= 3}
        aria-label="Sljedeći događaj"
      >
        <ChevronRight className="h-6 w-6 text-stone-700" />
      </button>


      {/* Swiper Container */}
      <Swiper
        onSwiper={setSwiper}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        coverflowEffect={{
          rotate: 8,
          stretch: -20,
          depth: 150,
          modifier: 1.2,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '"></span>';
          },
        }}
        modules={[EffectCoverflow, Pagination, Navigation, A11y]}
        className="today-swiper py-16 pb-20"
        style={{
          "--swiper-pagination-color": "#4F8A5B",
          "--swiper-pagination-bullet-inactive-color": "#BFA48D",
          "--swiper-pagination-bullet-inactive-opacity": "0.6",
        } as React.CSSProperties}
      >
        {events.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="flex justify-center">
              <EventCard event={event} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        selectedDate={selectedDate}
      />
    </div>
  );
}
