"use client";

import type { CalendarEvent, CalendarCategory } from "@/lib/calendar";
import { cn } from "@/lib/utils";

function categoryBadge(cat: CalendarCategory) {
  const styles: Record<CalendarCategory, string> = {
    BiH: "bg-[#A7C7E7] text-white",
    Region: "bg-[#A8D5BA] text-white",
    Svijet: "bg-[#C19A6B] text-white",
  };
  return styles[cat];
}

interface EventCardProps {
  event: CalendarEvent;
  onReadMore: (e: CalendarEvent) => void;
}

export default function EventCard({ event, onReadMore }: EventCardProps) {
  const alt = event.title || event.shortText.split(/[.!?]/)[0] || "Događaj";

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm h-full flex flex-col">
      <div className="relative">
        {/* Category badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className={cn("px-2.5 py-1 text-xs rounded-full font-semibold shadow-sm border border-white/20", categoryBadge(event.category))}>
            {event.category}
          </span>
        </div>
        {/* Year chip */}
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2.5 py-1 text-xs rounded-full font-semibold bg-white/90 text-stone-800 border border-stone-200 shadow-sm">
            {event.year}
          </span>
        </div>
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={alt}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">Nema slike</div>
          )}
        </div>
      </div>
      <div className="mt-3 flex-1 flex flex-col">
        <p className="text-sm text-stone-700 line-clamp-4 flex-1">{event.shortText}</p>
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => onReadMore(event)}
            className="text-sm font-medium text-white bg-[--color-primary] hover:bg-[--color-primary]/90 px-4 py-2 rounded-full"
          >
            Saznaj više
          </button>
        </div>
      </div>
    </div>
  );
}


