"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, HelpCircle } from "lucide-react";
import { useState } from "react";
import { getExpectedReward, DEFAULT_REWARDS_CONFIG } from "@/lib/rewards-config";

interface RewardCalculatorProps {
  questionCount: number;
  expectedAccuracy?: number;
}

export function RewardCalculator({ questionCount, expectedAccuracy = 80 }: RewardCalculatorProps) {
  const [showInfo, setShowInfo] = useState(false);
  
  const expectedCorrect = Math.round(questionCount * (expectedAccuracy / 100));
  const expectedReward = getExpectedReward(questionCount, expectedAccuracy);
  
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-stone-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-stone-800 font-heading">
            Kalkulator nagrada
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 h-auto text-stone-600 hover:text-stone-800"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main reward display */}
        <div className="text-center p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg">
          <div className="text-3xl font-bold text-amber-800 mb-1">
            {expectedReward} 💎
          </div>
          <p className="text-sm text-amber-700">
            Očekivana nagrada ({expectedAccuracy}% tačnost)
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <div className="font-semibold text-stone-700 mb-1">Broj pitanja</div>
            <div className="text-lg font-bold text-stone-800">{questionCount}</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <div className="font-semibold text-stone-700 mb-1">Tačnih odgovora</div>
            <div className="text-lg font-bold text-stone-800">~{expectedCorrect}</div>
          </div>
        </div>

        {/* Accuracy tiers */}
        <div className="space-y-2">
          <div className="font-semibold text-stone-700 text-sm">Nivoi tačnosti:</div>
          <div className="space-y-1 text-xs text-stone-600">
            {DEFAULT_REWARDS_CONFIG.ACCURACY_TIERS.map((tier, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span>{tier.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info popover */}
        {showInfo && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <div className="font-semibold mb-1">Kako funkcioniše?</div>
                <div className="space-y-1">
                  <p>• Minimum {DEFAULT_REWARDS_CONFIG.MIN_QUESTIONS_FOR_REWARD} pitanja za nagradu</p>
                  <p>• Jedna nagrađena igra dnevno</p>
                  <p>• Baza = ceil(broj_pitanja / 10)</p>
                  <p>• Množitelj zavisi od tačnosti</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requirements */}
        <div className="text-xs text-stone-500 space-y-1">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-stone-400"></div>
            <span>Minimum {DEFAULT_REWARDS_CONFIG.MIN_QUESTIONS_FOR_REWARD} pitanja za nagradu</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-stone-400"></div>
            <span>Jedna nagrađena igra dnevno</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
