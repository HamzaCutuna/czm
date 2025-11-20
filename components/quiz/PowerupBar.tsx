"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkipForward, Eye, EyeOff } from "lucide-react";
import { useWallet } from "@/components/wallet/WalletProvider";
import { spendDiamonds } from "@/lib/supabase";
import { DEFAULT_REWARDS_CONFIG } from "@/lib/rewards-config";
import { toast } from "sonner";

interface PowerupBarProps {
  onFiftyFifty: () => void;
  onSkip: () => void;
  onRemoveOne: () => void;
  disabled?: boolean;
}

type HelpType = keyof typeof DEFAULT_REWARDS_CONFIG.HELP_COSTS;

export function PowerupBar({ onFiftyFifty, onSkip, onRemoveOne, disabled = false }: PowerupBarProps) {
  const { wallet, canAfford } = useWallet();
  
  const handleHelp = async (helpType: HelpType, action: () => void) => {
    if (disabled) return;
    
    const cost = DEFAULT_REWARDS_CONFIG.HELP_COSTS[helpType];
    
    if (!canAfford(cost)) {
      toast.error(`Nedovoljno dijamanata! Trebate ${cost} 💎`);
      return;
    }
    
    try {
      const { error } = await spendDiamonds(helpType, {});
      
      if (error) {
        toast.error(`Greška: ${error.message}`);
        return;
      }
      
      toast.success(`${helpType === 'fiftyFifty' ? '50/50' : helpType === 'skip' ? 'Skip' : 'Ukloni opciju'} korišten! -${cost} 💎`);
      action();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Nepoznata greška';
      toast.error(`Greška: ${message}`);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-stone-50 rounded-lg border border-amber-200">
      {/* Diamonds Display */}
      <div className="flex items-center gap-2">
        <div className="text-2xl">💎</div>
        <div className="text-lg font-bold text-amber-800">
          {wallet?.diamonds || 0}
        </div>
      </div>

      {/* Help Buttons */}
      <div className="flex gap-2">
        {/* 50/50 Help */}
        <Button
          onClick={() => handleHelp('fiftyFifty', onFiftyFifty)}
          disabled={disabled || !canAfford(DEFAULT_REWARDS_CONFIG.HELP_COSTS.fiftyFifty)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-amber-300 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
        >
          <Eye className="h-4 w-4" />
          <span>50/50</span>
          <Badge variant="secondary" className="ml-1 text-xs">
            {DEFAULT_REWARDS_CONFIG.HELP_COSTS.fiftyFifty} 💎
          </Badge>
        </Button>

        {/* Skip Help */}
        <Button
          onClick={() => handleHelp('skip', onSkip)}
          disabled={disabled || !canAfford(DEFAULT_REWARDS_CONFIG.HELP_COSTS.skip)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-amber-300 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
        >
          <SkipForward className="h-4 w-4" />
          <span>Skip</span>
          <Badge variant="secondary" className="ml-1 text-xs">
            {DEFAULT_REWARDS_CONFIG.HELP_COSTS.skip} 💎
          </Badge>
        </Button>

        {/* Remove One Help */}
        <Button
          onClick={() => handleHelp('removeOne', onRemoveOne)}
          disabled={disabled || !canAfford(DEFAULT_REWARDS_CONFIG.HELP_COSTS.removeOne)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-amber-300 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
        >
          <EyeOff className="h-4 w-4" />
          <span>Ukloni</span>
          <Badge variant="secondary" className="ml-1 text-xs">
            {DEFAULT_REWARDS_CONFIG.HELP_COSTS.removeOne} 💎
          </Badge>
        </Button>
      </div>
    </div>
  );
}
