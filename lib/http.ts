const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined | null>, init?: RequestInit): Promise<T> {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), {
    ...init,
    next: { revalidate: 60 }, // simple caching
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API GET ${url} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export function absolutize(url?: string | null): string | undefined {
  if (!url) return undefined;
  try { new URL(url); return url; } catch {}
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return url;
  return new URL(url, base).toString();
}
