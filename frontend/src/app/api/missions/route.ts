// frontend/src/app/api/missions/route.ts
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5050";

/** Proxies GET /api/missions -> {BACKEND}/missions. Falls back to [] if upstream fails. */
export async function GET() {
  try {
    const r = await fetch(`${BACKEND}/missions`, { cache: "no-store" });
    if (!r.ok) {
      // upstream responded but with error; surface empty list to keep UI running
      return NextResponse.json([], { status: 200 });
    }
    const data = await r.json().catch(() => []);
    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch (err) {
    // Backend down/ECONNREFUSED → return empty list so Home renders gracefully
    return NextResponse.json([], { status: 200 });
  }
}
