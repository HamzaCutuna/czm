"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Globe, HelpCircle, BookOpen, ChevronDown } from "lucide-react";

type FlatEvent = {
  Id: number;
  Godina: number;
  Opis: string;
  Regija?: string | null;
  Kategorija?: string | null;
};

type Region = {
  Id: number;
  Naziv: string;
};

type Statement = {
  text: string;
  isTrue: boolean;
  explanation?: string;
  region?: string;
};

type GameSettings = {
  questionCount: number;
  regionId?: string;
  regionName?: string;
};

type GameState = 'settings' | 'playing' | 'finished';

const STORAGE_KEY = "tf_session_v2";

// Curated historical questions organized by region
const CURATED_QUESTIONS: Record<string, Statement[]> = {
  "all": [
    { text: "Opsada Sarajeva trajala je 1425 dana.", isTrue: true, explanation: "Opsada je trajala od 5.4.1992. do 29.2.1996.", region: "Bosna i Hercegovina" },
    { text: "Genocid u Srebrenici se dogodio 1993.", isTrue: false, explanation: "Masakr i genocid se dogodio u julu 1995.", region: "Bosna i Hercegovina" },
    { text: "Daytonski sporazum potpisan je 1995.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Prvi svjetski rat počeo je 1918.", isTrue: false, explanation: "Počeo je 1914., završio 1918.", region: "Općenito" },
    { text: "Bitka na Kosovu polju dogodila se 1389.", isTrue: true, region: "Srbija" },
    { text: "Stefan Nemanja je bio prvi srpski car.", isTrue: false, explanation: "Stefan Nemanja je bio veliki župan, a car je bio Stefan Dušan.", region: "Srbija" },
    { text: "Dubrovnik je bio nezavisna republika.", isTrue: true, region: "Hrvatska" },
    { text: "Tomislav je bio prvi hrvatski kralj.", isTrue: true, region: "Hrvatska" },
    { text: "Bitka na Mohačkom polju dogodila se 1526.", isTrue: true, region: "Hrvatska" },
    { text: "Banovina Hrvatska je formirana 1939.", isTrue: true, region: "Hrvatska" },
    { text: "Crna Gora je postala nezavisna 2006.", isTrue: true, region: "Crna Gora" },
    { text: "Petar II Petrović Njegoš je bio vojvoda.", isTrue: true, region: "Crna Gora" },
    { text: "Bitka na Neretvi dogodila se 1943.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Jasenovac je bio koncentracioni logor.", isTrue: true, region: "Hrvatska" },
    { text: "Bitka na Sutjesci trajala je 72 dana.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Tito je rođen u Kumrovcu.", isTrue: true, region: "Hrvatska" },
    { text: "Sarajevski atentat na Franza Ferdinanda dogodio se 1914.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Mostar je poznat po Starom mostu.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Bitka na Marici dogodila se 1371.", isTrue: true, region: "Srbija" },
    { text: "Kosovo je postalo nezavisno 2008.", isTrue: true, region: "Kosovo" },
    { text: "Skenderbeg je bio albanski nacionalni heroj.", isTrue: true, region: "Albanija" },
    { text: "Bitka na Vukovaru trajala je 87 dana.", isTrue: true, region: "Hrvatska" },
    { text: "Banja Luka je glavni grad Republike Srpske.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Bitka na Kolubari dogodila se 1914.", isTrue: true, region: "Srbija" },
    { text: "Stefan Lazarević je bio despota.", isTrue: true, region: "Srbija" },
    { text: "Bitka na Cerni dogodila se 1916.", isTrue: true, region: "Srbija" },
    { text: "Kraljevina Jugoslavija formirana je 1929.", isTrue: true, region: "Općenito" },
    { text: "Bitka na Neretvi je bila dio četvrte neprijateljske ofanzive.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Mostar je bio pod opsadom 18 mjeseci.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Bitka na Sutjesci je bila peta neprijateljska ofanziva.", isTrue: true, region: "Bosna i Hercegovina" },
  ],
  "Bosna i Hercegovina": [
    { text: "Opsada Sarajeva trajala je 1425 dana.", isTrue: true, explanation: "Opsada je trajala od 5.4.1992. do 29.2.1996.", region: "Bosna i Hercegovina" },
    { text: "Genocid u Srebrenici se dogodio 1993.", isTrue: false, explanation: "Masakr i genocid se dogodio u julu 1995.", region: "Bosna i Hercegovina" },
    { text: "Daytonski sporazum potpisan je 1995.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Bitka na Neretvi dogodila se 1943.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Bitka na Sutjesci trajala je 72 dana.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Sarajevski atentat na Franza Ferdinanda dogodio se 1914.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Mostar je poznat po Starom mostu.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Bitka na Neretvi je bila dio četvrte neprijateljske ofanzive.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Mostar je bio pod opsadom 18 mjeseci.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Bitka na Sutjesci je bila peta neprijateljska ofanziva.", isTrue: true, region: "Bosna i Hercegovina" },
    { text: "Banja Luka je glavni grad Republike Srpske.", isTrue: true, region: "Bosna i Hercegovina" },
  ],
  "Srbija": [
    { text: "Bitka na Kosovu polju dogodila se 1389.", isTrue: true, region: "Srbija" },
    { text: "Stefan Nemanja je bio prvi srpski car.", isTrue: false, explanation: "Stefan Nemanja je bio veliki župan, a car je bio Stefan Dušan.", region: "Srbija" },
    { text: "Bitka na Marici dogodila se 1371.", isTrue: true, region: "Srbija" },
    { text: "Bitka na Kolubari dogodila se 1914.", isTrue: true, region: "Srbija" },
    { text: "Stefan Lazarević je bio despota.", isTrue: true, region: "Srbija" },
    { text: "Bitka na Cerni dogodila se 1916.", isTrue: true, region: "Srbija" },
  ],
  "Hrvatska": [
    { text: "Dubrovnik je bio nezavisna republika.", isTrue: true, region: "Hrvatska" },
    { text: "Tomislav je bio prvi hrvatski kralj.", isTrue: true, region: "Hrvatska" },
    { text: "Bitka na Mohačkom polju dogodila se 1526.", isTrue: true, region: "Hrvatska" },
    { text: "Banovina Hrvatska je formirana 1939.", isTrue: true, region: "Hrvatska" },
    { text: "Jasenovac je bio koncentracioni logor.", isTrue: true, region: "Hrvatska" },
    { text: "Tito je rođen u Kumrovcu.", isTrue: true, region: "Hrvatska" },
    { text: "Bitka na Vukovaru trajala je 87 dana.", isTrue: true, region: "Hrvatska" },
  ],
  "Crna Gora": [
    { text: "Crna Gora je postala nezavisna 2006.", isTrue: true, region: "Crna Gora" },
    { text: "Petar II Petrović Njegoš je bio vojvoda.", isTrue: true, region: "Crna Gora" },
  ],
  "Kosovo": [
    { text: "Kosovo je postalo nezavisno 2008.", isTrue: true, region: "Kosovo" },
  ],
  "Albanija": [
    { text: "Skenderbeg je bio albanski nacionalni heroj.", isTrue: true, region: "Albanija" },
  ],
};

