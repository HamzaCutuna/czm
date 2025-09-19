"use client";

import Link from "next/link";
import { useWallet } from "./WalletProvider";
import { useAuth } from "../auth/AuthProvider";
import { Gem, LogIn } from "lucide-react";

interface WalletBadgeProps {
  isSolid?: boolean;
}

export function WalletBadge({ isSolid = false }: WalletBadgeProps) {
  const { user } = useAuth();

  // Hide diamonds pill when user is authenticated
  if (user) {
    return null;
  }

  // Show sign-in button for unauthenticated users
  return (
    <Link
      href="/auth/signin"
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 backdrop-blur-sm ${
        isSolid 
          ? "border border-stone-300 text-stone-700 hover:bg-stone-100" 
          : "border border-white/30 text-white hover:bg-white/10"
      }`}
    >
      <LogIn className="h-4 w-4" />
      <span className="font-medium text-sm">Prijavi se</span>
    </Link>
  );
}
