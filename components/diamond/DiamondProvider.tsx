"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface DiamondProfile {
  diamonds: number;
  streak: number;
  lastLoginISO: string | null;
  inventory: {
    hints: number;
  };
  history: Array<{
    ts: number;
    delta: number;
    reason: string;
  }>;
}

interface DiamondContextType {
  diamonds: number;
  streak: number;
  add: (amount: number, reason: string) => void;
  spend: (amount: number, reason: string) => boolean;
  canAfford: (amount: number) => boolean;
  updateStreak: (onCorrect: boolean) => void;
  getDailyBonus: () => boolean;
  profile: DiamondProfile;
}

const DiamondContext = createContext<DiamondContextType | undefined>(undefined);

const STORAGE_KEY = "diamond_profile_v1";
const MAX_DAILY_EARNINGS = 100;

const defaultProfile: DiamondProfile = {
  diamonds: 10, // Starting diamonds
  streak: 0,
  lastLoginISO: null,
  inventory: {
    hints: 0,
  },
  history: [],
};

export function DiamondProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<DiamondProfile>(defaultProfile);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DiamondProfile;
        setProfile(parsed);
      }
    } catch (error) {
      console.warn("Failed to load diamond profile:", error);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.warn("Failed to save diamond profile:", error);
    }
  }, [profile]);

  const add = (amount: number, reason: string) => {
    setProfile(prev => {
      const today = new Date().toISOString().split('T')[0];
      const todayEarnings = prev.history
        .filter(h => new Date(h.ts).toISOString().split('T')[0] === today && h.delta > 0)
        .reduce((sum, h) => sum + h.delta, 0);
      
      // Check daily earning cap
      if (todayEarnings + amount > MAX_DAILY_EARNINGS) {
        const allowedAmount = Math.max(0, MAX_DAILY_EARNINGS - todayEarnings);
        if (allowedAmount === 0) return prev;
        amount = allowedAmount;
      }

      const newProfile = {
        ...prev,
        diamonds: prev.diamonds + amount,
        history: [
          ...prev.history,
          {
            ts: Date.now(),
            delta: amount,
            reason,
          },
        ],
      };
      return newProfile;
    });
  };

  const spend = (amount: number, reason: string): boolean => {
    if (!canAfford(amount)) return false;
    
    setProfile(prev => ({
      ...prev,
      diamonds: prev.diamonds - amount,
      history: [
        ...prev.history,
        {
          ts: Date.now(),
          delta: -amount,
          reason,
        },
      ],
    }));
    return true;
  };

  const canAfford = (amount: number): boolean => {
    return profile.diamonds >= amount;
  };

  const updateStreak = (onCorrect: boolean) => {
    setProfile(prev => {
      const newStreak = onCorrect ? prev.streak + 1 : 0;
      
      // Check for streak bonus (every 5 correct answers)
      if (onCorrect && newStreak % 5 === 0 && newStreak > 0) {
        add(3, `5-streak bonus (${newStreak} streak)`);
      }
      
      return {
        ...prev,
        streak: newStreak,
      };
    });
  };

  const getDailyBonus = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = profile.lastLoginISO?.split('T')[0];
    
    if (lastLogin !== today) {
      setProfile(prev => ({
        ...prev,
        lastLoginISO: new Date().toISOString(),
      }));
      add(3, "Daily login bonus");
      return true;
    }
    return false;
  };

  const contextValue: DiamondContextType = {
    diamonds: profile.diamonds,
    streak: profile.streak,
    add,
    spend,
    canAfford,
    updateStreak,
    getDailyBonus,
    profile,
  };

  return (
    <DiamondContext.Provider value={contextValue}>
      {children}
    </DiamondContext.Provider>
  );
}

export function useDiamonds() {
  const context = useContext(DiamondContext);
  if (context === undefined) {
    throw new Error('useDiamonds must be used within a DiamondProvider');
  }
  return context;
}
