"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CalendarEvent } from "@/lib/calendar";

interface EventModalProps {
  open: boolean;
  event: CalendarEvent | null;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

export default function EventModal({ open, event, onOpenChange, selectedDate = new Date() }: EventModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white">
        {event && (
          <div className="bg-white">
            <DialogHeader>
              <DialogTitle className="sr-only">
                Historijski događaj - {String(selectedDate.getDate()).padStart(2, '0')}.{String(selectedDate.getMonth() + 1).padStart(2, '0')}.{event.year}.
              </DialogTitle>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-sm rounded-full font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                  {String(selectedDate.getDate()).padStart(2, '0')}.{String(selectedDate.getMonth() + 1).padStart(2, '0')}.{event.year}.
                </span>
                <span className="px-3 py-1 text-sm rounded-full font-semibold bg-[--color-primary] text-white">
                  {event.category}
                </span>
              </div>
            </DialogHeader>
            {event.imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden bg-stone-100 max-h-96 relative h-72">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="mt-4 prose prose-stone max-w-none text-stone-800 max-h-96 overflow-y-auto">
              <p>{event.fullText}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


