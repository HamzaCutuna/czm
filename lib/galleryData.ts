export interface GalleryEvent {
  slug: string;
  title: string;
  description: string;
  subtitle?: string;
  coverImage?: string;
}

export interface GalleryCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  coverImage?: string;
  events: GalleryEvent[];
}

export const galleryCategories: GalleryCategory[] = [
  {
    id: 'bih',
    title: 'BiH',
    description: 'Historijski događaji u Bosni i Hercegovini',
    icon: '🏛️',
    coverImage: '/images/gallery/srebrenica-1995/image-1.jpeg',
    events: [
      {
        slug: 'srebrenica-1995',
        title: 'Srebrenica 1995',
        description: 'Genocid u Srebrenici',
        subtitle: '1995',
        coverImage: '/images/gallery/srebrenica-1995/image-1.jpeg'
      },
      {
        slug: 'opsada-sarajeva',
        title: 'Opsada Sarajeva',
        description: 'Opsada glavnog grada BiH (1992–1995)',
        subtitle: '1992–1995',
        coverImage: '/images/gallery/opsada-sarajeva/cover.jpg'
      },
      {
        slug: 'stari-most',
        title: 'Stari most',
        description: 'Rušenje i obnova Starog mosta u Mostaru',
        subtitle: 'Mostar',
        coverImage: '/images/gallery/stari-most/cover.jpg'
      }
    ]
  },
  {
    id: 'region',
    title: 'Region',
    description: 'Historijski događaji u regiji',
    icon: '🌍',
    coverImage: '/images/gallery/vukovar-1991/cover.jpg',
    events: [
      {
        slug: 'vukovar-1991',
        title: 'Vukovar 1991',
        description: 'Bitka za Vukovar u Hrvatskoj',
        subtitle: 'Hrvatska',
        coverImage: '/images/gallery/vukovar-1991/cover.jpg'
      },
      {
        slug: 'oluja-1995',
        title: 'Oluja 1995',
        description: 'Vojno-redarstvena operacija Oluja',
        subtitle: 'Hrvatska',
        coverImage: '/images/gallery/oluja-1995/cover.jpeg'
      },
      {
        slug: 'nato-bombardovanje-1999',
        title: 'NATO bombardovanje 1999',
        description: 'Bombardovanje SRJ od strane NATO-a',
        subtitle: 'SRJ'
      },
      {
        slug: 'kosovo-1999',
        title: 'Kosovo 1999',
        description: 'Sukobi i izbjeglička kriza na Kosovu',
        subtitle: 'Kosovo'
      }
    ]
  },
  {
    id: 'svijet',
    title: 'Svijet',
    description: 'Globalni historijski događaji',
    icon: '🌐',
    events: [
      {
        slug: 'holokaust',
        title: 'Holokaust',
        description: 'Stradanje Jevreja i drugih naroda u Drugom svjetskom ratu',
        subtitle: '1933–1945'
      },
      {
        slug: 'berlinski-zid',
        title: 'Berlinski zid',
        description: 'Pad Berlinskog zida 1989. godine',
        subtitle: 'Njemačka'
      },
      {
        slug: 'mandela-apartheid',
        title: 'Mandela i kraj apartheida',
        description: 'Borba Nelsona Mandele i kraj apartheida u Južnoj Africi',
        subtitle: 'Južna Afrika'
      }
    ]
  }
];

export function getGalleryCategoryById(id: string): GalleryCategory | undefined {
  return galleryCategories.find(category => category.id === id);
}

export function getAllGalleryCategories(): GalleryCategory[] {
  return galleryCategories;
}

export function getGalleryEventByCategoryAndSlug(categoryId: string, slug: string): GalleryEvent | undefined {
  const category = getGalleryCategoryById(categoryId);
  return category?.events.find(event => event.slug === slug);
}

export function getAllGalleryEvents(): GalleryEvent[] {
  return galleryCategories.flatMap(category => category.events);
}
