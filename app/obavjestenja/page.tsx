"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  ArrowRight, 
  Star, 
  Bell, 
  Filter,
  FileText, 
  Download, 
  Globe,
  BookOpen,
  Target
} from "lucide-react";
import { VerticalTimelineComponent } from "@/components/timeline/VerticalTimeline";

interface Announcement {
  id: number;
  title: string;
  excerpt: string;
  tag: "Sistem" | "Događaji" | "Partnerstva";
  date: string;
  isPinned?: boolean;
}


const announcementsData: Announcement[] = [
  {
    id: 1,
    title: "Novi powerupi dostupni!",
    excerpt: "Dodali smo nove powerupe za kvizove - Hint, 50/50, Skip i Revive. Testirajte ih u igrama!",
    tag: "Sistem",
    date: "2025-01-15",
    isPinned: true,
  },
  {
    id: 2,
    title: "Dnevni izazov - nova funkcionalnost",
    excerpt: "Svaki dan možete dobiti bonus 💎 završavanjem dnevnog izazova. Pokušajte svoju sreću!",
    tag: "Sistem",
    date: "2025-01-14",
  },
  {
    id: 3,
    title: "Historijski kalendar - ažuriranje",
    excerpt: "Dodali smo nove događaje u kalendar za 2025. godinu. Proverite šta se dogodilo na vaš rođendan!",
    tag: "Događaji",
    date: "2025-01-13",
  },
  {
    id: 4,
    title: "Partnerstvo sa Univerzitetom",
    excerpt: "Uspešno smo potpisali memorandum o saradnji sa Fakultetom informacijskih tehnologija.",
    tag: "Partnerstva",
    date: "2025-01-12",
  },
  {
    id: 5,
    title: "Nova galerija slika",
    excerpt: "Dodali smo galeriju sa fotografijama iz opsade Sarajeva. Pogledajte autentične snimke iz tog perioda.",
    tag: "Događaji",
    date: "2025-01-11",
  },
  {
    id: 6,
    title: "Sistem nagrađivanja",
    excerpt: "Uveli smo sistem nagrađivanja sa 💎 dijamantima. Zarađujte ih kroz igre i koristite powerupe!",
    tag: "Sistem",
    date: "2025-01-10",
  },
  {
    id: 7,
    title: "Kviz tačno/netačno",
    excerpt: "Nova igra je dostupna! Testirajte svoje znanje o historijskim događajima kroz jednostavne izjave.",
    tag: "Sistem",
    date: "2025-01-09",
  },
  {
    id: 8,
    title: "Međunarodna saradnja",
    excerpt: "Radimo na proširivanju saradnje sa organizacijama iz regiona. Očekujte nove edukativne sadržaje.",
    tag: "Partnerstva",
    date: "2025-01-08",
  },
  {
    id: 9,
    title: "Mobilna optimizacija",
    excerpt: "Poboljšali smo korisničko iskustvo na mobilnim uređajima. Sada je aplikacija brža i lakša za korištenje.",
    tag: "Sistem",
    date: "2025-01-07",
  },
];

const tags = ["Sve", "Sistem", "Događaji", "Partnerstva"];


