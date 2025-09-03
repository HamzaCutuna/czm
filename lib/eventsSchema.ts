// import { z } from 'zod'; // Not needed for this implementation

export type NormalizedEvent = {
  id: string;
  title: string;
  description: string;
  rawLocation?: string;
  dateISO?: string;
  lat?: number;
  lng?: number;
  source?: 'api'|'sample';
  // Preserve original API fields for EventModal
  godina?: number;
  dan?: number;
  regija?: string;
  kategorija?: string;
  slike?: unknown;
};

function pick<T = unknown>(o: unknown, keys: string[], fallback?: T): T | undefined {
  for (const k of keys) {
    const v = (o as Record<string, unknown>)?.[k];
    if (v != null) return v as T;
  }
  return fallback;
}

function generateStableId(title: string, dateISO?: string, index?: number): string {
  const content = `${title}-${dateISO ?? ''}`;
  // Simple hash function for stable IDs
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `evt_${Math.abs(hash)}_${index ?? 0}`;
}

export function normalizeApiResponse(json: unknown): NormalizedEvent[] {
  try {
    // Simple type guard instead of Zod validation
    const root = (json && typeof json === 'object' && !Array.isArray(json)) 
      ? (json as Record<string, unknown>) 
      : {};
    
    console.log('Normalizing API response:', { json, root, keys: Object.keys(root) });
    
    // Find events array under several possible keys or any nested array of objects
    const candidateArrays: unknown[] = [];
    const tryKeys = ['dogadjaji','dogadjajne','events','entries','items','dogadjaj','data'];
    
    for (const k of tryKeys) {
      if (Array.isArray(root?.[k])) {
        console.log(`Found array under key: ${k}`, root[k]);
        candidateArrays.push(root[k]);
      }
    }
    
    // scan one level deep
    for (const v of Object.values(root)) {
      if (Array.isArray(v) && v.length && typeof v[0] === 'object') {
        console.log('Found nested array:', v);
        candidateArrays.push(v);
      }
      if (v && typeof v === 'object') {
        for (const vv of Object.values(v as Record<string, unknown>)) {
          if (Array.isArray(vv) && vv.length && typeof vv[0] === 'object') {
            console.log('Found deeply nested array:', vv);
            candidateArrays.push(vv);
          }
        }
      }
    }
    
    const arr: unknown[] = (candidateArrays[0] as unknown[]) ?? [];
    if (!candidateArrays.length) {
      console.warn('Unexpected API response format', { keys: Object.keys(root), json });
    }

  return arr.map((raw, idx) => {
    const rawObj = raw as Record<string, unknown>;
    const title = pick<string>(rawObj, ['naslov','title','name','naziv','ime']) ?? 'Untitled';
    const description = pick<string>(rawObj, ['opis','description','desc','content','sadrzaj','tekst']) ?? '';
    const rawLocation = pick<string>(rawObj, ['lokacija','mjesto','location','place','country','zemlja','drzava']);
    const dateISO = pick<string>(rawObj, ['datum','date','dateISO','dogadjaj_datum','currentdate','currentsdate','danasnjidatum']);
    
    // Try multiple coordinate field patterns
    const lat = Number(pick<unknown>(rawObj, ['lat','latitude','geo_lat','geo?.lat','latituda']));
    const lng = Number(pick<unknown>(rawObj, ['lng','lon','long','longitude','geo_lng','geo?.lng','longituda']));
    
    const id = (rawObj?.id?.toString?.()) ?? generateStableId(title, dateISO, idx);
    
    return { 
      id, 
      title, 
      description, 
      rawLocation, 
      dateISO, 
      lat: isFinite(lat) ? lat : undefined, 
      lng: isFinite(lng) ? lng : undefined, 
      source: 'api',
      // Preserve original API fields for EventModal
      godina: rawObj.godina as number | undefined,
      dan: rawObj.dan as number | undefined,
      regija: rawObj.regija as string | undefined,
      kategorija: rawObj.kategorija as string | undefined,
      slike: rawObj.slike as unknown | undefined
    };
  });
  } catch (error) {
    console.error('Error in normalizeApiResponse:', error, { json });
    return [];
  }
}
