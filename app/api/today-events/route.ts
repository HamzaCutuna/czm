import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

// Log once in dev
console.log("[today-events] Using backend:", BASE_URL);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dan = searchParams.get("dan") ?? searchParams.get("Dan");
    const mjesec = searchParams.get("mjesec") ?? searchParams.get("Mjesec");

    const backendUrl = new URL("/home-page/na-danasnji-dan", BASE_URL);
    if (dan) backendUrl.searchParams.set("Dan", dan);
    if (mjesec) backendUrl.searchParams.set("Mjesec", mjesec);

    const res = await fetch(backendUrl.toString(), {
      // avoid caching while debugging
      cache: "no-store",
      headers: { "Accept": "application/json" },
    });

    const text = await res.text(); // read body regardless of status

    if (!res.ok) {
      console.error("[today-events] Backend error", res.status, text);
      return new NextResponse(
        JSON.stringify({ status: res.status, error: text || "Backend error" }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const ct = res.headers.get("Content-Type") ?? "application/json";
    return new NextResponse(text, { status: 200, headers: { "Content-Type": ct } });
  } catch (e: unknown) {
    console.error("[today-events] Proxy exception", e);
    return NextResponse.json({ error: (e as Error)?.message ?? "Unknown error" }, { status: 500 });
  }
}
