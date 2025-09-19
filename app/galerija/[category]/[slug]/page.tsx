import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Images } from "lucide-react";
import { getGalleryCategoryById, getGalleryEventByCategoryAndSlug } from "@/lib/galleryData";
import { getGalleryImages } from "@/lib/fs-gallery";
import { YouTubeEmbed } from "@/components/ui/youtube-embed";
import GalleryClient from "@/app/galerija/[category]/[slug]/GalleryClient";

interface PageProps {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const category = getGalleryCategoryById(params.category);
  const event = getGalleryEventByCategoryAndSlug(params.category, params.slug);
  
  if (!category || !event) {
    return {
      title: "Galerija nije pronađena | TV Kalendar",
    };
  }

  return {
    title: `${event.title} | ${category.title} | Galerija | TV Kalendar`,
    description: event.description || `Pregledajte multimediju o ${event.title.toLowerCase()}.`,
  };
}

export default function GalleryEventPage({ params }: PageProps) {
  const category = getGalleryCategoryById(params.category);
  const event = getGalleryEventByCategoryAndSlug(params.category, params.slug);
  
  if (!category || !event) {
    notFound();
  }

  // Map slug to actual folder name
  const folderMap: Record<string, string> = {
    "srebrenica-1995": "srebrenica-1995",
    "opsada-sarajeva": "opsada-sarajeva",
    "stari-most": "stari-most",
    "vukovar-1991": "vukovar-1991",
    "oluja-1995": "oluja-1995",
    "nato-bombardovanje-1999": "nato-bombardovanje-1999",
    "kosovo-1999": "kosovo-1999",
    "holokaust": "holokaust",
    "berlinski-zid": "berlinski-zid",
    "mandela-apartheid": "mandela-apartheid"
  };
  
  const folderName = folderMap[params.slug] || params.slug;
  const images = getGalleryImages(folderName);

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800">
      {/* Header */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link 
            href={`/galerija/${category.id}`} 
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Nazad na {category.title}
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
                <Images className="h-12 w-12 text-amber-700" />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="text-xl text-stone-600 mb-4">{event.subtitle}</p>
            )}
            {event.description && (
              <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Images Grid */}
          {images.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-stone-900 font-heading mb-8">
                Fotografije
              </h2>
              <GalleryClient images={images} />
            </section>
          )}

          {/* YouTube Video Section */}
          {params.slug === "srebrenica-1995" && (
            <section>
              <h2 className="text-3xl font-bold text-stone-900 font-heading mb-8">
                Video materijal
              </h2>
              <YouTubeEmbed 
                videoId="QfInjlNoT4Q" 
                title="Dokumentarni film o genocidu u Srebrenici"
                className="max-w-4xl mx-auto"
              />
            </section>
          )}
          
          {params.slug === "opsada-sarajeva" && (
            <section>
              <h2 className="text-3xl font-bold text-stone-900 font-heading mb-8">
                Video materijal
              </h2>
              <YouTubeEmbed 
                videoId="DxpnRvj7OeI" 
                title="Dokumentarni film o opsadi Sarajeva"
                className="max-w-4xl mx-auto"
              />
            </section>
          )}
          
          {params.slug === "stari-most" && (
            <section>
              <h2 className="text-3xl font-bold text-stone-900 font-heading mb-8">
                Video materijal
              </h2>
              <YouTubeEmbed 
                videoId="bK-CGVJ7UU4" 
                title="Dokumentarni film o Starom mostu u Mostaru"
                className="max-w-4xl mx-auto"
              />
            </section>
          )}
          
          {params.slug === "vukovar-1991" && (
            <section>
              <h2 className="text-3xl font-bold text-stone-900 font-heading mb-8">
                Video materijal
              </h2>
              <YouTubeEmbed 
                videoId="4vuYLN1E_qA" 
                title="Dokumentarni film o bitci za Vukovar"
                className="max-w-4xl mx-auto"
              />
            </section>
          )}

          {/* Text Content - Srebrenica */}
          {params.slug === "srebrenica-1995" && (
            <section className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-stone-900 font-heading mb-6">
                Srebrenica 1995
              </h2>
              
              <div className="space-y-6 text-stone-700 leading-relaxed">
                <p>
                  Genocid u Srebrenici je jedan od najtragičnijih događaja u historiji Bosne i Hercegovine. 
                  Tokom jula 1995. godine, srpske snage su napale i zauzele sigurnu zonu Srebrenica, 
                  koja je bila pod zaštitom Ujedinjenih naroda.
                </p>
                
                <p>
                  U periodu od 11. do 22. jula 1995. godine, preko 8.000 Bošnjaka, uglavnom muškaraca i dječaka, 
                  je sistematski ubijeno. Ovaj događaj je Međunarodni sud za ratne zločine u bivšoj Jugoslaviji 
                  kvalificirao kao genocid.
                </p>
                
                <p>
                  Danas se na lokaciji genocida nalazi Memorijalni centar Potočari, koji služi kao mjesto 
                  sjećanja na žrtve i edukacije o važnosti poštovanja ljudskih prava.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-stone-900 font-heading mt-12 mb-6">
                Svjedočanstva
              </h3>
              
              <div className="space-y-6">
                <blockquote className="border-l-4 border-amber-500 pl-6 italic text-stone-700">
                  &ldquo;Nisu mi samo djeca ubijena, cijela porodica je ubijena. Ubijena su mi dva brata, dva sina mog brata, sinovi mojih sestara, moji rođaci i njihova djeca. Nije bilo nikoga koga bi se moglo ubiti.&rdquo;
                  <footer className="mt-2 text-sm text-stone-600 not-italic">
                    — Hatidža Mehmedović
                  </footer>
                </blockquote>
                
                <blockquote className="border-l-4 border-amber-500 pl-6 italic text-stone-700">
                  &ldquo;Bosanski rat mi je oduzeo sve – dom, oca, stričeve i prijatelje. Sve što sam nekada poznavao.&rdquo;
                  <footer className="mt-2 text-sm text-stone-600 not-italic">
                    — Smajo Bešo
                  </footer>
                </blockquote>
              </div>
            </section>
          )}

          {/* Text Content - Opsada Sarajeva */}
          {params.slug === "opsada-sarajeva" && (
            <section className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-stone-900 font-heading mb-6">
                Opsada Sarajeva 1992–1995
              </h2>
              
              <div className="space-y-6 text-stone-700 leading-relaxed">
                <p>
                  Opsada Sarajeva je najduža opsada u modernoj historiji, koja je trajala 1.425 dana od 5. aprila 1992. 
                  do 29. februara 1996. godine. Tokom ovog perioda, grad je bio potpuno okružen srpskim snagama 
                  koje su ga bombardovale iz okolnih brda.
                </p>
                
                <p>
                  Opsada je rezultirala sa preko 11.000 poginulih civila, uključujući preko 1.500 djece. 
                  Grad je bio bez struje, vode, gasa i telefonske veze. Stanovnici su živjeli u konstantnom strahu 
                  od snajpera i artiljerijskih napada.
                </p>
                
                <p>
                  Tokom opsade, Sarajevo je postalo simbol otpora i preživljavanja. Stanovnici su organizovali 
                  koncerte, pozorišne predstave i kulturne manifestacije kao način da očuvaju ljudskost 
                  u najtežim uslovima.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-stone-900 font-heading mt-12 mb-6">
                Svjedočanstva
              </h3>
              
              <div className="space-y-6">
                <blockquote className="border-l-4 border-amber-500 pl-6 italic text-stone-700">
                  &ldquo;Svaki dan je bio borba za preživljavanje. Nismo znali hoćemo li doživjeti sljedeći dan, ali smo se držali zajedno kao zajednica.&rdquo;
                  <footer className="mt-2 text-sm text-stone-600 not-italic">
                    — Preživjeli iz opsade Sarajeva
                  </footer>
                </blockquote>
                
                <blockquote className="border-l-4 border-amber-500 pl-6 italic text-stone-700">
                  &ldquo;Opsada nas je naučila da je ljudskost najvažnija stvar koju možemo očuvati u najtežim trenucima.&rdquo;
                  <footer className="mt-2 text-sm text-stone-600 not-italic">
                    — Sarajevski građanin
                  </footer>
                </blockquote>
              </div>
            </section>
          )}

          {/* Text Content - Stari most */}
          {params.slug === "stari-most" && (
            <section className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-stone-900 font-heading mb-6">
                Stari most u Mostaru
              </h2>
              
              <div className="space-y-6 text-stone-700 leading-relaxed">
                <p>
                  Stari most u Mostaru je bio jedan od najpoznatijih mostova u Bosni i Hercegovini, 
                  izgrađen 1566. godine za vrijeme Osmanskog carstva. Most je simbolizirao jedinstvo 
                  različitih naroda i kultura koje su živjele u Mostaru.
                </p>
                
                <p>
                  9. novembra 1993. godine, tokom rata u Bosni i Hercegovini, most je srušen 
                  hrvatskim artiljerijskim napadom. Rušenje Starog mosta je šokiralo svijet 
                  i postalo simbol uništavanja kulturnog naslijeđa tokom rata.
                </p>
                
                <p>
                  Most je obnovljen 2004. godine uz pomoć međunarodne zajednice, koristeći 
                  tradicionalne tehnike gradnje. Danas je UNESCO-ova svjetska baština 
                  i simbol pomirenja i obnove u regiji.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-stone-900 font-heading mt-12 mb-6">
                Svjedočanstva
              </h3>
              
              <div className="space-y-6">
                <blockquote className="border-l-4 border-amber-500 pl-6 italic text-stone-700">
                  &ldquo;Kada je most srušen, osjećao sam se kao da je srušen dio moje duše. To je bio simbol našeg grada i našeg identiteta.&rdquo;
                  <footer className="mt-2 text-sm text-stone-600 not-italic">
                    — Mostarski građanin
                  </footer>
                </blockquote>
                
                <blockquote className="border-l-4 border-amber-500 pl-6 italic text-stone-700">
                  &ldquo;Obnova mosta je bila obnova nade. Pokazala je da možemo graditi mostove između ljudi, a ne samo između obala.&rdquo;
                  <footer className="mt-2 text-sm text-stone-600 not-italic">
                    — Mostarski aktivist
                  </footer>
                </blockquote>
              </div>
            </section>
          )}

          {/* Text Content - Vukovar 1991 */}
          {params.slug === "vukovar-1991" && (
            <section className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-stone-900 font-heading mb-6">
                Bitka za Vukovar 1991
              </h2>
              
              <div className="space-y-6 text-stone-700 leading-relaxed">
                <p>
                  Bitka za Vukovar je bila jedna od najžešćih i najdužih bitaka u ratu u Hrvatskoj, 
                  koja je trajala 87 dana od 25. augusta do 18. novembra 1991. godine. 
                  Grad je bio potpuno opkoljen i bombardovan srpskim snagama.
                </p>
                
                <p>
                  Tokom opsade, Vukovar je pretrpio ogromna razaranja - preko 90% grada je uništeno. 
                  Gradska bolnica je bila bombardovana iako je bila označena kao civilni objekt. 
                  Preko 2.000 ljudi je poginulo, uključujući civile i branitelje grada.
                </p>
                
                <p>
                  Nakon pada grada, srpske snage su počinile masovne ratne zločine nad zarobljenim 
                  hrvatskim braniteljima i civilima. Ovaj događaj je postao simbol hrvatskog otpora 
                  i žrtve u Domovinskom ratu.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-stone-900 font-heading mt-12 mb-6">
                Svjedočanstva
              </h3>
              
              <div className="space-y-6">
                <blockquote className="border-l-4 border-amber-500 pl-6 italic text-stone-700">
                  &ldquo;Vukovar je bio naš dom, naš grad. Branili smo ga do poslednjeg daha jer smo znali da je to naša Hrvatska.&rdquo;
                  <footer className="mt-2 text-sm text-stone-600 not-italic">
                    — Vukovarski branitelj
                  </footer>
                </blockquote>
                
                <blockquote className="border-l-4 border-amber-500 pl-6 italic text-stone-700">
                  &ldquo;Bolnica je bila naša nadežda. Kada su je bombardovali, shvatili smo da nema milosti ni za najranjenije.&rdquo;
                  <footer className="mt-2 text-sm text-stone-600 not-italic">
                    — Medicinski radnik iz Vukovara
                  </footer>
                </blockquote>
              </div>
            </section>
          )}

          {/* Generic content section for other galleries */}
          {!["srebrenica-1995", "opsada-sarajeva", "stari-most", "vukovar-1991"].includes(params.slug) && (
            <section className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-stone-900 font-heading mb-6">
                O {event.title.toLowerCase()}
              </h2>
              
              <div className="space-y-6 text-stone-700 leading-relaxed">
                <p>
                  {event.description}
                </p>
                
                <p>
                  Detaljni historijski sadržaj o ovom događaju će biti dodan uskoro.
                </p>
              </div>
            </section>
          )}

          {/* Empty State */}
          {images.length === 0 && (
            <div className="text-center py-16">
              <Images className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-stone-600 mb-2">
                Nema dostupnih slika
              </h2>
              <p className="text-stone-500">
                Slike za ovu galeriju će biti dodane uskoro.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
