"use client";

import { useState, useEffect } from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { 
  Calendar, 
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

const timelineData: TimelineItem[] = [
  {
    year: "2024",
    title: "Početak projekta",
    description: "Formiranje tima i definisanje ciljeva platforme Historija TV",
    status: "completed"
  },
  {
    year: "2024", 
    title: "Razvoj MVP",
    description: "Kreiranje osnovnih funkcionalnosti i dizajn sistema",
    status: "completed"
  },
  {
    year: "2024",
    title: "Beta testiranje",
    description: "Testiranje sa ograničenim brojem korisnika i prikupljanje povratnih informacija",
    status: "completed"
  },
  {
    year: "2024",
    title: "Lansiranje",
    description: "Javno lansiranje platforme sa svim osnovnim funkcionalnostima",
    status: "current"
  },
  {
    year: "2025",
    title: "Proširenje sadržaja",
    description: "Dodavanje novih historijskih tema i interaktivnih sadržaja",
    status: "upcoming"
  },
  {
    year: "2025",
    title: "Mobilna aplikacija",
    description: "Razvoj native mobilne aplikacije za iOS i Android",
    status: "upcoming"
  },
  {
    year: "2025",
    title: "AI integracija",
    description: "Implementacija AI asistenta za personalizovano učenje",
    status: "upcoming"
  },
  {
    year: "2025",
    title: "Međunarodno proširenje",
    description: "Lokalizacija platforme za druge jezike i regione",
    status: "upcoming"
  }
];

const getIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-6 w-6" />;
    case "current":
      return <Star className="h-6 w-6" />;
    case "upcoming":
      return <Clock className="h-6 w-6" />;
    default:
      return <Calendar className="h-6 w-6" />;
  }
};

const getIconColor = (status: string) => {
  switch (status) {
    case "completed":
      return "#10b981"; // green-500
    case "current":
      return "#3b82f6"; // blue-500
    case "upcoming":
      return "#6b7280"; // gray-500
    default:
      return "#6b7280";
  }
};

const getContentColor = (status: string) => {
  switch (status) {
    case "completed":
      return "#ecfdf5"; // green-50
    case "current":
      return "#eff6ff"; // blue-50
    case "upcoming":
      return "#f9fafb"; // gray-50
    default:
      return "#f9fafb";
  }
};

export function VerticalTimelineComponent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-20 bg-stone-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <style jsx>{`
        .vertical-timeline-element-date {
          font-feature-settings: "tnum" !important;
        }
      `}</style>
      <VerticalTimeline
        lineColor="#d97706" // amber-500
        className="vertical-timeline-custom"
      >
        {timelineData.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            contentStyle={{
              background: getContentColor(item.status),
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            contentArrowStyle={{
              borderRight: `7px solid ${getContentColor(item.status)}`
            }}
            date={item.year}
            dateClassName="vertical-timeline-element-date"
            iconStyle={{
              background: getIconColor(item.status),
              color: '#fff',
              border: '3px solid #fff',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            icon={getIcon(item.status)}
          >
            <h3 className="vertical-timeline-element-title text-lg font-semibold text-stone-800 mb-2">
              {item.title}
            </h3>
            <p className="vertical-timeline-element-subtitle text-stone-600 leading-relaxed">
              {item.description}
            </p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
}
