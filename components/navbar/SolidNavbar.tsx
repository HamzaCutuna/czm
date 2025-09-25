"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MainNav } from "./MainNav";
import Image from "next/image";
import { UserMenu } from "./UserMenu";
import { AnimatedMobileMenu } from "./AnimatedMobileMenu";

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
            <Image 
              src="/images/logo-crni.png" 
              alt="Historija TV" 
              className="h-8 md:h-10 lg:h-12 w-auto object-contain" 
              width={80} 
              height={80} 
              priority
              quality={100}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-4">
            <MainNav isSolid={true} />
            <div className="hidden md:block">
              <UserMenu isSolid={true} />
            </div>
          </div>

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

      {/* Animated Mobile Menu */}
      <AnimatedMobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
      />
    </header>
  );
}
