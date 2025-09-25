"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Globe, HelpCircle, BookOpen, Trophy, Star, Clock, ChevronDown } from "lucide-react";
import { PowerupBar } from "@/components/quiz/PowerupBar";
import { Leaderboard } from "@/components/quiz/Leaderboard";
import { useWallet } from "@/components/wallet/WalletProvider";

interface QuizQuestion {
  id: number;
  tekstPitanja: string;
  tipPitanja: string;
  tezinaPitanja: string;
  kategorijaNaziv?: string;
  regijaNaziv?: string;
  odgovori: QuizAnswer[];
  dogdajaj?: {
    historijskiDogadjajId: number;
    opisDogadjaja: string;
    datum: string;
    slike: QuizImage[];
  };
  pitanjaSlike: QuizImage[];
  historijskiDogadjajId?: number;
  slike?: QuizImage[];
}

interface QuizAnswer {
  id: number;
  tekstOdgovora: string;
  tacan: boolean;
}

interface QuizImage {
  id: number;
  slikaPath: string;
  izvorInfo?: string;
  izvorUrl?: string;
  redoslijed: number;
}

interface QuizSettings {
  region: string;
  questionCount: number;
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
}

interface FunFact {
  id: number;
  opisDogadjaja: string;
  datum: string;
  regijaNaziv?: string;
}

interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  date: string;
}

