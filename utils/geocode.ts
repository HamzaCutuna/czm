export type GeoPoint = { lat: number; lng: number };

const mem = new Map<string, GeoPoint>();

function key(name: string): string {
  return `geocode:country:${name.toLowerCase().trim()}`;
}

function isValidGeoPoint(point: any): point is GeoPoint {
  return (
    point &&
    typeof point === 'object' &&
    typeof point.lat === 'number' &&
    typeof point.lng === 'number' &&
    isFinite(point.lat) &&
    isFinite(point.lng) &&
    point.lat >= -90 &&
    point.lat <= 90 &&
    point.lng >= -180 &&
    point.lng <= 180
  );
}

export async function geocodeCountryOnce(countryName: string): Promise<GeoPoint | null> {
  if (!countryName || countryName.trim() === '') {
    return null;
  }

  const normalizedName = countryName.trim();
  const k = key(normalizedName);
  
  // Check in-memory cache first
  if (mem.has(k)) {
    return mem.get(k)!;
  }

  // Check localStorage cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(k);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (isValidGeoPoint(parsed)) {
          mem.set(k, parsed);
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to parse cached geocode data:', error);
    }
  }

  // Rate limiting: simple delay between requests
  await new Promise(resolve => setTimeout(resolve, 100));

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&country=${encodeURIComponent(normalizedName)}`;
  
  try {
    const res = await fetch(url, { 
      headers: { 
        'User-Agent': 'CZM-Digitalizacija/1.0 (contact@example.com)',
        'Accept': 'application/json'
      }
    });
    
    if (!res.ok) {
      console.warn(`Geocoding failed for "${normalizedName}": ${res.status}`);
      return null;
    }
    
    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) {
      console.warn(`No geocoding results for "${normalizedName}"`);
      return null;
    }
    
    const hit = results[0];
    if (!hit || typeof hit.lat !== 'string' || typeof hit.lon !== 'string') {
      console.warn(`Invalid geocoding result for "${normalizedName}"`);
      return null;
    }
    
    const pt: GeoPoint = { 
      lat: parseFloat(hit.lat), 
      lng: parseFloat(hit.lon) 
    };
    
    if (!isValidGeoPoint(pt)) {
      console.warn(`Invalid coordinates for "${normalizedName}":`, pt);
      return null;
    }
    
    // Cache the result
    mem.set(k, pt);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(k, JSON.stringify(pt));
      } catch (error) {
        console.warn('Failed to cache geocode result:', error);
      }
    }
    
    return pt;
  } catch (error) {
    console.warn(`Geocoding error for "${normalizedName}":`, error);
    return null;
  }
}

// Batch geocoding with delays
export async function geocodeCountries(countries: string[]): Promise<Map<string, GeoPoint>> {
  const results = new Map<string, GeoPoint>();
  
  for (const country of countries) {
    const result = await geocodeCountryOnce(country);
    if (result) {
      results.set(country, result);
    }
    
    // Small delay between requests to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return results;
}

// Clear caches (useful for testing)
export function clearGeocodeCache(): void {
  mem.clear();
  if (typeof window !== 'undefined') {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('geocode:country:'));
      keys.forEach(k => localStorage.removeItem(k));
    } catch (error) {
      console.warn('Failed to clear localStorage geocode cache:', error);
    }
  }
}

// Get cache stats
export function getGeocodeCacheStats(): { memory: number; localStorage: number } {
  let localStorageCount = 0;
  if (typeof window !== 'undefined') {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('geocode:country:'));
      localStorageCount = keys.length;
    } catch (error) {
      console.warn('Failed to count localStorage geocode cache:', error);
    }
  }
  
  return {
    memory: mem.size,
    localStorage: localStorageCount
  };
}
