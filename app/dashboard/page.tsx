"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWallet } from "@/components/wallet/WalletProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gem, 
  History, 
  Play, 
  Target, 
  ArrowRight,
  Calendar,
  TrendingUp,
  Award,
  User,
  Clock,
  CheckCircle,
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  privacy_setting: string | null;
  created_at: string;
}

interface QuizResult {
  id: string;
  mode: string;
  question_count: number;
  correct_count: number;
  duration_ms: number;
  played_on: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { wallet, transactions, loading: walletLoading } = useWallet();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile error:', profileError);
          // If it's a permission error, try to create profile anyway
          if (profileError.code === '42501' || profileError.message?.includes('permission')) {
            console.log('Permission error detected, attempting to create profile...');
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email || null,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Korisnik',
                display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Korisnik',
                avatar_url: user.user_metadata?.avatar_url || null
              })
              .select()
              .single();
            
            if (createError) {
              console.error('Create profile error:', createError);
            } else {
              setProfile(newProfile);
            }
          }
        } else if (profileData) {
          setProfile(profileData);
        } else if (profileError?.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email || null,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Korisnik',
              display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Korisnik',
              avatar_url: user.user_metadata?.avatar_url || null
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Create profile error:', createError);
            // If profile creation fails, create a fallback profile
            setProfile({
              id: user.id,
              email: user.email || null,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Korisnik',
              display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Korisnik',
              avatar_url: user.user_metadata?.avatar_url || null,
              privacy_setting: 'realname',
              created_at: new Date().toISOString()
            });
          } else {
            setProfile(newProfile);
          }
        }
        
        // Fetch quiz results
        const { data: quizData, error: quizError } = await supabase
          .from('quiz_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (quizError) {
          console.error('Quiz sessions error:', quizError);
          // If it's a permission error or table doesn't exist, just set empty array
          if (quizError.code === '42501' || quizError.code === '42P01' || quizError.message?.includes('permission') || quizError.message?.includes('does not exist')) {
            console.log('Quiz sessions table not accessible, setting empty array');
            setQuizResults([]);
          }
        } else {
          setQuizResults(quizData || []);
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        // Set fallback profile if everything fails
        if (!profile) {
          setProfile({
            id: user.id,
            email: user.email || null,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Korisnik',
            display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Korisnik',
            avatar_url: user.user_metadata?.avatar_url || null,
            privacy_setting: 'realname',
            created_at: new Date().toISOString()
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (authLoading || walletLoading || loading) {
    return (
      <main className="min-h-dvh bg-[--color-bg] text-stone-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#5B2323] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Greška pri odjavi');
      } else {
        toast.success('Uspešno ste se odjavili');
        router.push('/');
      }
    } catch (err) {
      console.error('Sign out failed:', err);
      toast.error('Greška pri odjavi');
    } finally {
      setSigningOut(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bs-BA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const recentTransactions = transactions.slice(0, 10);

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-stone-200 rounded-full shadow-lg">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-amber-700" />
              )}
            </div>
          </div>
          <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">
            Dashboard
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Dobrodošli, {profile?.full_name || user.email?.split('@')[0]}!
          </p>
          <p className="text-lg text-stone-500 mt-2">
            {user.email}
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleSignOut}
              disabled={signingOut}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? 'Odjavljivanje...' : 'Odjavi se'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Wallet Balance */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-800 mb-2 font-heading">
                Ukupni balans dijamanata
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Gem className="h-8 w-8 text-blue-600" />
                <span className="text-4xl font-bold text-blue-700">{wallet?.diamonds || 0}</span>
                <span className="text-xl text-blue-600">💎</span>
              </div>
              <p className="text-blue-600">
                Ukupno transakcija: <span className="font-semibold">{transactions.length}</span>
              </p>
            </CardContent>
          </Card>

          {/* Quiz Results Table */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-stone-50 to-amber-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-stone-800 font-heading flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-amber-700" />
                  Rezultati kvizova
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {quizResults.length === 0 ? (
                <div className="text-center py-8">
                  <Play className="h-16 w-16 text-stone-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-stone-600 mb-2">
                    Nema rezultata kvizova
                  </h3>
                  <p className="text-stone-500">
                    Počnite igrati kvizove da vidite svoje rezultate!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="text-left py-3 px-4 font-semibold text-stone-700">Kviz</th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-700">Rezultat</th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-700">Tačno/Ukupno</th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-700">Trajanje</th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-700">Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.map((result) => {
                        const scorePercent = result.question_count > 0 ? (result.correct_count / result.question_count) * 100 : 0;
                        return (
                          <tr key={result.id} className="border-b border-stone-100 hover:bg-white/50">
                            <td className="py-3 px-4 font-medium text-stone-800">
                              {result.mode === 'true_false' ? 'Tačno/Netačno' : 'Kviz'}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={scorePercent >= 80 ? "default" : scorePercent >= 60 ? "secondary" : "destructive"}
                                className="font-semibold"
                              >
                                {scorePercent.toFixed(1)}%
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-stone-600">
                              {result.correct_count}/{result.question_count}
                            </td>
                            <td className="py-3 px-4 text-stone-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDuration(result.duration_ms)}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-stone-600">
                              {formatDate(result.created_at)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