export default function ObavjestenjaPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [selectedTag, setSelectedTag] = useState("Sve");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setAnnouncements(announcementsData);
      setFilteredAnnouncements(announcementsData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedTag === "Sve") {
      setFilteredAnnouncements(announcements);
    } else {
      setFilteredAnnouncements(announcements.filter(a => a.tag === selectedTag));
    }
  }, [selectedTag, announcements]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bs-BA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Sistem":
        return "bg-blue-100 text-blue-800";
      case "Događaji":
        return "bg-green-100 text-green-800";
      case "Partnerstva":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned);

  if (loading) {
    return (
      <main className="min-h-dvh bg-[--color-bg] text-stone-800">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg animate-pulse">
                <Bell className="h-12 w-12 text-amber-700" />
              </div>
            </div>
            <div className="h-16 bg-stone-200 rounded-lg animate-pulse mb-4"></div>
            <div className="h-6 bg-stone-200 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Filter Skeleton */}
            <div className="flex gap-2 mb-8 justify-center">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 w-20 bg-stone-200 rounded-lg animate-pulse"></div>
              ))}
            </div>

            {/* Cards Skeleton */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="border-0 shadow-lg bg-white rounded-xl p-6">
                  <div className="h-6 bg-stone-200 rounded-lg animate-pulse mb-4"></div>
                  <div className="h-4 bg-stone-200 rounded-lg animate-pulse mb-2"></div>
                  <div className="h-4 bg-stone-200 rounded-lg animate-pulse w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
              <Bell className="h-12 w-12 text-amber-700" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">
            Obavještenja
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Pratite najnovije obavještenja i ažuriranja
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(tag)}
                className={`flex items-center gap-2 ${
                  selectedTag === tag
                    ? "bg-[#5B2323] text-white hover:bg-[#4a1e1e]"
                    : "border-amber-300 text-amber-700 hover:bg-amber-50"
                }`}
              >
                <Filter className="h-4 w-4" />
                {tag}
              </Button>
            ))}
          </div>

          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-stone-800 mb-4 font-heading flex items-center gap-2">
                <Star className="h-6 w-6 text-amber-600" />
                Važno
              </h2>
              {pinnedAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50 mb-6 overflow-hidden rounded-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(announcement.date)}</span>
                          <Badge className={getTagColor(announcement.tag)}>
                            {announcement.tag}
                          </Badge>
                        </div>
                        <h2 className="text-2xl font-bold text-stone-800 mb-4 leading-relaxed font-['Baskervville']">
                          {announcement.title}
                        </h2>
                        <p className="text-stone-600 leading-relaxed font-['Baskervville']">
                          {announcement.excerpt}
                        </p>
                      </div>
                      <Button className="bg-[#5B2323] text-white rounded-xl shadow-lg hover:bg-[#4a1e1e] 
                                     hover:shadow-xl transition-all duration-200 px-8 py-3 mt-6">
                        Pročitaj više
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                    <div className="relative h-64 lg:h-full bg-gradient-to-br from-amber-100 to-stone-100 flex items-center justify-center">
                      <Bell className="h-24 w-24 text-amber-400 opacity-50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Regular Announcements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full rounded-xl">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(announcement.date)}</span>
                    <Badge className={getTagColor(announcement.tag)}>
                      {announcement.tag}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-3 leading-tight font-['Baskervville'] line-clamp-2">
                    {announcement.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed font-['Baskervville'] line-clamp-3 flex-grow">
                    {announcement.excerpt}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 mt-4"
                  >
                    Pročitaj više
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-600 mb-2">
                Nema obavještenja
              </h3>
              <p className="text-stone-500">
                Trenutno nema obavještenja za odabranu kategoriju.
              </p>
            </div>
          )}

          {/* Clear separation before Memorandum */}
          <div className="pt-16 pb-12 md:pt-20 md:pb-16">
            <div className="border-t border-amber-200/40 mb-8"></div>
          </div>

          {/* Memorandum Hero */}
          <div className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50 mb-12 overflow-hidden rounded-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-stone-800 mb-6 font-heading">
                  Memorandum o razumijevanju
                </h2>
                <p className="text-stone-600 leading-relaxed mb-6 font-['Baskervville']">
                  Historija TV je nastala iz potrebe da historijski sadržaj bude dostupan, razumljiv i zanimljiv za sve uzraste. 
                  Naša misija je da kroz tehnologiju i interaktivne sadržaje činimo historiju živom i relevantnom za današnje generacije.
                </p>
                <p className="text-stone-600 leading-relaxed mb-6 font-['Baskervville']">
                  Platforma kombinuje edukativne igre, multimedijalne galerije, historijski kalendar i interaktivne kvizove 
                  da pruži sveobuhvatan pristup učenju o historijskim događajima, posebno onima vezanim za region.
                </p>
                <Button className="bg-[#5B2323] text-white rounded-xl shadow-lg hover:bg-[#4a1e1e] 
                               hover:shadow-xl transition-all duration-200 px-8 py-3">
                  <Download className="h-4 w-4 mr-2" />
                  Preuzmi PDF
                </Button>
              </div>
              <div className="relative h-64 lg:h-full bg-gradient-to-br from-amber-100 to-stone-100 flex items-center justify-center">
                <FileText className="h-32 w-32 text-amber-400 opacity-50" />
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-stone-800 mb-4 font-heading">
                Hodogram razvoja
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-['Baskervville']">
                Pratite naš put od ideje do realizacije
              </p>
            </div>

            <VerticalTimelineComponent />
          </div>

          {/* Testimonials Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-stone-800 mb-4 font-heading">
                Naš tim
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-['Baskervville']">
                Upoznajte članove tima koji rade na Historija TV projektu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-stone-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-800 font-heading">
                        Adna Ćušić
                      </h3>
                      <p className="text-sm text-stone-500">
                        Student
                      </p>
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed font-['Baskervville']">
                    &ldquo;Želim da historija bude dostupna svima kroz kratke, tačne i vizualno jasne priče.&rdquo;
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-stone-100 rounded-lg">
                      <Globe className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-800 font-heading">
                        Dino Burić
                      </h3>
                      <p className="text-sm text-stone-500">
                        Student
                      </p>
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed font-['Baskervville']">
                    &ldquo;Motiviše me ideja da se sjećanje očuva digitalno i da mladi lakše uče.&rdquo;
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-stone-100 rounded-lg">
                      <Target className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-800 font-heading">
                        Adil Joldić
                      </h3>
                      <p className="text-sm text-stone-500">
                        Asistent
                      </p>
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed font-['Baskervville']">
                    &ldquo;Radim na sadržaju koji ističe činjenice i povezuje događaje kroz vrijeme.&rdquo;
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
