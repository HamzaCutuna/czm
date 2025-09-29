"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen,
  Globe,
  Target
} from "lucide-react";
import { VerticalTimelineComponent } from "@/components/timeline/VerticalTimeline";
import { SolidNavbar } from "@/components/navbar/SolidNavbar";

export default function OProjektuPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SolidNavbar />
      <main className="min-h-dvh bg-[--color-bg] text-stone-800 flex-1">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
              <Target className="h-12 w-12 text-amber-700" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">
            O projektu
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Upoznajte naš tim i pratite razvoj Historija TV platforme
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Timeline Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-stone-800 mb-4 font-heading">
                Hodogram razvoja
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Pratite naš put od ideje do realizacije
              </p>
            </div>

            <VerticalTimelineComponent />
          </div>

          {/* Team Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-stone-800 mb-4 font-heading">
                Naš tim
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
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
                        Nina Bijedić
                      </h3>
                        
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;[placeholder]&rdquo;
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
                        Sanja Kapetanović
                      </h3>
                      
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;[placeholder]&rdquo;
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
                        Amela Medar
                      </h3>
                      
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;[placeholder]&rdquo;
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-stone-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-800 font-heading">
                        Amina Gutošić
                      </h3>
                      
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;[placeholder]&rdquo;
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
                        Amna Bijedić
                      </h3>
                      
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;[placeholder]&rdquo;
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
                        Anida Čmanjčanin
                      </h3>
                      
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;[placeholder]&rdquo;
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-stone-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-800 font-heading">
                        Berun Agić
                      </h3>
                      
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;Moja motivacija za rad na projektu CZM - FIT jeste želja za prezervacijom i edukacijom historije kroz jedan interaktivan i savremeni način ostvaren uz pomoć implementacije koncepta koji se koriste u modernom razvoju aplikacija. Samim tim, dobivam mogućnost rada na društveno korisnom projektu gdje također povećavam svoje znanje i vještine.&rdquo;
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
                        Nejla Čajdin
                      </h3>
                      
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;Moja motivacija da radim na ovom projektu proizlazi iz uvjerenja da je važno prikupljati i čuvati historijske podatke, jer oni pomažu u boljem razumijevanju prošlosti. Zbog toga ovu stranicu doživljavam kao priliku da se sadržaji trajno sačuvaju i ostanu dostupni budućim generacijama.&rdquo;
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
                        Edina Čmanjčanin
                      </h3>
                      
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;Smatram da je očuvanje kolektivnog sjećanja na prošlost naše države, naročito one ratne, ključno za izgradnju boljeg i pravednijeg društva u budućnosti. Vjerujem da je jako važno i vrijedno biti dio tog procesa.&rdquo;
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-stone-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-800 font-heading">
                        Elda Sultić
                      </h3>
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;[placeholder]&rdquo;
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
                        Hamza Čutuna
                      </h3>
                     
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;Moja motivacija za rad na projektu proističe iz želje da se historija ne zaboravi, već da se prenese i prezentuje na savremen, interaktivan način. Smatram da projekat ima ogromnu društvenu vrijednost jer omogućava mladima, ali i široj javnosti, da na jednostavan način uče i istražuju prošlost kroz moderne tehnologije.&rdquo;
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
                        Iris Memić
                      </h3>
                      
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;[placeholder]&rdquo;
                  </p>
                </CardContent>
              </Card>

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
                      
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;Rad na ovom projektu mi znači jer kroz njega osjećam da postajem dio historije Mostara, grada u kojem sam rođena i koji nosim u srcu. Svaki moj doprinos je vrijedan način da čuvam priče i sjećanja našeg grada za buduće generacije. Sudjelovanje u ovom projektu podsjeća me da ono što stvaramo živi i nakon nas i ostaje utkano u vrijeme.&rdquo;
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
                        Adil Joldić
                      </h3>
                     
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;[placeholder]&rdquo;
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
                        Dino Burić
                      </h3>
                     
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    &ldquo;[placeholder]&rdquo;
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
    </div>
  );
}