function loadPoolFallback(regionName?: string): Statement[] {
  const regionKey = regionName || "all";
  return CURATED_QUESTIONS[regionKey] || CURATED_QUESTIONS["all"];
}

async function fetchRegions(): Promise<Region[]> {
  try {
    const url = new URL(`/api/regije`, window.location.origin);
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? (data as Region[]) : [];
  } catch {
    return [
      { Id: 0, Naziv: "Sve regije" },
      { Id: 1, Naziv: "Bosna i Hercegovina" },
      { Id: 2, Naziv: "Srbija" },
      { Id: 3, Naziv: "Hrvatska" },
      { Id: 4, Naziv: "Crna Gora" },
      { Id: 5, Naziv: "Kosovo" },
      { Id: 6, Naziv: "Albanija" },
    ];
  }
}

async function fetchFlat(limit = 200, regionId?: string): Promise<FlatEvent[]> {
  const url = new URL(`/api/events-flat?take=${limit}&onlyWithImage=false`, window.location.origin);
  if (regionId && regionId !== "all") {
    // Map region names to API parameters
    if (regionId === "BiH") {
      url.searchParams.set('regijaId', "1"); // Assuming BiH has ID 1
    } else if (regionId === "Region") {
      url.searchParams.set('regijaId', "2"); // Assuming Region has ID 2
    } else if (regionId === "Svijet") {
      url.searchParams.set('regijaId', "3"); // Assuming Svijet has ID 3
    }
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return Array.isArray(data) ? (data as FlatEvent[]) : [];
}

function buildStatements(events: FlatEvent[], count = 20): Statement[] {
  const out: Statement[] = [];
  const pool = events.slice();
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const ev = pool.splice(idx, 1)[0];
    const trueStatement: Statement = {
      text: `${ev.Opis.split(/[.!?]/)[0]}.`,
      isTrue: true,
      region: ev.Regija || "Općenito",
    };
    const m = ev.Opis.match(/(\b1\d{3}|\b20\d{2})/);
    if (m) {
      const year = Number(m[0]);
      const delta = Math.floor(Math.random() * 3) + 1;
      const wrongYear = Math.random() > 0.5 ? year + delta : year - delta;
      const falseText = ev.Opis.replace(String(year), String(wrongYear)).split(/[.!?]/)[0] + ".";
      out.push(trueStatement, { 
        text: falseText, 
        isTrue: false, 
        explanation: `Tačna godina je ${year}.`,
        region: ev.Regija || "Općenito",
      });
    } else {
      out.push(trueStatement);
    }
  }
  return out;
}

