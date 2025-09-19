"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Clock, Target, Gem } from "lucide-react";
import { getLeaderboard } from "@/lib/supabase";

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  accuracy: number;
  time_spent: number;
  num_questions: number;
  diamonds_earned: number;
  created_at: string;
}

interface LeaderboardData {
  success: boolean;
  scope: string;
  page: number;
  page_size: number;
  total_count: number;
  data: LeaderboardEntry[];
}

const SCOPE_LABELS = {
  daily: 'Dnevni',
  weekly: 'Sedmični',
  monthly: 'Mjesečni',
  all: 'Sveukupno'
};

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [currentScope, setCurrentScope] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async (scope: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getLeaderboard(scope, 1, 20);
      
      if (error) {
        setError(error.message || 'Greška pri učitavanju rang liste');
        return;
      }
      
      setLeaderboardData(data);
    } catch (err: any) {
      setError(err.message || 'Greška pri učitavanju rang liste');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(currentScope);
  }, [currentScope]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800';
    if (rank === 2) return 'bg-gray-100 text-gray-800';
    if (rank === 3) return 'bg-amber-100 text-amber-800';
    return 'bg-stone-100 text-stone-600';
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-yellow-50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-amber-800 flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Najbolji rezultati
        </CardTitle>
        
        {/* Scope Tabs */}
        <div className="flex gap-2 mt-4">
          {Object.entries(SCOPE_LABELS).map(([scope, label]) => (
            <Button
              key={scope}
              onClick={() => setCurrentScope(scope as any)}
              variant={currentScope === scope ? "default" : "outline"}
              size="sm"
              className={
                currentScope === scope
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "border-amber-300 text-amber-700 hover:bg-amber-100"
              }
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading && (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-amber-600">Učitavanje...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => fetchLeaderboard(currentScope)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Pokušaj ponovo
            </Button>
          </div>
        )}
        
        {leaderboardData && !loading && !error && (
          <div className="space-y-3">
            {leaderboardData.data.length === 0 ? (
              <div className="text-center py-8 text-amber-600">
                <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nema rezultata za {SCOPE_LABELS[currentScope].toLowerCase()} rang listu</p>
              </div>
            ) : (
              leaderboardData.data.map((entry) => (
                <div key={entry.user_id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(entry.rank)}`}>
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className="font-medium text-stone-700">{entry.display_name}</div>
                      <div className="text-xs text-stone-500">
                        {new Date(entry.created_at).toLocaleDateString('bs-BA')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-amber-700 font-bold">
                        <Target className="h-4 w-4" />
                        {entry.accuracy.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-stone-600">
                        <Clock className="h-4 w-4" />
                        {formatTime(entry.time_spent)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-stone-600">
                        {entry.num_questions} pitanja
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-green-600 font-bold">
                        <Gem className="h-4 w-4" />
                        {entry.diamonds_earned}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {leaderboardData.total_count > leaderboardData.data.length && (
              <div className="text-center pt-4">
                <p className="text-sm text-amber-600">
                  Prikazano {leaderboardData.data.length} od {leaderboardData.total_count} rezultata
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
