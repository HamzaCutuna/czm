"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { SolidNavbar } from "./SolidNavbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Use transparent navbar only on homepage
  const isHomepage = pathname === "/";
  
  if (isHomepage) {
    return <Navbar />;
  }
  
  return <SolidNavbar />;
}
