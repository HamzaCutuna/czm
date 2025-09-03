"use client";

import Link from "next/link";
import Image from "next/image";

interface NewsArticle {
  title: string;
  dateISO: string;
  excerpt: string;
  href: string;
  image: string;
  featured: boolean;
}

interface LatestNewsProps {
  article?: NewsArticle;
}

export default function LatestNews({ article }: LatestNewsProps) {
  // Fallback mock article if none provided
  const defaultArticle: NewsArticle = {
    title: "Centar za mir organizuje međunarodnu konferenciju o pomirenju",
    dateISO: "2025-04-09",
    excerpt: "U saradnji sa međunarodnim partnerima, Centar za mir i multietničku saradnju organizuje značajnu konferenciju koja će okupiti stručnjake iz oblasti pomirenja i multietničke saradnje.",
    href: "/novosti",
    image: "/images/news/latest.svg",
    featured: true
  };

  const newsItem = article || defaultArticle;

  // Format date in Bosnian - using consistent formatting to avoid hydration mismatch
  const formatBosnianDate = (dateISO: string) => {
    const date = new Date(dateISO);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const months = [
      'januar', 'februar', 'mart', 'april', 'maj', 'juni',
      'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar'
    ];
    
    return `${day}. ${months[month]} ${year}.`;
  };

  return (
    <section className="w-full py-16 bg-[--color-bg]">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 font-heading">
              Najnovije Vijesti
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-body">
              Pratite naše najnovije aktivnosti i događaje
            </p>
          </div>

          {/* News Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
            <Link href={newsItem.href} className="block">
              <div className="flex flex-col lg:flex-row lg:min-h-[400px]">
                {/* Image Section */}
                <div className="relative w-full lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                  <Image
                    src={"/images/news/1.jpg"}
                    alt={newsItem.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Featured Badge */}
                  {newsItem.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center font-['Poppins'] px-3 py-1 rounded-full text-xs font-semibold bg-[#5B2323] text-white shadow-lg">
                        ISTAKNUTO
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="space-y-4">
                    {/* Date */}
                    <p className="text-sm text-stone-500 font-medium font-['Poppins']">
                      {formatBosnianDate(newsItem.dateISO)}
                    </p>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-800 leading-tight font-heading group-hover:text-[#5B2323] transition-colors duration-200">
                      {newsItem.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-body line-clamp-3">
                      {newsItem.excerpt}
                    </p>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <span className="inline-flex items-center px-6 py-3 text-base font-semibold 
                                     bg-[#5B2323] text-white rounded-xl shadow-md hover:bg-[#4a1e1e] 
                                     hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200
                                     focus:outline-none focus:ring-4 focus:ring-[#5B2323]/30 font-['Poppins']">
                        Pogledaj više
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* View All News Link */}
          <div className="text-center mt-8">
            <Link 
              href="/novosti"
              className="inline-flex items-center text-[#5B2323] hover:text-[#4a1e1e] font-semibold transition-colors duration-200"
            >
              Pogledaj sve vijesti
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
