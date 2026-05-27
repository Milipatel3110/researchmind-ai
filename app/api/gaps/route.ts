import { NextRequest } from "next/server";
import { streamGroq } from "@/lib/groq";
import type { Paper } from "@/lib/papers";

export async function POST(request: NextRequest) {
  try {
    const { papers } = await request.json() as { papers: Paper[] };
    if (!papers?.length) return Response.json({ error: "No papers provided" }, { status: 400 });

    const context = papers.map((p, i) =>
      `PAPER ${i + 1}: "${p.title}" (${p.year})\nAbstract: ${p.abstract}\nFindings: ${p.keyFindings?.join("; ")}\nMethodology: ${p.methodology}\nLimitations/Future Work from text: ${p.fullText.substring(p.fullText.length - 2000)}`
    ).join("\n\n");

    const prompt = `Analyze these ${papers.length} research papers and identify research gaps, limitations, and unexplored areas.

${context}

Provide a thorough research gap analysis:

## Executive Summary
2-3 sentences on the overall state of research in this area.

## Identified Research Gaps
List each gap with:
- **Gap**: What is missing
- **Evidence**: Which papers hint at or leave this unaddressed
- **Significance**: Why filling this gap matters

## Methodological Limitations
What methodological weaknesses or biases exist across these studies?

## Underrepresented Populations / Domains
What populations, domains, or contexts are missing?

## Temporal Gaps
What has changed since these papers were published? What needs re-examining?

## Contradictions Worth Resolving
Where do papers disagree? What experiments could resolve the conflict?

## Priority Research Directions
Rank the top 5 most impactful gaps to address, with brief justification.`;

    const stream = await streamGroq(prompt, "You are a senior research analyst expert at identifying gaps in academic literature.");
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : "Gap analysis failed" }, { status: 500 });
  }
}
