"use client";

import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserMenuProps {
  isSolid?: boolean;
}

export function UserMenu({ isSolid = false }: UserMenuProps) {
  const { user, signOut, clearSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        console.warn('Sign out error:', error);
        // If there's an error, try to clear the session anyway
        await clearSession();
        toast.success('Signed out successfully');
      } else {
        toast.success('Signed out successfully');
      }
      router.push('/');
    } catch (err) {
      console.error('Sign out failed:', err);
      // Force clear session on any error
      await clearSession();
      toast.success('Signed out successfully');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  // Only show for authenticated users (WalletBadge handles sign-in for unauthenticated users)
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${
            isSolid 
              ? "border-stone-300 text-stone-700 hover:bg-stone-100" 
              : "border-white/30 text-white hover:bg-white/10"
          }`}
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline truncate max-w-24">
            {user.email?.split('@')[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48"
        sideOffset={8}
      >
        <DropdownMenuItem 
          onClick={handleDashboard}
          className="w-full"
        >
          <Settings className="h-4 w-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          disabled={loading}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {loading ? 'Signing out...' : 'Odjavi se'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
