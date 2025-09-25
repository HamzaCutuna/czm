"use client";

import { useAuth } from "../auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  isSolid?: boolean;
}

export function UserMenu({ isSolid = false }: UserMenuProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  const handleLogin = () => {
    router.push('/auth/signin');
  };

  // Show login button for unauthenticated users on desktop
  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogin}
        className={`flex items-center gap-2 ${
          isSolid 
            ? "border-stone-300 text-stone-700 hover:bg-stone-100" 
            : "border-white/30 text-white hover:bg-white/10"
        }`}
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline truncate max-w-24">
          Prijavi se
        </span>
      </Button>
    );
  }

  // Show user info for authenticated users
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Korisnik';
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDashboard}
      className={`flex items-center gap-2 ${
        isSolid 
          ? "border-stone-300 text-stone-700 hover:bg-stone-100" 
          : "border-white/30 text-white hover:bg-white/10"
      }`}
    >
      <User className="h-4 w-4" />
      <span className="hidden sm:inline truncate max-w-24">
        {displayName}
      </span>
    </Button>
  );
}
