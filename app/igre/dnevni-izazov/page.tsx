"use client";

import { useEffect, useState } from "react";
import { fetchEventsByDate } from "@/lib/calendar";

export default function DailyChallengePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<{ title: string; fullText: string; imageUrl?: string | null; year: number } | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth() + 1;
        const d = today.getDate();
        const daySeed = Number(`${y}${m}${d}`);
        const iso = today.toISOString().split('T')[0];
        const events = await fetchEventsByDate(iso);
        if (!events.length) {
          throw new Error('Nema događaja za današnji datum. Pokušajte sutra.');
        }
        const index = daySeed % events.length;
        const pick = events[index];
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
      } catch (e: any) {
        setError(e?.message || 'Greška pri učitavanju izazova.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = (year: number) => {
    if (result) return;
    setSelected(year);
    setResult(year === question?.year ? 'correct' : 'wrong');
  };

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800">
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-stone-800 mb-3 font-heading tracking-wide">Dnevni izazov</h1>
          <p className="text-lg text-stone-600">Pogodite godinu događaja</p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">Učitavanje...</div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
        )}

        {!loading && !error && question && (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
            <div className="text-xl font-semibold text-stone-900 mb-4">{question.title}</div>
            {question.imageUrl && (
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={question.imageUrl} alt={question.title} className="w-full max-h-[360px] object-cover rounded-lg border border-stone-200" />
              </div>
            )}
            <p className="text-stone-700 leading-relaxed mb-6 whitespace-pre-line">{question.fullText}</p>
            <div className="grid grid-cols-2 gap-3">
              {options.map((year) => {
                const isSelected = selected === year;
                const correct = result === 'correct' && isSelected;
                const wrong = result === 'wrong' && isSelected;
                return (
                  <button
                    key={year}
                    onClick={() => handleSelect(year)}
                    disabled={!!result}
                    className={`px-4 py-3 rounded-xl border text-lg font-bold transition ${
                      correct
                        ? 'bg-green-50 text-green-800 border-green-300'
                        : wrong
                          ? 'bg-red-50 text-red-800 border-red-300'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>

            {result && (
              <div className="mt-6 text-center">
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
    </main>
  );
}



