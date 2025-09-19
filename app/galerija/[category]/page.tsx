import Link from "next/link";
import { notFound } from "next/navigation";
import { getGalleryCategoryById } from "@/lib/galleryData";
import { Folder, ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = getGalleryCategoryById(params.category);
  
  if (!category) {
    return {
      title: "Kategorija nije pronađena | TV Kalendar",
    };
  }

  return {
    title: `${category.title} - Galerija | TV Kalendar`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getGalleryCategoryById(params.category);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
              <span className="text-4xl">{category.icon}</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">{category.title}</h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/galerija"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Nazad na galeriju</span>
          </Link>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {category.events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.events.map((event) => (
                <Link
                  key={event.slug}
                  href={`/galerija/${category.id}/${event.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                    {/* Cover Image */}
                    <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                      {event.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={event.coverImage} 
                          alt={event.title}
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
                        <div className="p-2 bg-amber-100 rounded-full">
                          <Folder className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-stone-900 font-heading group-hover:text-amber-700 transition-colors">
                            {event.title}
                          </h2>
                          {event.subtitle && (
                            <p className="text-sm text-stone-600">{event.subtitle}</p>
                          )}
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="text-stone-700 text-sm leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Folder className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-stone-600 mb-2">Nema dostupnih događaja</h2>
              <p className="text-stone-500">Događaji za ovu kategoriju će biti dodani uskoro.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
