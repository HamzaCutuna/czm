"use client";

import Link from "next/link";
import { Mail, Phone, Facebook, Instagram, Globe } from "lucide-react";
import Image from "next/image";

const currentYear = new Date().getFullYear();

const links = [
  { href: "/", label: "Početna" },
  { href: "/kalendar", label: "Kalendar" },
  { href: "/vremenska-linija", label: "Vremenska linija" },
  { href: "/galerija", label: "Galerija" },
  { href: "/igre", label: "Kvizovi" },
  { href: "/o-projektu", label: "O projektu" },
];

export function SiteFooter() {
  return (
    <footer className="relative bg-gradient-to-b from-[#4A2E1A] via-[#2D1C12] to-[#4A2E1A] text-amber-50">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-300/30 to-transparent" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* mobile: stack; md+: 2 columns with divider */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Brand & info */}
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-historija.png"
                alt="Historija TV"
                width={64}
                height={64}
                className="h-16 w-auto object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>

            <p className="text-stone-200 leading-relaxed">
              Historija TV pruža edukativni sadržaj o historijskim događajima kroz
              interaktivne igre, kalendar i multimedijalne materijale.
            </p>

            <div className="space-y-3 text-stone-200">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-stone-300" />
                <a
                  href="mailto:hello@cfpmn.org"
                  className="hover:text-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300/60 focus:ring-offset-2 focus:ring-offset-[#2D1C12] rounded"
                >
                  hello@cfpmn.org
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-stone-300" />
                <a
                  href="tel:+387036506999"
                  className="hover:text-stone-50 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300/60 focus:ring-offset-2 focus:ring-offset-[#2D1C12] rounded"
                >
                  +387 (0) 36 506 999
                </a>
              </div>

              <div className="text-stone-300 text-sm pt-2">
                <p>Mala Tepa 16</p>
                <p>88000 Mostar, Bosna i Hercegovina</p>
              </div>
            </div>
          </div>

          {/* Navigacija — mobile: left & directly below; md+: right column */}
          <div className="md:col-span-5 md:border-l md:border-stone-700/40 md:pl-8 lg:pl-10 md:self-end">
            {/* headings & links left-aligned on mobile, right-aligned on md+ */}
            <h3 className="text-xl font-semibold text-stone-50 font-heading text-left md:text-right">
              Navigacija
            </h3>

            <nav className="mt-4 space-y-3 text-left md:text-right">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block text-stone-200 hover:text-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300/60 focus:ring-offset-2 focus:ring-offset-[#2D1C12] rounded"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* socials: left on mobile, right on md+ */}
            <div className="mt-6 flex justify-start md:justify-end gap-2">
              <a
                href="https://www.facebook.com/centarzamir/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-300 hover:text-stone-50 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-stone-300/60 focus:ring-offset-2 focus:ring-offset-[#2D1C12]"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/centar_za_mir/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-300 hover:text-stone-50 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-stone-300/60 focus:ring-offset-2 focus:ring-offset-[#2D1C12]"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://centarzamir.org.ba/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-300 hover:text-stone-50 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-stone-300/60 focus:ring-offset-2 focus:ring-offset-[#2D1C12]"
                aria-label="Web"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-700/50">
          <p className="text-center text-stone-300 text-sm">
            © {currentYear} Centar za mir i multietničku saradnju Mostar. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
}
