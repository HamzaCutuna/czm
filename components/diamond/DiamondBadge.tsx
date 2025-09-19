"use client";

import Link from "next/link";
import { useDiamonds } from "./DiamondProvider";
import { Gem } from "lucide-react";

export function DiamondBadge() {
  const { diamonds } = useDiamonds();

  return (
    <Link
      href="/inventar"
      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
    >
      <Gem className="h-4 w-4" />
      <span className="font-semibold text-sm">{diamonds}</span>
    </Link>
  );
}
