import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

// Simple proxy to backend flat events list with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const backendUrl = new URL("/historijski-dogadjaji/flat", BASE_URL);

    // passthrough for supported params
    const pass = ["from", "to", "regijaId", "kategorijaId", "q", "take", "onlyWithImage"]; 
    for (const k of pass) {
      const v = searchParams.get(k) ?? searchParams.get(k.toUpperCase());
      if (v != null) backendUrl.searchParams.set(k, v);
    }

    // Default sensible values
    if (!backendUrl.searchParams.has("take")) backendUrl.searchParams.set("take", "1000");
    if (!backendUrl.searchParams.has("onlyWithImage")) backendUrl.searchParams.set("onlyWithImage", "false");

    const res = await fetch(backendUrl.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

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


