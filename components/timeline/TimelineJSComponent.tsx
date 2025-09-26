"use client";

import { useEffect, useRef } from 'react';
import { TimelineJSSlide, TimelineJSData, convertToTimelineJS, getTimelineJSOptions } from '@/lib/timelinejs';
import { CalendarEvent } from '@/lib/calendar';

interface TimelineJSComponentProps {
  events: CalendarEvent[];
  onEventSelect?: (event: CalendarEvent) => void;
}

declare global {
  interface Window {
    TL: any;
  }
}

export function TimelineJSComponent({ events, onEventSelect }: TimelineJSComponentProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load TimelineJS script dynamically
    const loadTimelineJS = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.TL) {
          resolve();
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="timeline.js"]');
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load TimelineJS'));
        document.head.appendChild(script);

        // Load CSS if not already loaded
        const existingCSS = document.querySelector('link[href*="timeline.css"]');
        if (!existingCSS) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css';
          document.head.appendChild(link);
        }
      });
    };

    const initializeTimeline = async () => {
      try {
        await loadTimelineJS();
        
        if (!timelineRef.current || !window.TL) return;

        // Convert events to TimelineJS format
        const timelineData = convertToTimelineJS(events);
        const options = getTimelineJSOptions();

        // Clean up existing timeline if it exists
        if (timelineRef.current) {
          timelineRef.current.innerHTML = '';
        }

        // Create new timeline with a small delay to ensure DOM is ready
        setTimeout(() => {
          if (timelineRef.current && window.TL) {
            timelineInstanceRef.current = new window.TL.Timeline(
              timelineRef.current,
              timelineData,
              options
            );

            // Add event listeners if callback provided
            if (onEventSelect) {
              timelineInstanceRef.current.on('select', (event: any) => {
                const slideData = event.data;
                if (slideData && slideData.text) {
                  // Find the original event by matching title and year
                  const originalEvent = events.find(e => 
                    e.title === slideData.text.headline && 
                    e.year === slideData.start_date.year
                  );
                  if (originalEvent) {
                    onEventSelect(originalEvent);
                  }
                }
              });
            }
          }
        }, 100);

      } catch (error) {
        console.error('Error initializing TimelineJS:', error);
      }
    };

    initializeTimeline();

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.innerHTML = '';
      }
      timelineInstanceRef.current = null;
    };
  }, [events, onEventSelect]);

  return (
    <div className="w-full">
      <div 
        ref={timelineRef} 
        className="timeline-container"
        style={{ width: '100%', height: '650px' }}
      />
    </div>
  );
}
