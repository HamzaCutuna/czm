"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { fetchEventsByDate } from "@/lib/calendar";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWallet } from "@/components/wallet/WalletProvider";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

function seededRand(seed: number) {
  let t = seed % 2147483647;
  if (t <= 0) t += 2147483646;
  return () => (t = (t * 16807) % 2147483647) / 2147483647;
}

function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  const rnd = seededRand(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DailyChallengePage() {
  const { user } = useAuth();
  const { wallet, refreshWallet } = useWallet();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<{ title: string; fullText: string; imageUrl?: string | null; year: number } | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const checkDailyAttempt = useCallback(async () => {
    if (!user) return false;

    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();

      if (!authSession?.access_token) {
        return false;
      }

      const response = await fetch('/api/quiz/daily-challenge/check', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authSession.access_token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.alreadyClaimed || false;
      }

      return false;
    } catch (error) {
      console.error('Error checking daily attempt:', error);
      return false;
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user has already attempted today
        const attempted = await checkDailyAttempt();
        setAlreadyAttempted(attempted);
        
        // Get today's date for the daily challenge
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth() + 1;
        const d = today.getDate();

        // Use actual today's date for the challenge
        const daySeed = Number(`${y}${m}${d}`);
        const iso = today.toISOString().split('T')[0];
        const events = await fetchEventsByDate(iso);
        
        // Fallback events if none found for the date
        const fallbackEvents = [
          {
            title: "Prvi svjetski rat - početak",
            fullText: "Prvi svjetski rat počeo je 1914. godine kada je Austro-Ugarska objavila rat Srbiji nakon atentata na nadvojvodu Franza Ferdinanda u Sarajevu. Rat je trajao do 1918. godine i odnio milione života.",
            shortText: "Početak Prvog svjetskog rata",
            year: 1914,
            imageUrl: null
          },
          {
            title: "Bitka na Marne",
            fullText: "Bitka na Marne bila je jedna od najvažnijih bitaka Prvog svjetskog rata. Odigrala se u septembru 1914. godine i zaustavila njemačko napredovanje prema Parizu, što je spriječilo brzi kraj rata.",
            shortText: "Bitka na Marne",
            year: 1914,
            imageUrl: null
          },
          {
            title: "Osnivanje SFR Jugoslavije",
            fullText: "Socijalistička Federativna Republika Jugoslavija osnovana je 1945. godine nakon Drugog svjetskog rata. Bila je federacija šest republika: Srbije, Hrvatske, Bosne i Hercegovine, Crne Gore, Slovenije i Makedonije.",
            shortText: "Osnivanje SFR Jugoslavije",
            year: 1945,
            imageUrl: null
          },
          {
            title: "Dan pobjede nad fašizmom",
            fullText: "Dan pobjede nad fašizmom obilježava se 9. maja 1945. godine kada je nacistička Njemačka potpisala kapitulaciju, čime je završen Drugi svjetski rat u Evropi.",
            shortText: "Dan pobjede nad fašizmom",
            year: 1945,
            imageUrl: null
          }
        ];
        
        const finalEvents = events.length > 0 ? events : fallbackEvents;
        const index = daySeed % finalEvents.length;
        const pick = finalEvents[index];
        const baseYear = pick.year;
        const rnd = seededRand(daySeed + baseYear);
        const candidates = new Set<number>([baseYear]);
        while (candidates.size < 4) {
          const delta = Math.floor(rnd() * 21) - 10;
          const cand = baseYear + delta;
          candidates.add(cand);
        }
        const shuffled = shuffleSeeded(Array.from(candidates), daySeed + 42);
        setQuestion({ title: pick.title, fullText: pick.fullText || pick.shortText || pick.title, imageUrl: pick.imageUrl, year: baseYear });
        setOptions(shuffled);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : 'Greška pri učitavanju izazova.';
        setError(message || 'Greška pri učitavanju izazova.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [checkDailyAttempt]);

  const handleSelect = async (year: number) => {
    if (result || submitting || alreadyAttempted) return;
    
    setSelected(year);
    const isCorrect = year === question?.year;
    setResult(isCorrect ? 'correct' : 'wrong');
    
    // Submit result to server
    if (user) {
      setSubmitting(true);
      try {
        const { data: { session: authSession } } = await supabase.auth.getSession();
        
        if (!authSession?.access_token) {
          toast.error('Greška: Niste prijavljeni');
          return;
        }

        const response = await fetch('/api/quiz/daily-challenge/finalize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authSession.access_token}`,
          },
          body: JSON.stringify({
            correct: isCorrect,
            selectedYear: year,
            correctYear: question?.year,
            questionTitle: question?.title
          }),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          console.error('API error:', result);
          console.error('Response status:', response.status);
          console.error('Response headers:', Object.fromEntries(response.headers.entries()));
          toast.error(`Error: ${result.error || 'Unknown error'}${result.details ? ` - ${result.details}` : ''}`);
        } else if (result.earned > 0) {
          toast.success(`+${result.earned} 💎 nagrađeno!`);
          await refreshWallet();
        } else if (result.alreadyClaimed) {
          toast.info(result.message || "Već ste pokušali današnji izazov");
        } else {
          toast.info("Odgovor je netačan - nema nagrade");
        }
        
        setAlreadyAttempted(true);
      } catch (error: unknown) {
        console.error('Error submitting daily challenge:', error);
        const message = error instanceof Error ? error.message : 'Nepoznata greška';
        toast.error(`Error: ${message}`);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800">
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-stone-800 mb-3 font-heading tracking-wide">Dnevni izazov</h1>
          <p className="text-lg text-stone-600">Pogodite godinu događaja</p>
          
          {/* Wallet Balance - Hide for logged-out users */}
          {user && wallet && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full border border-amber-300">
                <div className="text-2xl">💎</div>
                <div className="text-lg font-bold text-amber-800">
                  {wallet.diamonds}
                </div>
                <div className="text-sm text-amber-600">dijamanata</div>
              </div>
            </div>
          )}

          {/* Show sign-in prompt for logged-out users */}
          {!user && (
            <div className="mt-6 text-center">
              <p className="text-sm text-stone-500 italic">
                Prijavite se da biste prikupljali nagrade
              </p>
            </div>
          )}
          
          {/* Already Attempted Message */}
          {alreadyAttempted && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              <p className="font-semibold">Već ste pokušali današnji izazov!</p>
              <p className="text-sm">Pokušajte ponovo sutra.</p>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">Učitavanje...</div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
          )}

          {!loading && !error && question && (
            <div className="rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50 p-8 py-12">
              {question.imageUrl && (
                <div className="mb-6">
                  <Image
                    src={question.imageUrl}
                    alt={question.title}
                    width={800}
                    height={360}
                    className="w-full max-h-[360px] object-cover rounded-lg border border-stone-200"
                  />
                </div>
              )}
              <p className="text-stone-700 leading-relaxed mb-8 whitespace-pre-line">{question.fullText}</p>
              <div className="grid grid-cols-2 gap-4">
                {options.map((year) => {
                  const isSelected = selected === year;
                  const correct = result === 'correct' && isSelected;
                  const wrong = result === 'wrong' && isSelected;
                  return (
                    <button
                      key={year}
                      onClick={() => handleSelect(year)}
                      disabled={!!result || alreadyAttempted || submitting}
                      className={`px-6 py-4 rounded-xl border text-lg font-bold transition ${
                        correct
                          ? 'bg-green-50 text-green-800 border-green-300'
                          : wrong
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : alreadyAttempted || submitting
                              ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                      }`}
                    >
                      {submitting ? 'Šalje...' : year}
                    </button>
                  );
                })}
              </div>

              {result && (
                <div className="mt-8 text-center">
                  {result === 'correct' ? (
                    <div className="text-green-700 font-semibold">Tačno! Odgovor je {question.year}.</div>
                  ) : (
                    <div className="text-red-700 font-semibold">Netačno. Tačan odgovor: {question.year}.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}



