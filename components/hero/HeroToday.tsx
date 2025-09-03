"use client";

import { motion } from "framer-motion";
import { useTodayEvents } from "@/hooks/useTodayEvents";
import { TodaySwiper } from "./TodaySwiper";
import { todayInSarajevo } from "@/lib/tz";
import Image from "next/image";

// Helper function to format date
function formatBsDate(d: number, m: number) {
  return `${d}.${m}.`;
}

export function HeroToday() {
  const { data, error, isLoading } = useTodayEvents();
  const today = todayInSarajevo();
  
  // Use found date from API if available, otherwise use today
  const displayDate = data?.dogadajiDate && data.dogadajiDate.Dan && data.dogadajiDate.Mjesec ? 
    { dan: data.dogadajiDate.Dan, mjesec: data.dogadajiDate.Mjesec } : 
    today;

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Nav sentinel for navbar transparency detection */}
      <div id="nav-sentinel" className="absolute top-0 h-20 w-px" />
      
      {/* Background image with blur and overlay - extends to top */}
      <div className="absolute inset-0 z-0 -top-14">
        <Image
          src="/images/hero-image2.png"
          alt="Mostar Old Bridge"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg font-heading">
            Na današnji dan
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-body">
            Pregled događaja iz historije na današnji datum.
          </p>
        </motion.div>

        {/* Events Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          {error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-700 text-lg mb-2">
                  Greška pri učitavanju podataka
                </p>
                <p className="text-red-600 text-sm">
                  {String(error)}
                </p>
              </div>
            </div>
          ) : (
            <TodaySwiper
              events={data?.danasIstaknuto || []}
              isLoading={isLoading}
            />
          )}
        </motion.div>

        {/* Date chip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center text-sm text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20"
        >
          <span>
            <strong>Datum:</strong> {formatBsDate(displayDate.dan, displayDate.mjesec)}
          </span>
        </motion.div>
      </div>

      {/* Accessibility note for background image */}
      <div className="sr-only">
        Pozadinska slika: Stari most u Mostaru, Bosna i Hercegovina. Fotografija sa Pexels.
      </div>
    </section>
  );
}
