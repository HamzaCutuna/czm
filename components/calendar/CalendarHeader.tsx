"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { formatBosnianDate } from "@/lib/calendar";

interface CalendarHeaderProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onOpenPicker?: () => void;
}

export default function CalendarHeader({ date, onPrev, onNext, onOpenPicker }: CalendarHeaderProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-8">
      <div className="flex justify-center mb-3">
        <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
          <CalendarDays className="h-12 w-12 text-amber-700" />
        </div>
      </div>
      <h1 className="text-6xl font-bold text-stone-800 mb-1 font-heading tracking-wide text-center">Historijski kalendar</h1>
      <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed text-center">Pregled događaja po datumima i regijama.</p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          aria-label="Prethodni dan"
          onClick={onPrev}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 focus-ring"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          aria-label="Odaberi datum"
          onClick={onOpenPicker}
          className="px-4 py-2 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-sm md:text-base"
        >
          {formatBosnianDate(date)}
        </button>
        <button
          aria-label="Sljedeći dan"
          onClick={onNext}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 focus-ring"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}


