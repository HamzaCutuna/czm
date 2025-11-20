"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, LogIn, User } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../auth/AuthProvider";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AnimatedMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const mobileNavItems = [
  { href: "/", label: "POČETNA" },
  { href: "/kalendar", label: "KALENDAR" },
  { href: "/galerija", label: "GALERIJA" },
  { href: "/igre", label: "KVIZOVI" },
  { href: "/o-projektu", label: "O PROJEKTU" },
];

export function AnimatedMobileMenu({ isOpen, onClose }: AnimatedMobileMenuProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Allow body scroll when menu is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const handleNavClick = () => {
    handleClose();
  };

  const handleLoginClick = () => {
    handleClose();
    router.push('/auth/signin');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Menu Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-screen w-full max-w-sm shadow-2xl z-50 transform transition-transform duration-300 ease-out bg-white flex flex-col",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
        style={{ 
          backgroundColor: 'white !important',
          background: 'white !important',
          opacity: '1 !important',
          height: '100vh',
          minHeight: '100vh'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-white">
          <div className="flex items-center">
            <Image 
              src="/images/navbar-crni.png" 
              alt="Historija TV" 
              className="h-8 w-auto object-contain" 
              width={80} 
              height={80} 
              priority
              quality={100}
            />
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Zatvori meni"
          >
            <X className="h-6 w-6 text-stone-600" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto bg-white">
          <nav className="p-6 bg-white">
            <div className="space-y-2">
              {mobileNavItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-4 py-4 text-base font-medium text-stone-800 hover:text-[--color-primary] hover:bg-stone-50 rounded-lg transition-all duration-200 font-heading",
                    "transform transition-transform duration-200",
                    isVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  )}
                  style={{ 
                    transitionDelay: `${index * 50}ms` 
                  }}
                  onClick={handleNavClick}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Footer with Login/Dashboard Button - Fixed at bottom */}
        <div className="border-t border-stone-200 p-6 bg-white mt-auto">
          {!user ? (
            <button
              onClick={handleLoginClick}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-6 py-4 bg-[--color-secondary] text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-[--color-secondary]/90 hover:scale-[1.02] shadow-lg",
                "transform transition-transform duration-200",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ 
                transitionDelay: `${mobileNavItems.length * 50 + 100}ms` 
              }}
            >
              <LogIn className="h-5 w-5" />
              Prijavi se
            </button>
          ) : (
            <div className="text-center space-y-3">
              <Link
                href="/dashboard"
                onClick={handleNavClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-900 font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-sm"
              >
                <User className="h-5 w-5" />
                Idi na Dashboard
              </Link>
              <p className="text-stone-500 text-xs">
                Prijavljen kao {user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
