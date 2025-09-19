"use client";

import { useEffect } from "react";
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
  Award
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { wallet, transactions, loading: walletLoading } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  if (authLoading || walletLoading) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bs-BA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const recentTransactions = transactions.slice(0, 10);

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full shadow-lg">
              <Gem className="h-12 w-12 text-blue-700" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-stone-800 mb-4 font-heading tracking-wide">
            Dashboard
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Dobrodošli, {user.email?.split('@')[0]}!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Wallet Balance */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-800 mb-2 font-heading">
                Vaš balans
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Gem className="h-8 w-8 text-blue-600" />
                <span className="text-4xl font-bold text-blue-700">{wallet?.diamonds_balance || 0}</span>
                <span className="text-xl text-blue-600"></span>
              </div>
              <p className="text-blue-600">
                Ukupno transakcija: <span className="font-semibold">{transactions.length}</span>
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/igre/kviz">
              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-green-700" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2 font-heading">
                    Kviz
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Testirajte svoje znanje
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/igre/dnevni-izazov">
              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full group-hover:scale-110 transition-transform">
                      <Target className="h-8 w-8 text-amber-700" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2 font-heading">
                    Dnevni izazov
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Dobijte dnevni bonus
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/igre/tacno-netacno">
              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full group-hover:scale-110 transition-transform">
                      <Award className="h-8 w-8 text-purple-700" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2 font-heading">
                    Tačno/Netačno
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Jedan nagrađeni pokušaj dnevno
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/kalendar">
              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full group-hover:scale-110 transition-transform">
                      <Calendar className="h-8 w-8 text-blue-700" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2 font-heading">
                    Kalendar
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Historijski događaji
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Transaction History */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-stone-50 to-amber-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-stone-800 font-heading flex items-center gap-2">
                  <History className="h-6 w-6 text-amber-700" />
                  Nedavne transakcije
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-stone-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-stone-600 mb-2">
                    Nema transakcija
                  </h3>
                  <p className="text-stone-500">
                    Počnite igrati da zaradite svoje prve 💎!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.direction === 'earn'
                            ? 'bg-green-100'
                            : 'bg-red-100'
                        }`}>
                          <Gem className={`h-4 w-4 ${
                            transaction.direction === 'earn' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-stone-800">
                            {transaction.source}
                          </p>
                          <p className="text-sm text-stone-500">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.direction === 'earn' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.direction === 'earn' ? '+' : '-'}{transaction.amount} 💎
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
