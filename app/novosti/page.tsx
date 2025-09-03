"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, Star } from "lucide-react";

interface NewsItem {
    id: number;
    date: string;
    title: string;
    thumbnail: string;
    shortBio: string;
    isFeatured?: boolean;
}

const newsData: NewsItem[] = [
    {
        id: 1,
        date: "April 09, 2025",
        title: "CENTAR ZA MIR POSJETILA GRUPA RELIGIJSKIH LIDERA I MIROVNIH AKTIVISTA IZ HOLANDIJE",
        thumbnail: "/images/news/1.jpg",
        shortBio: "Grupa religijskih lidara i mirovnih aktivista iz Holandije posjetila je Centar za mir u Mostaru, potvrđujući važnost međunarodne saradnje u promociji mira i razumijevanja.",
        isFeatured: true
    },
    {
        id: 2,
        date: "Januar 30, 2025",
        title: "JERRIE HULME - 'HRABRO SRCE' MOSTARA",
        thumbnail: "/images/news/2.jpg",
        shortBio: "Sinovi i kćerke Jerriea Hulmea, šefa UNHCR-a u ratnom Mostaru, danas su posjetili Mostar i sastali se s Jerrievim prijateljima iz tog perioda, te s predsjednikom Gradskog vijeća Grada Đanijem Rahimićem. Centar za mir i multietničku saradnju posthumno je Hulmeu uručio priznanje 'Hrabro srce Mostara'."
    },
    {
        id: 3,
        date: "Januar 30, 2025",
        title: "Digitalizacija kulturno historijskog naslijeda",
        thumbnail: "/images/news/3.jpg",
        shortBio: "Danas je na Fakultetu informacijskih tehnologija Univerziteta 'Džemal Bijedić' u Mostaru potpisan Memorandum o razumijevanju sa Centar za mir i multietničku saradnju Mostar, čime je uspostavljena saradnja u oblasti digitalizacije kulturno-historijskog naslijeđa i drugih zajedničkih interesa."
    },
    {
        id: 4,
        date: "Januar 30, 2025",
        title: "Sjećanje na Predraga",
        thumbnail: "/images/news/4.jpg",
        shortBio: "Akademik Predrag Matvejević, počasni član Centra za mir, prijatelj i savjetnik u mnogim teškim prilikama u kojima se našao naš grad, pregleda Povelju iz 1888. godine o Počasnom građaninu grada Mostara."
    },
    {
        id: 5,
        date: "Januar 30, 2025",
        title: "Počelo snimanje serijala 'Mostarska Drama'",
        thumbnail: "/images/news/5.jpg",
        shortBio: "Počelo snimanje dokumentarnog serijala Avde Huseinovića: 'Mostarska drama' u tri dijela. U 'Studiju 64' Narodnog pozorišta Mostar danas je pala prva klapa filmske priče radnog naziva Mostarska drama."
    }
];

export default function NovostiPage() {
    const featuredNews = newsData.find(item => item.isFeatured);
    const regularNews = newsData.filter(item => !item.isFeatured);

    return (
        <main className="min-h-dvh bg-[--color-bg] text-stone-800
">
            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-20 pb-8">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
                            <Star className="h-12 w-12 text-amber-700" />
                        </div>
                    </div>
                    <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">
                        Novosti
                    </h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        Pratite najnovije događaje i aktivnosti
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-6xl mx-auto">
                                         {/* Featured Article */}
                     {featuredNews && (
                         <div className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50 mb-12 overflow-hidden rounded-xl">
                             <div className="grid grid-cols-1 lg:grid-cols-2">
                                 <div className="relative h-64 lg:h-full">
                                     <img
                                         src={featuredNews.thumbnail}
                                         alt={featuredNews.title}
                                         className="w-full h-full object-cover"
                                         onError={(e) => {
                                             (e.target as HTMLImageElement).src = '/images/placeholder.png';
                                         }}
                                     />
                                 </div>
                                 <div className="p-8 flex flex-col justify-between h-full">
                                     <div>
                                         <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
                                             <Calendar className="h-4 w-4" />
                                             <span className="date-display">{featuredNews.date}</span>
                                         </div>
                                         <h2 className="text-2xl font-bold text-stone-800 mb-4 leading-relaxed font-['Baskervville']">
                                             {featuredNews.title}
                                         </h2>
                                         <p className="text-stone-600 leading-relaxed font-['Baskervville']">
                                             {featuredNews.shortBio}
                                         </p>
                                     </div>
                                     <Button className="bg-[#5B2323] text-white rounded-xl shadow-lg hover:bg-[#4a1e1e] 
                                     hover:shadow-xl transition-all duration-200 px-8 py-3 mt-6">
                                         Pročitaj više
                                         <ArrowRight className="h-4 w-4 ml-2" />
                                     </Button>
                                 </div>
                             </div>
                         </div>
                     )}

                                         {/* Regular News Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         {regularNews.map((news) => (
                             <div key={news.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full rounded-xl">
                                 <div className="relative h-48 flex-shrink-0">
                                     <img
                                         src={news.thumbnail}
                                         alt={news.title}
                                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                         onError={(e) => {
                                             (e.target as HTMLImageElement).src = '/images/placeholder.png';
                                         }}
                                     />
                                 </div>
                                 <div className="p-6 flex flex-col flex-grow">
                                     <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                                         <Calendar className="h-3 w-3" />
                                         <span className="date-display">{news.date}</span>
                                     </div>
                                     <h3 className="text-lg font-semibold text-stone-800 mb-3 leading-tight font-['Baskervville'] line-clamp-2">
                                         {news.title}
                                     </h3>
                                     <p className="text-stone-600 text-sm leading-relaxed font-['Baskervville'] line-clamp-3 flex-grow">
                                         {news.shortBio}
                                     </p>
                                     <Button
                                         variant="outline"
                                         className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 mt-4"
                                     >
                                         Pročitaj više
                                         <ArrowRight className="h-3 w-3 ml-2" />
                                     </Button>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        </main>
    );
}
