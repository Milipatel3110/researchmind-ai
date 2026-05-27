import { NextRequest } from "next/server";
import { searchScholar } from "@/lib/semantic-scholar";
import { searchArxiv } from "@/lib/arxiv";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const source = request.nextUrl.searchParams.get("source") || "both";

  if (!q.trim()) return Response.json({ scholar: [], arxiv: [] });

  try {
    const [scholar, arxiv] = await Promise.all([
      source !== "arxiv" ? searchScholar(q, 8) : Promise.resolve([]),
      source !== "scholar" ? searchArxiv(q, 8) : Promise.resolve([]),
    ]);
    return Response.json({ scholar, arxiv });
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : "Search failed", scholar: [], arxiv: [] }, { status: 500 });
  }
}
