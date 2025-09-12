"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MainNav } from "./MainNav";
import { cn } from "@/lib/utils";
import Image from "next/image";

const mobileNavItems = [
  { href: "/o-nama", label: "O NAMA" },
  { href: "/kalendar", label: "KALENDAR" },
  { href: "/vremenska-linija", label: "VREMENSKA LINIJA" },
  { href: "/galerija", label: "GALERIJA" },
  { href: "/igre", label: "IGRE" },
  { href: "/novosti", label: "NOVOSTI" },
];

export function SolidNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-[#F6F1E7]/95 text-stone-900 shadow-sm backdrop-blur border-b border-stone-300/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 focus-ring rounded-md"
            onClick={closeMobileMenu}
          >
            <div className="h-8 w-8 rounded-full flex items-center justify-center">
              <Image src="/images/logo.png" alt="Centar za mir" className="h-8 w-8" width={32} height={32} />
            </div>
            <span className="text-lg font-semibold text-stone-800 font-heading">
              Centar za mir
            </span>
          </Link>

          {/* Desktop Navigation */}
          <MainNav isSolid={true} />

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md transition-colors focus-ring text-stone-700 hover:text-[--color-primary] hover:bg-stone-100"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Otvori navigaciju"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-[#F6F1E7]/60 backdrop-blur-xl border-t border-stone-300/30 shadow-lg"
          role="navigation"
          aria-label="Mobilna navigacija"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-stone-800 hover:text-[--color-primary] hover:bg-white/30 rounded-md transition-colors focus-ring font-heading"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
