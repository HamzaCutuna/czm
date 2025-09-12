export type MediaType = 'image' | 'video' | 'audio';

export interface GalleryMedia {
  id: string;
  type: MediaType;
  src: string; // can be relative or absolute
  title?: string;
  description?: string;
  thumbnail?: string; // optional explicit thumbnail (falls back to src for images)
  credit?: string;
}

export interface GalleryCollection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  dateISO?: string;
  locationName?: string;
  lat: number;
  lng: number;
  coverImage?: string;
  media: GalleryMedia[];
}

export const galleries: GalleryCollection[] = [
  {
    id: 'srebrenica-1995',
    title: 'Srebrenica 1995',
    subtitle: 'Genocid u Srebrenici',
    description: 'Komemoracija i sjećanje na žrtve genocida u Srebrenici.',
    dateISO: '1995-07-11',
    locationName: 'Srebrenica, BiH',
    lat: 44.1067,
    lng: 19.2961,
    coverImage: '/images/news/1.jpg',
    media: [
      { id: 'img1', type: 'image', src: '/images/news/1.jpg', title: 'Memorijalni centar' },
      { id: 'img2', type: 'image', src: '/images/news/2.jpg', title: 'Komemoracija' },
      { id: 'vid1', type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Dokumentarni isječak' },
      { id: 'aud1', type: 'audio', src: 'https://www.w3schools.com/html/horse.ogg', title: 'Audio svjedočanstvo' },
    ],
  },
  {
    id: 'opsada-sarajeva',
    title: 'Opsada Sarajeva',
    subtitle: '1992–1996',
    description: 'Opsada glavnog grada Bosne i Hercegovine tokom rata.',
    dateISO: '1992-04-05',
    locationName: 'Sarajevo, BiH',
    lat: 43.8563,
    lng: 18.4131,
    coverImage: '/images/news/3.jpg',
    media: [
      { id: 'img3', type: 'image', src: '/images/news/3.jpg', title: 'Stari most' },
      { id: 'img4', type: 'image', src: '/images/news/4.jpg', title: 'Ulice Sarajeva' },
      { id: 'vid2', type: 'video', src: 'https://www.w3schools.com/html/movie.mp4', title: 'Arhivski snimci' },
    ],
  },
  {
    id: 'dayton-1995',
    title: 'Daytonski sporazum',
    subtitle: 'Mirovni sporazum',
    description: 'Dogovor o okončanju rata u Bosni i Hercegovini.',
    dateISO: '1995-11-21',
    locationName: 'Dayton, Ohio, SAD',
    lat: 39.7589,
    lng: -84.1916,
    coverImage: '/images/news/5.jpg',
    media: [
      { id: 'img5', type: 'image', src: '/images/news/5.jpg', title: 'Potpisivanje' },
    ],
  },
];

export default galleries;


