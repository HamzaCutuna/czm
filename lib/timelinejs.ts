import { CalendarEvent } from "./calendar";

export interface TimelineJSSlide {
  start_date: {
    year: number;
    month?: number;
    day?: number;
  };
  end_date?: {
    year: number;
    month?: number;
    day?: number;
  };
  text: {
    headline: string;
    text: string;
  };
  media?: {
    url: string;
    caption?: string;
    credit?: string;
    thumbnail?: string;
  };
  group?: string;
  display_date?: string;
  background?: {
    url?: string;
    color?: string;
  };
}

export interface TimelineJSData {
  title?: {
    media?: {
      url: string;
      caption?: string;
      credit?: string;
    };
    text: {
      headline: string;
      text: string;
    };
  };
  events: TimelineJSSlide[];
}

/**
 * Converts CalendarEvent array to TimelineJS format
 */
export function convertToTimelineJS(events: CalendarEvent[]): TimelineJSData {
  // Sort events by year
  const sortedEvents = [...events].sort((a, b) => a.year - b.year);

  const timelineEvents: TimelineJSSlide[] = sortedEvents.map(event => {
    const slide: TimelineJSSlide = {
      start_date: {
        year: event.year,
        month: new Date(event.date).getMonth() + 1,
        day: new Date(event.date).getDate()
      },
      text: {
        headline: event.title,
        text: event.shortText
      },
      group: event.category,
      display_date: `${event.year}. godina`
    };

    // Add media if available
    if (event.imageUrl) {
      slide.media = {
        url: event.imageUrl,
        caption: event.title,
        credit: event.category
      };
    }

    // Add background color based on category
    switch (event.category) {
      case 'BiH':
        slide.background = { color: '#3b82f6' }; // blue
        break;
      case 'Region':
        slide.background = { color: '#10b981' }; // green
        break;
      case 'Svijet':
        slide.background = { color: '#f59e0b' }; // amber
        break;
    }

    return slide;
  });

  return {
    title: {
      text: {
        headline: "Historijska Vremenska Linija",
        text: "Hronološki pregled važnih historijskih događaja"
      }
    },
    events: timelineEvents
  };
}

/**
 * Creates TimelineJS configuration options
 */
export function getTimelineJSOptions() {
  return {
    language: "sr", // Serbian language
    font: "PT Sans, PT Sans Narrow, and PT Serif",
    initial_zoom: 2,
    height: 650,
    debug: process.env.NODE_ENV === 'development',
    hash_bookmark: true,
    start_at_end: false,
    show_nav_on_top: false
  };
}
