"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  full_name: string;
  score_percent: number;
  correct_count: number;
  total_count: number;
  duration_ms: number;
  created_at: string;
}


export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch top 10 quiz results with user profiles
      type SupabaseLeaderboardRow = {
        user_id: string;
        score_percent: number;
        correct_count: number;
        total_count: number;
        duration_ms: number;
        created_at: string;
        profiles?: {
          full_name?: string | null;
        } | null;
      };

      const { data, error } = await supabase
        .from('quiz_results')
        .select(`
          id,
          user_id,
          score_percent,
          correct_count,
          total_count,
          duration_ms,
          created_at,
          profiles!inner(full_name)
        `)
        .order('score_percent', { ascending: false })
        .order('duration_ms', { ascending: true })
        .limit(10);
      
      if (error) {
        setError(error.message || 'Greška pri učitavanju rang liste');
        return;
      }
      
      const rows = (data ?? []) as SupabaseLeaderboardRow[];
      const transformedData = rows.map((entry, index) => ({
        rank: index + 1,
        user_id: entry.user_id,
        full_name: entry.profiles?.full_name || 'Korisnik',
        score_percent: entry.score_percent,
        correct_count: entry.correct_count,
        total_count: entry.total_count,
        duration_ms: entry.duration_ms,
        created_at: entry.created_at
      }));
      
      setLeaderboardData(transformedData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Greška pri učitavanju rang liste';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

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
          Top 10 igrača
        </CardTitle>
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
              onClick={() => fetchLeaderboard()}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Pokušaj ponovo
            </Button>
          </div>
        )}
        
        {leaderboardData.length > 0 && !loading && !error && (
          <div className="space-y-3">
            {leaderboardData.map((entry) => (
              <div key={entry.user_id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(entry.rank)}`}>
                    {getRankIcon(entry.rank)}
                  </div>
                  <div>
                    <div className="font-medium text-stone-700">{entry.full_name}</div>
                    <div className="text-xs text-stone-500">
                      {new Date(entry.created_at).toLocaleDateString('bs-BA')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-amber-700 font-bold">
                      <Target className="h-4 w-4" />
                      {entry.score_percent.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-stone-600">
                      <Clock className="h-4 w-4" />
                      {formatTime(entry.duration_ms)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-stone-600">
                      {entry.correct_count}/{entry.total_count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {leaderboardData.length === 0 && !loading && !error && (
          <div className="text-center py-8 text-amber-600">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nema rezultata kvizova</p>
          </div>
            )}
      </CardContent>
    </Card>
  );
}
