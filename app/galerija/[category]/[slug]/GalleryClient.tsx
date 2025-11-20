"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/lightbox";
import type { LightboxItem } from "@/components/ui/lightbox";

interface GalleryImage {
  filename: string;
  url: string;
}

interface GalleryClientProps {
  images: GalleryImage[];
}

export default function GalleryClient({ images }: GalleryClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);

  const openItem = (image: GalleryImage) => {
    setLightboxItem({ 
      type: 'image', 
      src: image.url, 
      title: image.filename.replace(/\.[^/.]+$/, "") // Remove file extension for title
    });
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <button
            key={image.filename}
            onClick={() => openItem(image)}
            className="group rounded-xl border border-stone-200 overflow-hidden bg-stone-50 hover:shadow-md transition-all text-left"
          >
            <div className="aspect-square bg-stone-100 relative">
              <Image 
                src={image.url} 
                alt={image.filename}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform"
              />
            </div>
          </button>
        ))}
      </div>

      <Lightbox 
        open={lightboxOpen} 
        onOpenChange={setLightboxOpen} 
        item={lightboxItem || undefined} 
      />
    </>
  );
}
