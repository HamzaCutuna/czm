"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type LightboxKind = 'image' | 'video' | 'audio';

export interface LightboxItem {
  type: LightboxKind;
  src: string;
  title?: string;
}

interface LightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: LightboxItem | null;
}

export function Lightbox({ open, onOpenChange, item }: LightboxProps) {
  // Prevent background scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 bg-black/90 border-0">
        <DialogTitle className="sr-only">
          {item?.title || `${item?.type || 'Media'} viewer`}
        </DialogTitle>
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {item?.type === 'image' && (
            <div className="relative w-full h-[80vh]">
              <Image
                src={item.src}
                alt={item.title || 'media'}
                fill
                className="object-contain rounded"
                sizes="100vw"
              />
            </div>
          )}
          {item?.type === 'video' && (
            <video src={item.src} controls className="max-h-[80vh] w-auto rounded" />
          )}
          {item?.type === 'audio' && (
            <audio src={item.src} controls className="w-full" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


