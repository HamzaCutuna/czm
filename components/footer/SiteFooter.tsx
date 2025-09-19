"use client";

import Link from "next/link";
import { Mail, Phone, Facebook, Instagram, Globe } from "lucide-react";
import Image from "next/image";

const currentYear = new Date().getFullYear();

const quickLinks = [
  { href: "/", label: "Početna" },
  { href: "/kviz", label: "Kviz" },
  { href: "/kalendar", label: "Kalendar" },
  { href: "/vremenska-linija", label: "Vremenska linija" },
  { href: "/obavjestenja", label: "Obavještenja" },
  { href: "/o-nama", label: "O nama" },
];

const projekti = [
  { label: "Peace Connection Award" },
  { label: "Historijski kalendar" },
  { label: "Historija TV" },
  { label: "Arhiva" },
];



export function SiteFooter() {
  return (
    <footer className="relative bg-gradient-to-b from-[#4A2E1A] via-[#2D1C12] to-[#4A2E1A] text-amber-50">
      {/* Top divider with vignette effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-stone-300/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <Image 
                src="/images/logo-historija.png" 
                alt="Historija TV" 
                className="h-16 w-auto object-contain" 
                width={64} 
                height={64} 
              />
            </div>
            
            <p className="text-stone-200 leading-relaxed max-w-md">
              Historija TV pruža edukativni sadržaj o historijskim događajima kroz interaktivne igre, kalendar i multimedijalne materijale.
            </p>
            
            <div className="space-y-3 text-stone-200">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-stone-300" />
                <a
                  href="mailto:hello@cfpmn.org"
                  className="hover:text-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-[#5B2323] rounded"
                >
                  hello@cfpmn.org
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-stone-300" />
                <a
                  href="tel:+387036506999"
                  className="hover:text-stone-50 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-[#5B2323] rounded"
                >
                  +387 (0) 36 506 999
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-stone-50 font-heading">Brze veze</h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-stone-200 hover:text-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-[#5B2323] rounded"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Projekti */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-stone-50 font-heading">Projekti</h3>
            <div className="space-y-3">
              {projekti.map((projekt) => (
                <div
                  key={projekt.label}
                  className="text-stone-200 hover:text-stone-50 transition-colors cursor-default"
                >
                  {projekt.label}
                </div>
              ))}
            </div>
            
            {/* Address */}
            <div className="text-stone-300 text-sm pt-2">
              <p>Mala Tepa 16</p>
              <p>88000 Mostar, Bosna i Hercegovina</p>
            </div>
          </div>
        </div>

                {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-700/50">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <p className="text-stone-300 text-sm">
              © {currentYear} Centar za mir i multietnicku saradnju Mostar. Sva prava zadržana.
            </p>
            
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/centarzamir/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-300 hover:text-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-[#4A2E1A] rounded"
                aria-label="Pratite nas na Facebook-u"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/centar_za_mir/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-300 hover:text-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-[#4A2E1A] rounded"
                aria-label="Pratite nas na Instagram-u"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://centarzamir.org.ba/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-300 hover:text-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-[#4A2E1A] rounded"
                aria-label="Posjetite našu web stranicu"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
