"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MainNav } from "./MainNav";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { WalletBadge } from "../wallet/WalletBadge";
import { UserMenu } from "./UserMenu";
import { useAuth } from "../auth/AuthProvider";

const mobileNavItems = [
  { href: "/o-nama", label: "O NAMA" },
  { href: "/kalendar", label: "KALENDAR" },
  { href: "/vremenska-linija", label: "VREMENSKA LINIJA" },
  { href: "/galerija", label: "GALERIJA" },
  { href: "/igre", label: "IGRE" },
  { href: "/obavjestenja", label: "OBAVJEŠTENJA" },
];

export function Navbar() {
  const [isSolid, setIsSolid] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const el = document.getElementById("nav-sentinel");
    if (!el) return;
    
    const io = new IntersectionObserver(
      ([e]) => {
        setIsSolid(!e.isIntersecting);
        setIsScrolled(!e.isIntersecting);
      }, 
      { rootMargin: "-72px 0px 0px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 safe-area-top safe-area-left safe-area-right",
        isSolid || isMobileMenuOpen
          ? "bg-[#F6F1E7]/95 text-stone-900 shadow-sm backdrop-blur-xl border-b border-stone-300/50"
          : "text-white"
      )}
      style={!isSolid && !isMobileMenuOpen ? { 
        backgroundColor: 'transparent !important',
        background: 'none !important',
        backgroundImage: 'none !important'
      } : {}}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo and Brand */}
        <Link
          href="/"
          className="flex items-center space-x-2 sm:space-x-3 focus-ring rounded-md min-w-0 flex-shrink-0"
          onClick={closeMobileMenu}
        >
          <Image 
            src={isScrolled ? "/images/logo-crni.png" : "/images/logo-historija.png"} 
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
            <MainNav isSolid={isSolid} />
            <WalletBadge isSolid={isSolid} />
            <UserMenu isSolid={isSolid} />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={cn(
              "md:hidden inline-flex items-center justify-center p-2 rounded-md transition-colors focus-ring",
              isSolid || isMobileMenuOpen
                ? "text-stone-700 hover:text-[--color-primary] hover:bg-stone-100"
                : "text-white hover:text-white/90 hover:bg-white/10"
            )}
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
          className="md:hidden bg-[#F6F1E7]/95 backdrop-blur-xl border-t border-stone-300/50 shadow-lg"
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
