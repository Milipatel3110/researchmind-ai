import { NextRequest } from "next/server";
import { callGroq } from "@/lib/groq";
import type { Paper } from "@/lib/papers";

export async function POST(request: NextRequest) {
  try {
    const { papers } = await request.json() as { papers: Paper[] };
    if (papers?.length < 2) return Response.json({ error: "Need at least 2 papers" }, { status: 400 });

    const summaries = papers.map((p, i) =>
      `PAPER ${i + 1}: "${p.title}" (${p.year}) by ${p.authors}\nAbstract: ${(p.abstract || "").substring(0, 250)}\nMethod: ${(p.methodology || "N/A").substring(0, 150)}\nFindings: ${p.keyFindings?.slice(0, 3).join("; ") || "N/A"}\nDataset: ${p.dataset || "N/A"}`
    ).join("\n\n");

    const prompt = `Compare these ${papers.length} research papers and return a JSON object for a comparison matrix.

${summaries}

Return ONLY a JSON object (no markdown fences):
{
  "papers": [
    {
      "title": "...",
      "year": "...",
      "authors": "...",
      "problem": "what problem does this paper solve",
      "methodology": "approach/method used",
      "dataset": "dataset used",
      "keyResults": "main results with metrics",
      "limitations": "main limitations",
      "contribution": "core novelty/contribution",
      "citationWorthiness": "high/medium/low — brief reason"
    }
  ],
  "verdict": "2-3 sentence synthesis comparing all papers",
  "bestFor": { "paperTitle": "recommendation for specific use case" }
}`;

    const raw = await callGroq(prompt, "Return ONLY valid JSON. No markdown.");
    let data;
    try {
      const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch {
      data = { papers: [], verdict: "Could not parse comparison.", bestFor: {} };
    }

    return Response.json(data);
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : "Comparison failed" }, { status: 500 });
  }
}