export default function KvizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [funFact, setFunFact] = useState<FunFact | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [sampleQuestion, setSampleQuestion] = useState<QuizQuestion | null>(null);
  const [removedOptions, setRemovedOptions] = useState<number[]>([]);
  
  const { wallet } = useWallet();

  const [settings, setSettings] = useState<QuizSettings>({
    region: "all",
    questionCount: 10
  });

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const regionOptions = [
    { value: "all", label: "Sve regije" },
    { value: "Svijet", label: "Svijet" },
    { value: "Region", label: "Region" },
    { value: "BiH", label: "BiH" }
  ];



  const questionCountOptions = [
    { value: 5, label: "5 pitanja" },
    { value: 10, label: "10 pitanja" },
    { value: 15, label: "15 pitanja" }
  ];

  const getSelectedRegionLabel = () => {
    return regionOptions.find(option => option.value === settings.region)?.label || "Odaberite regiju";
  };

  const getSelectedCountLabel = () => {
    return questionCountOptions.find(option => option.value === settings.questionCount)?.label || "Odaberite broj pitanja";
  };

  const fetchFunFact = async () => {
    if (!BASE_URL) return;

    try {
      // Try to get a random historical event from the quiz questions
      const response = await fetch(`${BASE_URL}/kviz-pitanja/start?BrojPitanja=1`, {
        cache: 'no-store',
        headers: { "Accept": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].dogdajaj) {
          setFunFact({
            id: data[0].dogdajaj.historijskiDogadjajId,
            opisDogadjaja: data[0].dogdajaj.opisDogadjaja,
            datum: data[0].dogdajaj.datum,
            regijaNaziv: data[0].regijaNaziv
          });
        }
      }
    } catch (err) {
      console.log('Could not fetch fun fact:', err);
    }
  };

  const fetchLeaderboard = async () => {
    // Mock leaderboard data for now
    const mockLeaderboard: LeaderboardEntry[] = [
      { id: 1, username: "HistorijskiGuru", score: 95, date: "2024-01-15" },
      { id: 2, username: "DrevniZnalac", score: 92, date: "2024-01-14" },
      { id: 3, username: "VremenskiPutnik", score: 88, date: "2024-01-13" },
      { id: 4, username: "KulturniIstraživač", score: 85, date: "2024-01-12" },
      { id: 5, username: "HistorijskiEntuzijast", score: 82, date: "2024-01-11" },
    ];
    setLeaderboard(mockLeaderboard);
  };

  const fetchSampleQuestion = async () => {
    if (!BASE_URL) return;

    try {
      const response = await fetch(`${BASE_URL}/kviz-pitanja/start?BrojPitanja=1`, {
        cache: 'no-store',
        headers: { "Accept": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setSampleQuestion(data[0]);
        }
      }
    } catch (err) {
      console.log('Could not fetch sample question:', err);
    }
  };

  useEffect(() => {
    fetchFunFact();
    fetchLeaderboard();
    fetchSampleQuestion();
  }, []);

  const fetchQuizQuestions = async () => {
    if (!BASE_URL) {
      setError("API base URL not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const url = new URL("/kviz-pitanja/start", BASE_URL);
      url.searchParams.set("BrojPitanja", "100");
      console.log(`Fetching 100 questions from start endpoint for better filtering`);

      const response = await fetch(url.toString(), {
        cache: 'no-store',
        headers: { "Accept": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data = await response.json();


      const uniqueRegions = [...new Set(data.map((q: QuizQuestion) => q.regijaNaziv).filter(Boolean))];
      console.log('Available regions in data:', uniqueRegions);
      console.log('Total questions before filtering:', data.length);
      console.log('First question structure:', data[0]);
      console.log('Sample questions with regions:', data.slice(0, 5).map((q: QuizQuestion) => ({
        id: q.id,
        region: q.regijaNaziv,
        question: q.tekstPitanja.substring(0, 30) + "..."
      })));


      if (settings.region !== "all") {
        data = data.filter((q: QuizQuestion) => {
          return q.regijaNaziv === settings.region;
        });

        console.log(`After filtering for region "${settings.region}": ${data.length} questions found`);
        console.log(`Filtered questions for "${settings.region}":`, data.map((q: QuizQuestion) => ({
          id: q.id,
          region: q.regijaNaziv,
          question: q.tekstPitanja.substring(0, 50) + "..."
        })));
      }


      data = data.slice(0, settings.questionCount);

      if (data.length === 0) {
        throw new Error("Nema dostupnih pitanja za odabrane kriterije.");
      }


      if (data.length < 3 && settings.region !== "all") {
        console.warn(`Warning: Only ${data.length} questions found for region "${settings.region}". Consider using "Sve regije" for more questions.`);
      }

      setQuestions(data);
      setStartTime(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quiz questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers({});
    setQuizCompleted(false);
    setResult(null);
    fetchQuizQuestions();
  };

  const selectAnswer = (answerId: number) => {
    setSelectedAnswer(answerId);
    setShowFeedback(false);
    setIsCorrect(null);
  };

  const confirmAnswer = () => {
    if (selectedAnswer !== null) {
      const currentQuestion = questions[currentQuestionIndex];
      const correctAnswer = currentQuestion.odgovori.find(answer => answer.tacan);
      const isAnswerCorrect = selectedAnswer === correctAnswer?.id;

      setIsCorrect(isAnswerCorrect);
      setShowFeedback(true);

      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTime) / 1000);

    let correctAnswers = 0;
    questions.forEach(question => {
      const userAnswerId = userAnswers[question.id];
      const correctAnswer = question.odgovori.find(answer => answer.tacan);
      if (userAnswerId === correctAnswer?.id) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);

    setResult({
      totalQuestions: questions.length,
      correctAnswers,
      score,
      timeSpent
    });

    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers({});
    setResult(null);
    setQuestions([]);
    setShowFeedback(false);
    setIsCorrect(null);
    setShowReview(false);
    setRemovedOptions([]);
  };

  // Help functions
  const handleFiftyFifty = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const correctAnswer = currentQuestion.odgovori.find(answer => answer.tacan);
    const wrongAnswers = currentQuestion.odgovori.filter(answer => !answer.tacan);
    
    // Remove two wrong answers randomly
    const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
    const toRemove = shuffled.slice(0, 2).map(answer => answer.id);
    
    setRemovedOptions(prev => [...prev, ...toRemove]);
  };

  const handleSkip = () => {
    nextQuestion();
  };

  const handleRemoveOne = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const correctAnswer = currentQuestion.odgovori.find(answer => answer.tacan);
    const wrongAnswers = currentQuestion.odgovori.filter(answer => !answer.tacan);
    
    // Remove one wrong answer randomly
    const randomWrong = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
    
    setRemovedOptions(prev => [...prev, randomWrong.id]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'lako': return 'bg-green-100 text-green-800';
      case 'srednje': return 'bg-yellow-100 text-yellow-800';
      case 'tesko': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-amber-600';
    if (score >= 60) return 'text-amber-500';
    return 'text-stone-600';
  };

  const getUserAnswerText = (question: QuizQuestion) => {
    const userAnswerId = userAnswers[question.id];
    const userAnswer = question.odgovori.find(answer => answer.id === userAnswerId);
    return userAnswer?.tekstOdgovora || 'Nije odgovoreno';
  };

  const getCorrectAnswerText = (question: QuizQuestion) => {
    const correctAnswer = question.odgovori.find(answer => answer.tacan);
    return correctAnswer?.tekstOdgovora || 'Nepoznato';
  };

  const isUserAnswerCorrect = (question: QuizQuestion) => {
    const userAnswerId = userAnswers[question.id];
    const correctAnswer = question.odgovori.find(answer => answer.tacan);
    return userAnswerId === correctAnswer?.id;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (quizCompleted && result) {
    return (
      <main className="container mx-auto px-4 py-16 bg-[--color-bg] flex justify-center items-start">
        <div className="max-w-2xl w-full">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-amber-800 mb-2 font-heading">
                KVIZ ZAVRŠEN!
              </CardTitle>
              <p className="text-lg text-stone-600">
                Evo vaših rezultata
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)} quiz-score`}>
                  {result.score}%
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg text-center shadow-sm">
                  <h3 className="font-semibold text-amber-800">Tačni odgovori</h3>
                  <p className="text-2xl font-bold text-amber-700 quiz-score">{result.correctAnswers}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg text-center shadow-sm">
                  <h3 className="font-semibold text-stone-800">Vrijeme</h3>
                  <p className="text-2xl font-bold text-stone-700 time-display">
                    {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setShowReview(!showReview)}
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    {showReview ? 'Sakrij pregled' : 'Pregled odgovora'}
                  </Button>
                  <Button
                    onClick={resetQuiz}
                    className="bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Novi kviz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Review Section */}
          {showReview && (
            <div className="mt-8">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-stone-50 to-amber-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-stone-800 font-heading text-center">
                    Pregled odgovora
                  </CardTitle>
                  <p className="text-center text-stone-600">
                    Pregledajte sve pitanja i naučite iz svojih grešaka
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {questions.map((question, index) => {
                    const userAnswerText = getUserAnswerText(question);
                    const correctAnswerText = getCorrectAnswerText(question);
                    const isCorrect = isUserAnswerCorrect(question);

                    return (
                      <div key={question.id} className="p-6 bg-white rounded-lg shadow-sm border border-stone-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                              {index + 1}
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getDifficultyColor(question.tezinaPitanja)}>
                                {question.tezinaPitanja}
                              </Badge>
                              {question.kategorijaNaziv && (
                                <Badge variant="outline">
                                  {question.kategorijaNaziv}
                                </Badge>
                              )}
                            </div>
                          </div>

                        </div>

                        <h3 className="text-lg font-semibold text-stone-800 mb-4 leading-relaxed">
                          {question.tekstPitanja}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`p-4 rounded-lg border-2 ${isCorrect
                              ? 'border-green-200 bg-green-50'
                              : 'border-red-200 bg-red-50'
                            }`}>
                            <h4 className="font-semibold text-stone-700 mb-2">Vaš odgovor:</h4>
                            <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'
                              }`}>
                              {userAnswerText}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg border-2 border-amber-200 bg-amber-50">
                            <h4 className="font-semibold text-stone-700 mb-2">Tačan odgovor:</h4>
                            <p className="font-medium text-amber-800">
                              {correctAnswerText}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    );
  }

  if (quizStarted && currentQuestion) {
    return (
      <main className="container mx-auto px-4 py-16 bg-[--color-bg]">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-center items-center mb-2">
              <span className="text-sm font-medium text-stone-600">
                Pitanje {currentQuestionIndex + 1} od {questions.length}
              </span>
            </div>
          </div>

          {/* Powerup Bar */}
          <div className="mb-6">
            <PowerupBar
              onFiftyFifty={handleFiftyFifty}
              onSkip={handleSkip}
              onRemoveOne={handleRemoveOne}
              disabled={showFeedback}
            />
          </div>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(currentQuestion.tezinaPitanja)}>
                    {currentQuestion.tezinaPitanja}
                  </Badge>
                  {currentQuestion.kategorijaNaziv && (
                    <Badge variant="outline">
                      {currentQuestion.kategorijaNaziv}
                    </Badge>
                  )}

                </div>
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {currentQuestion.tekstPitanja}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Images */}
              {((currentQuestion.pitanjaSlike?.length || 0) > 0 || (currentQuestion.slike?.length || 0) > 0) && (
                <div>
                  <h4 className="font-semibold mb-3">Slike:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(currentQuestion.pitanjaSlike || currentQuestion.slike || []).map((image) => (
                      <div key={image.id} className="text-center">
                        <img
                          src={`${BASE_URL}${image.slikaPath}`}
                          alt={`Question image ${image.id}`}
                          className="w-full h-24 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.png';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-3">
                <h4 className="font-semibold">Odaberite odgovor:</h4>
                {currentQuestion.odgovori
                  .filter(answer => !removedOptions.includes(answer.id))
                  .map((answer) => {
                    const isSelected = selectedAnswer === answer.id;
                    const isCorrectAnswer = answer.tacan;
                    const showCorrect = showFeedback && isCorrectAnswer;
                    const showIncorrect = showFeedback && isSelected && !isCorrectAnswer;

                    return (
                      <button
                        key={answer.id}
                        onClick={() => !showFeedback && selectAnswer(answer.id)}
                        disabled={showFeedback}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${showCorrect
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : showIncorrect
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : isSelected
                              ? 'border-amber-400 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800'
                              : showFeedback
                                ? 'border-gray-200 bg-red-100 text-gray-500 cursor-not-allowed'
                                : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${showCorrect
                            ? 'border-green-500 bg-green-500'
                            : showIncorrect
                              ? 'border-red-500 bg-red-500'
                              : isSelected
                                ? 'border-amber-400 bg-amber-400'
                                : 'border-gray-300'
                            }`}>
                            {(isSelected || showCorrect) && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <span className="font-medium">{answer.tekstOdgovora}</span>
                          {showCorrect && (
                            <span className="ml-auto text-green-600 font-bold">Tačno</span>
                          )}
                          {showIncorrect && (
                            <span className="ml-auto text-red-600 font-bold">Netačno</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  onClick={resetQuiz}
                  className="text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                  Prekini kviz
                </Button>

                {!showFeedback ? (
                  <Button
                    onClick={confirmAnswer}
                    disabled={selectedAnswer === null}
                    className="inline-flex items-center justify-center rounded-xl px-4 sm:px-6 py-2.5 bg-[#5B2323] text-white shadow-md hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 max-w-full"
                  >
                    Potvrdi
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="bg-[#5B2323] text-white rounded-xl shadow-lg hover:bg-[#4a1e1e] 
                             hover:shadow-xl transition-all duration-200 text-white px-4 sm:px-8 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 max-w-full"
                  >
                    <span className="truncate">
                      {currentQuestionIndex < questions.length - 1 ? 'Sljedeće pitanje' : 'Završi kviz'}
                    </span>
                  </Button>
                )}
              </div>
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
            Historijski Kviz
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Testirajte svoje znanje o historijskim događajima i otkrijte fascinantne priče iz prošlosti
          </p>
          
          {/* Diamonds Display */}
          {wallet && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full border border-amber-300">
                <div className="text-2xl">💎</div>
                <div className="text-lg font-bold text-amber-800">
                  {wallet.diamonds_balance}
                </div>
                <div className="text-sm text-amber-600">dijamanata</div>
              </div>
            </div>
          )}
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

          {/* Main Quiz Settings */}
          <div className="mb-8">
            <div className="text-center pb-6">
              <h2 className="text-3xl font-bold text-stone-800 font-serif mb-4">
                Postavke kviza
              </h2>
            </div>
            <div className="space-y-8 px-8 pb-8">
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
                          className="h-12 bg-white w-64 justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {getSelectedRegionLabel()}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-64 bg-white shadow-lg"
                        align="center"
                        sideOffset={4}
                        side="bottom"
                        avoidCollisions={true}
                        collisionPadding={8}
                      >
                        {regionOptions.map((option) => (
                          <DropdownMenuItem 
                            key={option.value} 
                            onClick={() => setSettings(prev => ({ ...prev, region: option.value }))}
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
                          className="h-12 bg-white w-64 justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            {getSelectedCountLabel()}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-64 bg-white shadow-lg"
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
                  onClick={startQuiz}
                  disabled={loading}
                  className="bg-[#5B2323] text-white rounded-xl shadow-lg hover:bg-[#4a1e1e] 
                             hover:shadow-xl transition-all duration-200 text-white px-8 sm:px-16 py-4 text-lg sm:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-600 max-w-full mx-auto"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Učitavanje...
                    </div>
                  ) : (
                    "Započni kviz"
                  )}
                </Button>
              </div>
            </div>
          </div>


          {/* Sample Question Preview */}
          {sampleQuestion && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-stone-50 mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <HelpCircle className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Primjer pitanja</h3>
                    <p className="text-gray-600 italic leading-relaxed mb-3">
                      {sampleQuestion.tekstPitanja}
                    </p>
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(sampleQuestion.tezinaPitanja)}>
                        {sampleQuestion.tezinaPitanja}
                      </Badge>
                      {sampleQuestion.regijaNaziv && (
                        <Badge variant="outline">
                          {sampleQuestion.regijaNaziv}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leaderboard Section */}
          <Leaderboard />
        </div>
      </div>
    </main>
  );
}
