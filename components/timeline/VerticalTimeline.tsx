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
    year: "24.2.2025",
    title: "Prvi sastanak u Centru za mir i multietničku saradnju",
    description: "Održan je inicijalni sastanak na kojem je predstavljena ideja digitalizacije dokumenata Centra za mir i multietničku saradnju. Razgovaralo se o značaju digitalnog očuvanja građe, mogućim tehničkim rješenjima i narednim koracima u procesu pripreme projekta.",
    status: "completed"
  },
  {
    year: "14.3.2025", 
    title: "Potpisan memorandum o razumijevanju (CZM – FIT)",
    description: "Na Fakultetu informacijskih tehnologija potpisan je memorandum o razumijevanju između FIT-a i CZM-a. Memorandum su potpisali dekan prof. dr. Nina Bijedić i direktor Centra gospodin Safet Oručević, čime je zvanično potvrđena saradnja na zajedničkom radu na započetom procesu digitalizacije kulturno-historijskog naslijeđa.",
    status: "completed"
  },
  {
    year: "17.4.2025",
    title: "Predstavljanje istraživanja",
    description: "Studenti FIT-a su prezentirali svoje istraživanje koje se oslanjalo na postojeće historijske kalendare, muzejske sadržaje i interaktivne alate za kviz. Cilj istraživačkog rada bio je dati mišljenje i smjernice za oblikovanje projekta, a vodio se i razgovor na definisanju zajedničkih ciljeva i dogovoreni naredni koraci.",
    status: "completed"
  },
  {
    year: "26.7.2025",
    title: "Predstavljanje urađenog dijela web aplikacije",
    description: "Na sastanku je prikazan dosadašnji rad – kompletiran backend sistem i prototip najvažnijih pregleda funkcionalnosti. Tokom prezentacije zajednički je razmotreno šta je do sada urađeno i zaključeno je koje segmente je još potrebno nadimati kako bi web aplikacija bila u potpunosti zaokružena.",
    status: "completed"
  },
  {
    year: "August 2025",
    title: "Završni radovi na bazi i finalni dio frontenda",
    description: "Dovršeno je unošenje većeg broja događaja iz knjige TV kalendara u bazu podataka, čime je kreiran čvrst temelj za dalje digitalno očuvanje. Studenti su nastavili rad na finalnoj verziji frontenda web aplikacije. Uključivale su se nadogradnje vezane za optimizaciju i performanse, mijenjanje i prilagođavanje nedostataka na već postojećem backendu, kao i dodatak na integraciji jedinstvenog korisničkog iskustva.",
    status: "current"
  },
  {
    year: "2025",
    title: "Ubrzo",
    description: "[placeholder]",
    status: "upcoming"
  },
  {
    year: "2026",
    title: "Ubrzo",
    description: "[placeholder]",
    status: "upcoming"
  },
  {
    year: "2026",
    title: "Ubrzo",
    description: "[placeholder]",
    status: "upcoming"
  },
  {
    year: "2026",
    title: "Ubrzo",
    description: "[placeholder]",
    status: "upcoming"
  },
  {
    year: "2026",
    title: "Ubrzo",
    description: "[placeholder]",
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
