import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5050";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${BACKEND}/missions/${params.id}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }
    
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error fetching mission:", err);
    return NextResponse.json({ error: "Failed to fetch mission" }, { status: 500 });
  }
}