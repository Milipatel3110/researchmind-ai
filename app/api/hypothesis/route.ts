import { NextRequest } from "next/server";
import { streamGroq } from "@/lib/groq";
import type { Paper } from "@/lib/papers";

export async function POST(request: NextRequest) {
  try {
    const { papers, focus } = await request.json() as { papers: Paper[]; focus?: string };
    if (!papers?.length) return Response.json({ error: "No papers provided" }, { status: 400 });

    const context = papers.map((p, i) =>
      `PAPER ${i + 1}: "${p.title}" (${p.year})\nFindings: ${p.keyFindings?.slice(0, 3).join("; ") || ""}\nMethod: ${(p.methodology || "").substring(0, 150)}\nAbstract: ${(p.abstract || "").substring(0, 300)}`
    ).join("\n\n");

    const prompt = `Based on these ${papers.length} research papers${focus ? ` with a focus on: "${focus}"` : ""}, generate exciting novel research hypotheses.

${context}

Generate 5 novel, testable research hypotheses:

## Hypothesis Generation

For each hypothesis, provide:

### Hypothesis [N]: [Catchy Title]
**Statement**: A clear, testable hypothesis statement (H1: ...)
**Rationale**: Why this hypothesis emerges from the existing literature
**Supporting Evidence**: Which papers and findings support investigating this
**Methodology Suggestion**: How you would test this hypothesis
**Expected Impact**: What it means for the field if confirmed/rejected
**Novelty Score**: ⭐⭐⭐⭐⭐ (how new/unexplored this is)
**Feasibility**: High / Medium / Low — brief explanation

---

## Quick-Win Hypotheses
2 simpler hypotheses that could be tested with existing methods/data.

## Moonshot Hypothesis
1 bold, high-risk high-reward hypothesis that could transform the field.`;

    const stream = await streamGroq(prompt, "You are a visionary research scientist who generates novel, impactful research hypotheses grounded in existing literature.");
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : "Hypothesis generation failed" }, { status: 500 });
  }
}
