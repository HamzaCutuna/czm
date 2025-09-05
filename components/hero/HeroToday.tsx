"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTodayEvents } from "@/hooks/useTodayEvents";
import { TodaySwiper } from "./TodaySwiper";
import { todayInSarajevo } from "@/lib/tz";
import CustomDatePicker from "@/components/calendar/CustomDatePicker";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Helper function to format date
function formatBsDate(d: number, m: number) {
  return `${d}.${m}.`;
}

interface HeroTodayProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function HeroToday({ selectedDate, onDateChange }: HeroTodayProps) {
  const today = todayInSarajevo();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Convert selected date to day/month format for the API
  const selectedDay = selectedDate.getDate();
  const selectedMonth = selectedDate.getMonth() + 1;
  
  const { data, error, isLoading } = useTodayEvents(selectedDay, selectedMonth);
  
  // Use found date from API if available, otherwise use selected date
  const displayDate = data?.dogadajiDate && data.dogadajiDate.Dan && data.dogadajiDate.Mjesec ? 
    { dan: data.dogadajiDate.Dan, mjesec: data.dogadajiDate.Mjesec } : 
    { dan: selectedDay, mjesec: selectedMonth };

  const handleDateConfirm = (date: Date) => {
    onDateChange(date);
    setIsDatePickerOpen(false);
  };

  const handlePreviousDay = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  }, [selectedDate, onDateChange]);

  const handleNextDay = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  }, [selectedDate, onDateChange]);

  const handleToday = useCallback(() => {
    const today = todayInSarajevo();
    onDateChange(new Date(2024, today.mjesec - 1, today.dan));
  }, [onDateChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when no input/textarea is focused
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePreviousDay();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNextDay();
          break;
        case 'Home':
          event.preventDefault();
          handleToday();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePreviousDay, handleNextDay, handleToday]);

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

        {/* Date chip with navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center text-sm text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-3 border border-white/20"
        >
          {/* Previous button */}
          <button
            onClick={handlePreviousDay}
            className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors mr-2"
            title="Prethodni dan"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Date display */}
          <div
            className="flex items-center cursor-pointer hover:bg-white/10 rounded-full px-3 py-1 transition-colors"
            onClick={() => setIsDatePickerOpen(true)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              <strong>Datum:</strong> {formatBsDate(displayDate.dan, displayDate.mjesec)}
            </span>
          </div>

          {/* Next button */}
          <button
            onClick={handleNextDay}
            className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors ml-2"
            title="Sledeći dan"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Today button */}
          <button
            onClick={handleToday}
            className="ml-3 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-xs font-medium"
            title="Danas"
          >
            Danas
          </button>
        </motion.div>
      </div>

      {/* Date Picker Modal */}
      <CustomDatePicker
        open={isDatePickerOpen}
        date={selectedDate}
        onOpenChange={setIsDatePickerOpen}
        onConfirm={handleDateConfirm}
      />
    </section>
  );
}
