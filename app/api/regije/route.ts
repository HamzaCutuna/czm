import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export async function GET() {
  try {
    const backendUrl = new URL("/regije/lookup", BASE_URL);
    const res = await fetch(backendUrl.toString(), { cache: "no-store", headers: { Accept: "application/json" } });
    const text = await res.text();
    if (!res.ok) {
      return new NextResponse(
        JSON.stringify({ status: res.status, error: text || "Backend error" }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }
    const ct = res.headers.get("Content-Type") ?? "application/json";
    return new NextResponse(text, { status: 200, headers: { "Content-Type": ct } });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error)?.message ?? "Unknown error" }, { status: 500 });
  }
}


