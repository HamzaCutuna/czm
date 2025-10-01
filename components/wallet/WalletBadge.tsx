"use client";

import Link from "next/link";
import { useWallet } from "./WalletProvider";
import { useAuth } from "../auth/AuthProvider";
import { Gem, LogIn } from "lucide-react";

interface WalletBadgeProps {
  isSolid?: boolean;
}

export function WalletBadge({ isSolid = false }: WalletBadgeProps) {
  const { wallet } = useWallet();
  const { user } = useAuth();

  // Only show diamonds pill for authenticated users with wallet
  if (!user || !wallet) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 backdrop-blur-sm ${
      isSolid
        ? "border border-stone-300 text-stone-700 bg-stone-50"
        : "border border-white/30 text-white bg-white/10"
    }`}>
      <Gem className="h-4 w-4" />
      <span className="font-medium text-sm">{wallet.diamonds}</span>
    </div>
  );
}
