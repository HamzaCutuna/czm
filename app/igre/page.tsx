"use client";

import Link from "next/link";
import { Gamepad2, CalendarDays, HelpCircle, ToggleLeft } from "lucide-react";
import { useState, useEffect } from "react";

const igre = [
  {
    id: 'quiz',
    title: 'Kviz znanja',
    description: 'Testirajte znanje kroz pitanja iz historije. Više težina i regija.',
    href: '/kviz',
    icon: HelpCircle,
  },
  {
    id: 'daily-challenge',
    title: 'Dnevni izazov',
    description: 'Pogodite godinu događaja ili tačan odgovor na izazov dana.',
    href: '/igre/dnevni-izazov',
    icon: CalendarDays,
  },
  {
    id: 'true-false',
    title: 'Tačno / Netačno',
    description: 'Procijenite tačnost tvrdnje o historijskim događajima.',
    href: '/igre/tacno-netacno',
    icon: ToggleLeft,
  },
];

export default function IgrePage() {
  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800">
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
              <Gamepad2 className="h-12 w-12 text-amber-700" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">Igre</h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Zabavne i edukativne igre i izazovi. Odaberite igru i započnite.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6">
          {igre.map(game => {
            const Icon = game.icon;
            const disabled = (game as any).disabled;
            const content = (
              <div className={`rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md transition ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-full bg-amber-100 text-amber-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">{game.title}</h3>
                </div>
                <p className="text-stone-600">{game.description}</p>
              </div>
            );

            return disabled ? (
              <div key={game.id}>{content}</div>
            ) : (
              <Link key={game.id} href={game.href} className="block focus-ring rounded-xl">
                {content}
              </Link>
            );
          })}
        </div>

        <StatsSection />
      </div>
    </main>
  );
}

function StatsSection() {
  const [stats, setStats] = useState<{ total: number; bih: number; region: number; world: number; minYear: number; maxYear: number } | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const [eventsRes, regijeRes] = await Promise.all([
          fetch(new URL("/api/events-flat?take=0&onlyWithImage=false", window.location.origin).toString(), { cache: "no-store" }),
          fetch(new URL("/api/regije", window.location.origin).toString(), { cache: "no-store" })
        ]);
        const data = await eventsRes.json();
        const regije = await regijeRes.json();
        if (!Array.isArray(data)) return;
        let total = 0, bih = 0, region = 0, world = 0;
        let minYear = Infinity, maxYear = -Infinity;
        const regijaMap = new Map<number, string>();
        if (Array.isArray(regije)) {
          for (const r of regije) regijaMap.set(Number(r.Id ?? r.id), String(r.Naziv ?? r.naziv));
        }
        const classify = (name: string, regijaId?: number): 'BiH' | 'Region' | 'Svijet' => {
          const fromId = regijaId != null ? regijaMap.get(Number(regijaId)) : undefined;
          const source = String(fromId || name || '').toLowerCase();
          if (/(^|\b)(bih|bi\s*h|bosna|bosnia|herceg)/.test(source)) return 'BiH';
          if (/(^|\b)(region|regija)/.test(source)) return 'Region';
          if (/(^|\b)(svijet|svjets|svets|world|global)/.test(source)) return 'Svijet';
          return 'Svijet';
        };
        for (const it of data as any[]) {
          total++;
          const y = Number(it.Godina ?? it.godina);
          if (Number.isFinite(y) && y > 0) { minYear = Math.min(minYear, y); maxYear = Math.max(maxYear, y); }
          const name = String(it.Regija ?? it.Kategorija ?? it.regija ?? '');
          const cat = classify(name, Number(it.RegijaId ?? it.regijaId));
          if (cat === 'BiH') bih++; else if (cat === 'Region') region++; else world++;
        }
        if (!Number.isFinite(minYear)) minYear = 0;
        if (!Number.isFinite(maxYear)) maxYear = 0;
        setStats({ total, bih, region, world, minYear, maxYear });
      } catch {}
    })();
  }, []);

  if (!stats) return null;
  const totalSafe = stats.total > 0 ? stats.total : 1;
  const bihPct = (stats.bih / totalSafe) * 100;
  const regionPct = (stats.region / totalSafe) * 100;
  const worldPct = (stats.world / totalSafe) * 100;
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const fmt = (n: number) => `${n.toFixed(1)}%`;

  const Card = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-sm">
      <div className="text-2xl font-bold text-stone-900">{value}</div>
      <div className="text-sm text-stone-600">{label}</div>
    </div>
  );

  return (
    <section className="max-w-6xl mx-auto mt-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card label="Ukupno događaja" value={stats.total} />
        <Card label="Iz BiH" value={stats.bih} />
        <Card label="Iz regiona" value={stats.region} />
        <Card label="Iz svijeta" value={stats.world} />
        <Card label="Pokrivene godine" value={`${stats.minYear}–${stats.maxYear}`} />
      </div>
      <div className="mt-6">
        <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden flex">
          <div className="h-full" style={{ backgroundColor: '#A7C7E7', width: `${clamp(bihPct)}%` }} />
          <div className="h-full" style={{ backgroundColor: '#C19A6B', width: `${clamp(regionPct)}%` }} />
          <div className="h-full" style={{ backgroundColor: '#A8D5BA', width: `${clamp(worldPct)}%` }} />
        </div>
        <div className="flex text-[10px] sm:text-xs text-stone-700 mt-1">
          <div className="pl-1 text-left" style={{ width: `${clamp(bihPct)}%` }}>BiH {fmt(bihPct)}</div>
          <div className="text-center" style={{ width: `${clamp(regionPct)}%` }}>Region {fmt(regionPct)}</div>
          <div className="pr-1 text-right" style={{ width: `${clamp(worldPct)}%` }}>Svijet {fmt(worldPct)}</div>
        </div>
      </div>
    </section>
  );
}