type Session = { 
  index: number; 
  score: number; 
  questions: Statement[]; 
  settings: GameSettings;
  startTime: number;
};

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function saveSession(s: Session) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export default function TrueFalsePage() {
  const [gameState, setGameState] = useState<GameState>('settings');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<null | { correct: boolean; explanation?: string }>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    questionCount: 10,
    regionId: "all",
    regionName: "Sve regije"
  });
  const liveRef = useRef<HTMLDivElement | null>(null);

  const regionOptions = [
    { value: "all", label: "Sve regije" },
    { value: "Svijet", label: "Svijet" },
    { value: "Region", label: "Region" },
    { value: "BiH", label: "BiH" },
  ];

  const questionCountOptions = [
    { value: 5, label: "5 pitanja" },
    { value: 10, label: "10 pitanja" },
    { value: 15, label: "15 pitanja" },
    { value: 20, label: "20 pitanja" }
  ];

  const getSelectedRegionLabel = () => {
    return regionOptions.find(option => option.value === settings.regionId)?.label || "Odaberite regiju";
  };

  const getSelectedCountLabel = () => {
    return questionCountOptions.find(option => option.value === settings.questionCount)?.label || "Odaberite broj pitanja";
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Always start fresh - don't resume previous sessions
        // Clear any existing session
        localStorage.removeItem(STORAGE_KEY);
        
        // Load regions
        const regionsData = await fetchRegions();
        if (mounted) {
          setRegions(regionsData);
        }
      } catch (e: any) {
        setError(e?.message || "Neuspješno učitavanje podataka.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const current = session?.questions[session.index];

  async function startGame() {
    try {
      setLoading(true);
      setError(null);
      
      let statements: Statement[] = [];
      
      if (settings.regionId === "all") {
        // Use curated questions for all regions
        statements = loadPoolFallback();
      } else {
        // Try to fetch from API first, fallback to curated
        try {
          const flat = await fetchFlat(400, settings.regionId);
          statements = buildStatements(flat, settings.questionCount * 2);
        } catch {
          statements = loadPoolFallback(settings.regionName);
        }
      }
      
      const shuffled = statements.sort(() => Math.random() - 0.5).filter(Boolean);
      const questions = shuffled.slice(0, settings.questionCount);
      
      const newSession: Session = { 
        index: 0, 
        score: 0, 
        questions,
        settings,
        startTime: Date.now()
      };
      
      setSession(newSession);
      saveSession(newSession);
      setGameState('playing');
    } catch (e: any) {
      setError(e?.message || "Neuspješno pokretanje igre.");
    } finally {
      setLoading(false);
    }
  }

  function answer(choice: boolean) {
    if (!session || !current || feedback) return;
    const correct = current.isTrue === choice;
    const next: Session = {
      ...session,
      score: session.score + (correct ? 1 : 0),
    };
    setFeedback({ correct, explanation: current.explanation });
    setSession(next);
    saveSession(next);
    setTimeout(() => {
      liveRef.current?.focus();
    }, 0);
  }

  function nextQuestion() {
    if (!session) return;
    const isLast = session.index >= session.questions.length - 1;
    if (isLast) {
      setGameState('finished');
      return;
    }
    const next: Session = { ...session, index: session.index + 1 };
    setFeedback(null);
    setSession(next);
    saveSession(next);
  }

  function restart() {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setFeedback(null);
    setGameState('settings');
  }

  const progress = useMemo(() => {
    if (!session) return { current: 0, total: 0 };
    return { current: session.index + 1, total: session.questions.length };
  }, [session]);

  const gameTime = useMemo(() => {
    if (!session) return 0;
    return Math.floor((Date.now() - session.startTime) / 1000);
  }, [session]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-amber-600';
    if (score >= 60) return 'text-amber-500';
    return 'text-stone-600';
  };

  if (gameState === 'finished') {
    const percentage = session ? Math.round((session.score / session.questions.length) * 100) : 0;
    const getScoreMessage = (score: number, total: number) => {
      const percentage = Math.round((score / total) * 100);
      if (percentage >= 90) return "Odličan rezultat! 🏆";
      if (percentage >= 70) return "Dobar rezultat! 👍";
      if (percentage >= 50) return "Prosečan rezultat 📚";
      return "Treba više učenja 📖";
    };

    return (
      <main className="container mx-auto px-4 py-16 bg-[--color-bg]">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-amber-800 mb-2 font-heading">
                IGRA ZAVRŠENA!
              </CardTitle>
              <p className="text-lg text-stone-600">
                Evo vaših rezultata
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)} quiz-score`}>
                  {percentage}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg text-center shadow-sm">
                  <h3 className="font-semibold text-amber-800">Tačni odgovori</h3>
                  <p className="text-2xl font-bold text-amber-700 quiz-score">{session?.score}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg text-center shadow-sm">
                  <h3 className="font-semibold text-stone-800">Vrijeme</h3>
                  <p className="text-2xl font-bold text-stone-700 time-display">
                    {formatTime(gameTime)}
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={restart}
                    className="bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Nova igra
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (gameState === 'playing' && session && current) {
    return (
      <main className="container mx-auto px-4 py-16 bg-[--color-bg]">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-center items-center mb-2">
              <span className="text-sm font-medium text-stone-600">
                Pitanje {progress.current} od {progress.total}
              </span>
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    Tačno/Netačno
                  </Badge>
                  {current.region && (
                    <Badge variant="outline">
                      {current.region}
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {current.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Answer Options */}
              <div className="space-y-3">
                <h4 className="font-semibold font-['Baskervville']">Odaberite odgovor:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => answer(true)}
                    disabled={feedback !== null}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      feedback?.correct === true
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : feedback?.correct === false
                          ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        feedback?.correct === true
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {feedback?.correct === true && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <span className="font-medium">✅ Tačno</span>
                      {feedback?.correct === true && (
                        <span className="ml-auto text-green-600 font-bold">Tačno</span>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => answer(false)}
                    disabled={feedback !== null}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      feedback?.correct === false
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : feedback?.correct === true
                          ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        feedback?.correct === false
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                      }`}>
                        {feedback?.correct === false && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <span className="font-medium">❌ Netačno</span>
                      {feedback?.correct === false && (
                        <span className="ml-auto text-red-600 font-bold">Netačno</span>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div className="mt-6 text-center">
                  {feedback.explanation && (
                    <div className="text-stone-600 mb-4 p-3 bg-stone-50 rounded-lg">
                      {feedback.explanation}
                    </div>
                  )}
                  <Button
                    onClick={nextQuestion}
                    className="bg-[#5B2323] text-white rounded-xl shadow-lg hover:bg-[#4a1e1e] 
                             hover:shadow-xl transition-all duration-200 text-white px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {session.index < session.questions.length - 1 ? 'Sljedeće pitanje' : 'Završi igru'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[--color-bg]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
              <BookOpen className="h-12 w-12 text-amber-700" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">
            Tačno / Netačno
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Testirajte svoje znanje o historijskim događajima kroz jednostavne izjave
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                <strong>Greška:</strong> {error}
              </p>
            </div>
          )}

          {/* Main Game Card */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50 mb-8">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-stone-800 font-serif mb-4">
                Postavke igre
              </CardTitle>
              {/* Decorative Divider */}
              <div className="flex items-center justify-center my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                <div className="mx-4 p-2 bg-amber-100 rounded-full">
                  <BookOpen className="h-5 w-5 text-amber-700" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-8">
              <div className="max-w-md mx-auto space-y-8">
                {/* Region Selection */}
                <div className="text-center">
                  <label className="flex items-center justify-center gap-2 text-sm font-semibold text-stone-700 mb-3">
                    <Globe className="h-4 w-4 text-amber-600" />
                    Regija
                  </label>
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="h-12 bg-white border-2 border-amber-200 hover:border-amber-400 w-64 justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {getSelectedRegionLabel()}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-64 bg-white border-2 border-amber-200 shadow-lg"
                        align="center"
                        sideOffset={4}
                        side="bottom"
                        avoidCollisions={true}
                        collisionPadding={8}
                      >
                        {regionOptions.map((option) => (
                          <DropdownMenuItem 
                            key={option.value} 
                            onClick={() => setSettings(prev => ({ 
                              ...prev, 
                              regionId: option.value, 
                              regionName: option.label 
                            }))}
                            className="hover:bg-amber-50 hover:text-amber-800"
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Question Count Selection */}
                <div className="text-center">
                  <label className="flex items-center justify-center gap-2 text-sm font-semibold text-stone-700 mb-3">
                    <HelpCircle className="h-4 w-4 text-amber-600" />
                    Broj pitanja
                  </label>
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="h-12 bg-white border-2 border-amber-200 hover:border-amber-400 w-64 justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            {getSelectedCountLabel()}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-64 bg-white border-2 border-amber-200 shadow-lg"
                        align="center"
                        sideOffset={4}
                        side="bottom"
                        avoidCollisions={true}
                        collisionPadding={8}
                      >
                        {questionCountOptions.map((option) => (
                          <DropdownMenuItem 
                            key={option.value} 
                            onClick={() => setSettings(prev => ({ ...prev, questionCount: option.value }))}
                            className="hover:bg-amber-50 hover:text-amber-800"
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center pt-6">
                <Button
                  onClick={startGame}
                  disabled={loading}
                  className="bg-[#5B2323] text-white rounded-xl shadow-lg hover:bg-[#4a1e1e] 
                             hover:shadow-xl transition-all duration-200 text-white px-16 py-4 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-600"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Učitavanje...
                    </div>
                  ) : (
                    "Započni igru"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

 


