"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ObavjestenjaRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/projekti");
  }, [router]);

  return (
    <main className="min-h-dvh bg-[--color-bg] text-stone-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-600">Preusmjeravanje na Projekti...</p>
      </div>
    </main>
  );
}
