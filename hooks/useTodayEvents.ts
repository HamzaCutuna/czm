"use client";
import useSWR from "swr";
import { todayInSarajevo } from "@/lib/tz";
import type { NaDanasnjiDanResponse } from "@/types/today";

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  const text = await r.text();
  if (!r.ok) {
    let payload: any = text;
    try { payload = JSON.parse(text); } catch {}
    throw new Error(`Failed: ${r.status} — ${payload?.error ?? text}`);
  }
  return JSON.parse(text) as NaDanasnjiDanResponse;
};

export function useTodayEvents(dan?: number, mjesec?: number) {
  const base = typeof window === "undefined" ? todayInSarajevo() : todayInSarajevo();
  const d = dan ?? base.dan;
  const m = mjesec ?? base.mjesec;

  const qs = new URLSearchParams({ dan: String(d), mjesec: String(m) });
  const key = `/api/today-events?${qs.toString()}`;
  const { data, error, isLoading, mutate } = useSWR<NaDanasnjiDanResponse>(key, fetcher, {
    revalidateOnFocus: false,
  });
  return { data, error, isLoading, reload: mutate, dan: d, mjesec: m };
}
