"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/o-nama", label: "O NAMA" },
  { href: "/kalendar", label: "KALENDAR" },
  { href: "/vremenska-linija", label: "VREMENSKA LINIJA" },
  { href: "/galerija", label: "GALERIJA" },
  { href: "/igre", label: "KVIZOVI" },
  { href: "/projekti", label: "PROJEKTI" },
];

interface MainNavProps {
  isSolid: boolean;
}

export function MainNav({ isSolid }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Glavna navigacija">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-all duration-200 focus-ring rounded-md px-3 py-2 font-heading",
            pathname === item.href
              ? isSolid 
                ? "text-[--color-primary] bg-stone-100" 
                : "text-white bg-white/10 drop-shadow-lg"
              : isSolid
                ? "text-stone-700 hover:text-[--color-primary] hover:bg-stone-100/50"
                : "text-white/95 hover:text-white hover:bg-white/10 drop-shadow-md"
          )}
          aria-current={pathname === item.href ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
