"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, isAllowedEmail } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAllowedEmail(email)) {
      toast.error("Email domain not allowed. Only @edu.fit.ba and @gmail.com are permitted.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created successfully! Please check your email to confirm your account.");
      router.push("/auth/signin");
    }
    
    setLoading(false);
  };

  const isEmailValid = email && isAllowedEmail(email);
  const isPasswordValid = password.length >= 6;
  const isPasswordMatch = password === confirmPassword && confirmPassword.length > 0;

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-stone-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full shadow-lg">
                <UserPlus className="h-8 w-8 text-green-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-stone-800 font-heading">
              Registrujte se
            </CardTitle>
            <p className="text-stone-600 mt-2">
              Kreirajte svoj račun
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
                    className={`pl-10 border-stone-300 focus:border-amber-500 ${
                      email && !isEmailValid ? 'border-red-300' : ''
                    }`}
                    required
                  />
                </div>
                {email && (
                  <div className="flex items-center gap-2 text-sm">
                    {isEmailValid ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Email domain allowed</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Email domain not allowed</span>
                      </>
                    )}
                  </div>
                )}
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
                    className={`pl-10 border-stone-300 focus:border-amber-500 ${
                      password && !isPasswordValid ? 'border-red-300' : ''
                    }`}
                    required
                  />
                </div>
                {password && (
                  <div className="flex items-center gap-2 text-sm">
                    {isPasswordValid ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Password is valid</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Password must be at least 6 characters</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-stone-700 font-medium">
                  Potvrdite lozinku
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 border-stone-300 focus:border-amber-500 ${
                      confirmPassword && !isPasswordMatch ? 'border-red-300' : ''
                    }`}
                    required
                  />
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-2 text-sm">
                    {isPasswordMatch ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !isEmailValid || !isPasswordValid || !isPasswordMatch}
                className="w-full bg-[#5B2323] text-white rounded-xl shadow-lg hover:bg-[#4a1e1e] hover:shadow-xl transition-all duration-200 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Kreiranje računa...
                  </div>
                ) : (
                  "Registrujte se"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-stone-600 text-sm">
                Već imate račun?{" "}
                <Link
                  href="/auth/signin"
                  className="text-[#5B2323] hover:text-[#4a1e1e] font-medium"
                >
                  Prijavite se
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
