"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CalendarEvent } from "@/lib/calendar";

interface EventModalProps {
  open: boolean;
  event: CalendarEvent | null;
  onOpenChange: (open: boolean) => void;
}

export default function EventModal({ open, event, onOpenChange }: EventModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white">
        {event && (
          <div className="bg-white">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 text-sm rounded-full font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                  {event.year}
                </span>
                <span className="px-3 py-1 text-sm rounded-full font-semibold bg-[--color-primary] text-white">
                  {event.category}
                </span>
              </div>
              <DialogTitle className="text-xl font-semibold text-stone-900 line-clamp-1">
                {event.title}
              </DialogTitle>
            </DialogHeader>
            {event.imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden bg-stone-100 max-h-96">
                <img src={event.imageUrl} alt={event.title} className="w-full h-auto object-cover max-h-96" />
              </div>
            )}
            <div className="mt-4 prose prose-stone max-w-none text-stone-800">
              <p>{event.fullText}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


