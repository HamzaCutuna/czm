import Link from "next/link";
import { getAllGalleryCategories } from "@/lib/galleryData";
import { Folder } from "lucide-react";

export const metadata = {
  title: "Galerija | TV Kalendar",
  description: "Zbirke multimedije o ključnim historijskim događajima. Pregledajte fotografije, video materijale i dokumente iz historije Bosne i Hercegovine.",
};

export default function GalleryPage() {
  const categories = getAllGalleryCategories();

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
              <Folder className="h-12 w-12 text-amber-700" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">Galerija</h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Zbirke multimedije o ključnim historijskim događajima. Odaberite kategoriju za pregled sadržaja.
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/galerija/${category.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                    {/* Cover Image */}
                    <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                      {category.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={category.coverImage} 
                          alt={category.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Folder className="h-16 w-16 text-stone-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-amber-100 rounded-full">
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-stone-900 font-heading group-hover:text-amber-700 transition-colors">
                            {category.title}
                          </h2>
                          <p className="text-sm text-stone-600">{category.events.length} događaja</p>
                        </div>
                      </div>
                      
                      <p className="text-stone-700 text-sm leading-relaxed mb-4">
                        {category.description}
                      </p>
                      
                      <div className="flex items-center text-amber-600 text-sm font-medium group-hover:text-amber-700 transition-colors">
                        <span>Pregledaj događaje</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Folder className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-stone-600 mb-2">Nema dostupnih kategorija</h2>
              <p className="text-stone-500">Kategorije će biti dodane uskoro.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


