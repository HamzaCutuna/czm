import { absolutize } from '@/lib/http';

export interface DanDto {
  Dan?: number | null;      // 1-31
  Mjesec?: number | null;   // 1-12
  MjesecOpis?: string | null;
}

export interface SlikaShareDto {
  id?: number;
  slikaPath?: string | null;     // backend property name
  url?: string | null;           // legacy support
  naslov?: string | null;        // title/alt
  opis?: string | null;          // caption/desc
}

export type SlikeField = SlikaShareDto | SlikaShareDto[] | null | undefined;

export function pickImageUrl(slike: SlikeField): { url?: string; alt?: string } {
  if (!slike) return {};
  const first = Array.isArray(slike) ? slike.find(s => !!(s?.slikaPath || s?.url)) : slike;
  const rawUrl = first?.slikaPath ?? first?.url ?? undefined;
  const alt = first?.naslov ?? first?.opis ?? "Slika događaja";
  
  // Use the existing absolutize function to resolve relative URLs
  const url = absolutize(rawUrl);
  
  return { url, alt };
}

export interface DokumentSharedDto {
  id?: number;
  naslov?: string | null;
  url?: string | null;
}

export interface NaDanasnjiDanResponseDogadaj {
  id: number;
  opis: string;                  // event description
  godina: number;                // year
  dan: number;                   // day
  regija: string;                // region name
  kategorija: string;            // category name
  slike?: SlikaShareDto | null;  // associated images (optional)
  dokumenti: DokumentSharedDto[];// associated documents
}

export interface NaDanasnjiDanResponseRegija {
  naziv: string;                 // e.g., "BiH", "Region", "Svijet"
  dogadaji: NaDanasnjiDanResponseDogadaj[];
}

export interface NaDanasnjiDanResponse {
  nextDate: DanDto;
  currentDate: DanDto;
  previousDate: DanDto;
  dogadajiDate: DanDto;
  danasIstaknuto: NaDanasnjiDanResponseDogadaj[];
  regije: NaDanasnjiDanResponseRegija[];
}
