"use client";

import Link from "next/link";

export default function AboutUs() {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Old paper container with texture and styling */}
          <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 
                          rounded-2xl shadow-lg border border-amber-200/50 overflow-hidden">
            
            {/* Content with proper z-index */}
            <div className="relative z-10 p-8 sm:p-12 lg:p-16">
              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-8 text-center font-heading">
                Inspirišemo Pomirenje Među Različitim Zajednicama. 
              </h2>
              
              {/* Paragraphs */}
              <div className="space-y-6 text-center">
                <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-body">
                  Centar za mir i multietničku saradnju (Bosna i Hercegovina) zamišlja budućnost u kojoj se bolna ratna prošlost pretvara u lekcije pomirenja i jedinstva. Čuvanjem i dijeljenjem znanja, inspirišemo multietničko društvo zasnovano na međusobnom poštovanju i miru.
                </p>
                
                <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-body">
                  Kroz dijalog među zajednicama, gradimo trajno naslijeđe harmonije i podržavamo obnovu društva putem razumijevanja, iscjeljenja i zajedničkih vrijednosti.
                </p>
              </div>
              
              {/* Button */}
              <div className="mt-10 text-center">
                <Link 
                  href="/o-nama"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold 
                             bg-[#5B2323] text-white rounded-xl shadow-lg hover:bg-[#4a1e1e] 
                             hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200
                             focus:outline-none focus:ring-4 focus:ring-[#5B2323]/30 font-['Poppins']"
                >
                  Naša vizija
                </Link>
              </div>
            </div>
            
            {/* Subtle inner shadow for depth */}
            <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
