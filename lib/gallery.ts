export interface GalleryFolder {
  title: string;
  slug: string;
  cover: string;
  description?: string;
  subtitle?: string;
}

export const galleryFolders: GalleryFolder[] = [
  // Bosnia and Herzegovina
  {
    title: "Genocid u Srebrenici",
    slug: "genocid-u-srebrenici",
    cover: "/images/gallery/srebrenica-1995/image-1.jpeg",
    subtitle: "Srebrenica 1995",
    description: "Sjećanje na žrtve genocida u Srebrenici."
  },
  {
    title: "Opsada Sarajeva",
    slug: "opsada-sarajeva",
    cover: "/images/gallery/opsada-sarajeva/cover.jpg",
    subtitle: "1992–1995",
    description: "Opsada glavnog grada BiH (1992–1995)."
  },
  {
    title: "Stari most",
    slug: "stari-most",
    cover: "/images/gallery/stari-most/cover.jpg",
    subtitle: "Mostar",
    description: "Rušenje i obnova Starog mosta u Mostaru."
  },
  
  // Region
  {
    title: "Vukovar 1991",
    slug: "vukovar-1991",
    cover: "/images/gallery/vukovar-1991/cover.jpg",
    subtitle: "Hrvatska",
    description: "Bitka za Vukovar u Hrvatskoj."
  }
];

export function getGalleryFolderBySlug(slug: string): GalleryFolder | undefined {
  return galleryFolders.find(folder => folder.slug === slug);
}

export function getAllGalleryFolders(): GalleryFolder[] {
  return galleryFolders;
}
