"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Award, MapPin, Phone, Mail, Globe } from "lucide-react";
import { SolidNavbar } from "@/components/navbar/SolidNavbar";

export default function ONamaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SolidNavbar />
      <main className="min-h-dvh bg-[--color-bg] text-stone-800 flex-1">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
              <Users className="h-12 w-12 text-amber-700" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">
            O nama
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Upoznajte Centar za mir i multietničku saradnju Mostar
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
                     {/* Mission and Vision Statements */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
             {/* Mission Statement */}
             <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50 overflow-hidden rounded-xl">
               <CardContent className="p-8 text-center">
                 <div className="flex justify-center mb-6">
                   <div className="p-3 bg-amber-100 rounded-full">
                     <Target className="h-8 w-8 text-amber-700" />
                   </div>
                 </div>
                 <h2 className="text-2xl font-bold text-stone-800 mb-6 font-heading">
                   Naša misija
                 </h2>
                 <p className="text-stone-600 leading-relaxed">
                   Spriječiti da se zaboravi zlo kroz koje su prošli građani Mostara i Hercegovine svih nacionalnosti, 
                   te da istina o istom bude nezaboravno svedočanstvo i opomena budućim generacijama.
                 </p>
               </CardContent>
             </Card>

             {/* Vision Statement */}
             <Card className="border-0 shadow-2xl bg-white overflow-hidden rounded-xl">
               <CardContent className="p-8 text-center">
                 <div className="flex justify-center mb-6">
                   <div className="p-3 bg-blue-100 rounded-full">
                     <Globe className="h-8 w-8 text-blue-700" />
                   </div>
                 </div>
                 <h2 className="text-2xl font-bold text-stone-800 mb-6 font-heading">
                   Naša vizija
                 </h2>
                 <p className="text-stone-600 leading-relaxed">
                   Naša iskrena namjera je promovisanje razvoja multietničkog društva u Bosni i Hercegovini i na 
                   prostorima bivše Jugoslavije, uz otvoreni dijalog prema svim stranama.
                 </p>
               </CardContent>
             </Card>
           </div>

          

          {/* History Section */}
          <div className="border-0 shadow-2xl bg-gradient-to-br from-stone-50 to-amber-50 mb-12 overflow-hidden rounded-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-stone-800 mb-6 font-heading">
                  Historija
                </h2>
                <p className="text-stone-600 leading-relaxed mb-6">
                Mi smo nevladina i neprofitabilna organizacija osnovana radi istraživanja i dokumentovanja važnih događaja u historiji grada Mostara i Hercegovine, u periodu od 1990 do 2004 godine. Centar posjeduje dokumentarnu građu koja se sastoji od više hiljada originalnih fotografija i filmova , autentičnih dokumenata i oko 3000 sati video materijala, koji svjedoči o događajima u Mostaru i Hercegovini u proteklom periodu.
                </p>
                <p className="text-stone-600 leading-relaxed">
                Centar nastoji da kroz naučnoistraživački rad prikupi podatke o mnogim događajima u Mostaru i Hercegovini, s namjerom da se ti događaji istraže i učine dostupnim javnosti, putem publikacija, knjiga i dokumentarnih filmova.
                </p>
              </div>
              <div className="relative h-64 lg:h-full">
                <img
                  src="/images/hero-image2.png"
                  alt="Historija Centra za mir"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.png';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Programs Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-stone-800 mb-4 font-heading">
                Naši programi
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Kroz različite programe i inicijative, radimo na izgradnji mira i razumijevanja
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="h-6 w-6 text-blue-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 font-heading">
                      Međunarodna saradnja
                    </h3>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    Razvijamo partnerstva sa organizacijama iz cijelog svijeta, dijelimo iskustva i 
                    implementiramo inovativne pristupe mirovnoj izgradnji.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 font-heading">
                      Edukacija mladih
                    </h3>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    Organizujemo edukativne programe za mlade koji promovišu toleranciju, 
                    razumijevanje i aktivno građanstvo.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Award className="h-6 w-6 text-amber-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 font-heading">
                      Kulturni događaji
                    </h3>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    Organizujemo kulturno-umjetničke manifestacije koje promovišu različitost 
                    i bogatstvo našeg kulturnog naslijeđa.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Heart className="h-6 w-6 text-purple-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 font-heading">
                      Psihosocijalna podrška
                    </h3>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    Pružamo psihosocijalnu podršku žrtvama rata i njihovim porodicama, 
                    pomažući u procesu oporavka i pomirenja.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Section */}
          <Card className="border-0 shadow-2xl bg-black overflow-hidden rounded-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4 font-heading">
                  Kontaktirajte nas
                </h2>
                <p className="text-stone-300 leading-relaxed">
                  Slobodno nas kontaktirajte za više informacija o našim programima i aktivnostima
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-white/10 rounded-full">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Adresa</h3>
                  <p className="text-stone-300 text-sm">
                  Mala Tepa 16, 88000 Mostar, BiH
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Telefon</h3>
                  <p className="text-stone-300 text-sm">
                  +387 36 506 999
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Email</h3>
                  <p className="text-stone-300 text-sm">
                  info@centarzamir.org.ba
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
    </div>
  );
}
