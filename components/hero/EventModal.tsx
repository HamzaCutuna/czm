"use client";

import { Fragment } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { X, Calendar, MapPin } from "lucide-react";
import { pickImageUrl } from "@/types/today";
import { absolutize } from "@/lib/http";
import type { NaDanasnjiDanResponseDogadaj } from "@/types/today";
import { cn } from "@/lib/utils";

interface EventModalProps {
  event: NaDanasnjiDanResponseDogadaj | null;
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
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

export function EventModal({ event, isOpen, onClose, selectedDate = new Date() }: EventModalProps) {
  if (!event) return null;

  const img = pickImageUrl(event.slike);
  const imageUrl = img.url ? absolutize(img.url) : undefined;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm text-left shadow-2xl transition-all w-full max-w-2xl mx-auto">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 rounded-full bg-white/80 hover:bg-white p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-offset-2"
                  aria-label="Zatvori modal"
                >
                  <X className="h-5 w-5 text-stone-600" />
                </button>

                {/* Image section */}
                {imageUrl ? (
                  <div className="relative h-64 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={img.alt || "Slika događaja"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="relative h-64 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                    <div className="text-center text-stone-500">
                      <div className="w-20 h-20 mx-auto mb-4 bg-stone-200 rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-3xl">📜</span>
                      </div>
                      <span className="text-lg font-medium">Nema slike</span>
                    </div>
                  </div>
                )}

                {/* Content section */}
                <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                  {/* Full Date */}
                  <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-stone-600" />
                      <span className="text-lg font-semibold text-stone-800">
                        {String(selectedDate.getDate()).padStart(2, '0')}.{String(selectedDate.getMonth() + 1).padStart(2, '0')}.{event.godina}.
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-stone-500" />
                        <span className={cn(
                          "text-sm px-3 py-1 rounded-full font-semibold shadow-md border border-white/20",
                          getRegionColor(event.regija)
                        )}>
                          {event.regija}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-stone max-w-none mb-6">
                    <p className="text-stone-700 leading-relaxed font-body">
                      {event.opis}
                    </p>
                  </div>

                  {/* Additional details if available */}
                  {event.kategorija && (
                    <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
                      <h4 className="text-sm font-semibold text-stone-600 mb-2">
                        Kategorija:
                      </h4>
                      <p className="text-stone-700 font-body">
                        {event.kategorija}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-end pt-4 border-t border-stone-200">
                    <button
                      onClick={onClose}
                      className="inline-flex items-center gap-2 bg-[--color-primary] hover:bg-[--color-primary]/90 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-offset-2"
                    >
                      Zatvori
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
