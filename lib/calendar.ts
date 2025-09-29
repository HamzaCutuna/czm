import { absolutize } from "./http";

export type CalendarCategory = 'BiH' | 'Region' | 'Svijet';

export interface CalendarEvent {
  id: string | number;
  date: string;      // ISO
  year: number;      // e.g. 1931
  category: CalendarCategory;
  title: string;
  shortText: string;
  fullText: string;
  imageUrl?: string | null;
}

function firstSentence(text: string, max = 160): string {
  const trimmed = (text || '').trim();
  return trimmed.length > max ? trimmed.slice(0, max).trimEnd() + '…' : trimmed;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export async function fetchEventsByDate(dateISO: string): Promise<CalendarEvent[]> {
  const d = new Date(dateISO);
  const dan = d.getDate();
  const mjesec = d.getMonth() + 1;

  // Use existing proxy route to keep CORS/cookies consistent
  const url = new URL(`/api/today-events?dan=${dan}&mjesec=${mjesec}`, window.location.origin);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Greška pri učitavanju: ${res.status} ${txt}`);
  }
  const json = await res.json();
  const regije: Array<{ naziv: string; dogadaji: unknown[] }>
    = Array.isArray(json?.regije) ? json.regije : [];

  const debug = new URLSearchParams(window.location.search).has('debug');
  if (debug) {
    // eslint-disable-next-line no-console
    console.log('[Calendar] Raw regije from API:', regije.map(r => ({ naziv: r.naziv, count: (r.dogadaji || []).length })));
  }

  function normalizeCategory(name: string): CalendarCategory {
    const raw = (name || '').trim();
    const n = raw.toLowerCase();
    // BiH variants
    if (/(^|\b)(bih|bi\s*h|bosna|bosnia|herceg)/.test(n)) return 'BiH';
    // Region variants (bs/hr/sr)
    if (/(^|\b)(region|regija)/.test(n)) return 'Region';
    // World variants
    if (/(^|\b)(svijet|svjets|svets|world|global)/.test(n)) return 'Svijet';
    // Exact fallbacks
    if (raw === 'BiH' || raw === 'Region' || raw === 'Svijet') return raw as CalendarCategory;
    // Unknown: leave as Svijet but log in debug mode
    if (new URLSearchParams(window.location.search).has('debug')) {
      // eslint-disable-next-line no-console
      console.warn('[Calendar] Unknown category name, defaulting to Svijet:', raw);
    }
    return 'Svijet';
  }

  function pickImg(e: unknown): string | undefined {
    const s = (e as { slike?: unknown })?.slike;
    if (!s) return undefined;
    if (Array.isArray(s)) {
      const first = s.find((x) => (x as { slikaPath?: string; url?: string })?.slikaPath || (x as { slikaPath?: string; url?: string })?.url);
      return absolutize((first as { slikaPath?: string; url?: string })?.slikaPath ?? (first as { slikaPath?: string; url?: string })?.url);
    }
    return absolutize((s as { slikaPath?: string; url?: string })?.slikaPath ?? (s as { slikaPath?: string; url?: string })?.url);
  }

  const events: CalendarEvent[] = [];
  for (const r of regije) {
    // Prefer event.regija if available; otherwise fallback to group name
    const groupName = r.naziv;
    for (const e of r.dogadaji || []) {
      const event = e as { regija?: string; id: number; godina: number; naslov?: string; opis?: string };
      const rawCat = event?.regija ?? groupName;
      const cat = normalizeCategory(String(rawCat));
      const url = pickImg(e);
      const title = event?.naslov?.trim?.() || firstSentence(event?.opis || '', 80);
      const shortText = firstSentence(event?.opis || '', 200);
      events.push({
        id: event.id,
        date: d.toISOString(),
        year: event.godina,
        category: cat,
        title,
        shortText,
        fullText: event?.opis || '',
        imageUrl: url || null,
      });
    }
  }

  if (debug) {
    const mapped = {
      BiH: events.filter(e => e.category === 'BiH').length,
      Region: events.filter(e => e.category === 'Region').length,
      Svijet: events.filter(e => e.category === 'Svijet').length,
      total: events.length,
    };
    // eslint-disable-next-line no-console
    console.log('[Calendar] Mapped counts:', mapped, { sample: events.slice(0, 3) });
  }
  return events;
}

export const MONTHS_BA = ['januar','februar','mart','april','maj','juni','juli','august','septembar','oktobar','novembar','decembar'] as const;

export function formatBosnianDate(d: Date) {
  return `${d.getDate()}. ${MONTHS_BA[d.getMonth()]}`;
}


