import { NextRequest } from "next/server";
import { streamGroq } from "@/lib/groq";
import type { Paper } from "@/lib/papers";

export async function POST(request: NextRequest) {
  try {
    const { papers, topic, style } = await request.json() as {
      papers: Paper[];
      topic?: string;
      style?: string;
    };

    if (!papers?.length) return Response.json({ error: "No papers provided" }, { status: 400 });

    const summaries = papers.map((p, i) =>
      `PAPER ${i + 1}: "${p.title}" (${p.year}) by ${p.authors}\nAbstract: ${(p.abstract || "").substring(0, 300)}\nFindings: ${p.keyFindings?.slice(0, 3).join("; ") || "N/A"}\nMethod: ${(p.methodology || "N/A").substring(0, 150)}`
    ).join("\n\n");

    const prompt = `Write a comprehensive literature review${topic ? ` on the topic: "${topic}"` : ""} based on these ${papers.length} papers.

${summaries}

Write a structured literature review in ${style || "academic"} style with these sections:

## Introduction
Brief overview of the research area and why these papers matter.

## Thematic Analysis
Group papers by themes/approaches. Discuss similarities and differences.

## Methodological Overview
Compare the methodologies used across papers.

## Key Findings & Contributions
Synthesize the major findings and contributions.

## Contradictions & Debates
Highlight any conflicting findings or ongoing debates.

## Conclusion
Summarize the state of the field and implications.

Cite papers as [Author et al., Year] or [First Author, Year]. Write in formal academic language.`;

    const stream = await streamGroq(prompt, "You are an expert academic writer specializing in literature reviews. Write in formal, precise academic language.");
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : "Review failed" }, { status: 500 });
  }
}
