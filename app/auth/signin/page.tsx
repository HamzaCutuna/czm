"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Sign in error details:', error);

        // Provide more specific error messages
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Neispravni podaci za prijavu. Provjerite email i lozinku.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email nije potvrđen. Provjerite svoju email poštu i kliknite na link za potvrdu.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Previše pokušaja. Pokušajte ponovo za nekoliko minuta.';
        } else if (error.message.includes('User not found') || error.message.includes('user_not_found')) {
          errorMessage = 'Korisnik nije pronađen. Provjerite da li ste se registrovali sa ovim email-om.';
        } else if (error.message.includes('signup_disabled')) {
          errorMessage = 'Registracija je trenutno onemogućena. Kontaktirajte administratora.';
        }

        toast.error(errorMessage);
      } else {
        toast.success("Uspješno ste se prijavili!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error('Došlo je do greške. Pokušajte ponovo.');
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg">
                <LogIn className="h-8 w-8 text-amber-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-stone-800 font-heading">
              Prijavi se
            </CardTitle>
            <p className="text-stone-600 mt-2">
              Unesite svoje podatke za prijavu
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="vas@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-stone-300 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-700 font-medium">
                  Lozinka
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-stone-300 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5B2323] text-white rounded-xl shadow-lg hover:bg-[#4a1e1e] hover:shadow-xl transition-all duration-200 py-3"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Prijavljivanje...
                  </div>
                ) : (
                  "Prijavi se"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-stone-600 text-sm">
                Nemate račun?{" "}
                <Link
                  href="/auth/signup"
                  className="text-[#5B2323] hover:text-[#4a1e1e] font-medium"
                >
                  Registrujte se
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Dozvoljeni email domeni:</p>
                  <p>• @edu.fit.ba (studenti i nastavnici)</p>
                  <p>• @gmail.com (testiranje)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
