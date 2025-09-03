import type { NormalizedEvent } from '@/lib/eventsSchema';

export type GroupedPin = { 
  lat: number; 
  lng: number; 
  events: NormalizedEvent[];
  eventCount: number;
};

export function groupByCoordinate(evts: NormalizedEvent[], precision = 3): GroupedPin[] {
  const map = new Map<string, GroupedPin>();
  
  for (const e of evts) {
    if (typeof e.lat !== 'number' || typeof e.lng !== 'number') {
      continue;
    }
    
    // Round coordinates to specified precision
    const lat = Number(e.lat.toFixed(precision));
    const lng = Number(e.lng.toFixed(precision));
    const key = `${lat}:${lng}`;
    
    const entry = map.get(key) ?? { 
      lat, 
      lng, 
      events: [],
      eventCount: 0
    };
    
    entry.events.push(e);
    entry.eventCount = entry.events.length;
    map.set(key, entry);
  }
  
  return [...map.values()];
}

// Alternative grouping by distance (more sophisticated)
export function groupByDistance(evts: NormalizedEvent[], maxDistanceKm = 10): GroupedPin[] {
  const groups: GroupedPin[] = [];
  const processed = new Set<number>();
  
  for (let i = 0; i < evts.length; i++) {
    if (processed.has(i)) continue;
    
    const event = evts[i];
    if (typeof event.lat !== 'number' || typeof event.lng !== 'number') {
      continue;
    }
    
    const group: GroupedPin = {
      lat: event.lat,
      lng: event.lng,
      events: [event],
      eventCount: 1
    };
    
    processed.add(i);
    
    // Find nearby events
    for (let j = i + 1; j < evts.length; j++) {
      if (processed.has(j)) continue;
      
      const otherEvent = evts[j];
      if (typeof otherEvent.lat !== 'number' || typeof otherEvent.lng !== 'number') {
        continue;
      }
      
      const distance = calculateDistance(
        event.lat, event.lng,
        otherEvent.lat, otherEvent.lng
      );
      
      if (distance <= maxDistanceKm) {
        group.events.push(otherEvent);
        group.eventCount = group.events.length;
        processed.add(j);
        
        // Update group center (average of all events in group)
        group.lat = group.events.reduce((sum, e) => sum + e.lat!, 0) / group.events.length;
        group.lng = group.events.reduce((sum, e) => sum + e.lng!, 0) / group.events.length;
      }
    }
    
    groups.push(group);
  }
  
  return groups;
}

// Haversine distance calculation in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Utility to get events without coordinates
export function getEventsWithoutCoordinates(evts: NormalizedEvent[]): NormalizedEvent[] {
  return evts.filter(e => 
    typeof e.lat !== 'number' || 
    typeof e.lng !== 'number' ||
    !isFinite(e.lat) || 
    !isFinite(e.lng)
  );
}

// Utility to get events with coordinates
export function getEventsWithCoordinates(evts: NormalizedEvent[]): NormalizedEvent[] {
  return evts.filter(e => 
    typeof e.lat === 'number' && 
    typeof e.lng === 'number' &&
    isFinite(e.lat) && 
    isFinite(e.lng)
  );
}
