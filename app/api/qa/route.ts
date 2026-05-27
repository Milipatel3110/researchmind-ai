import { NextRequest } from "next/server";
import { streamGroq } from "@/lib/groq";
import type { Paper } from "@/lib/papers";

export async function POST(request: NextRequest) {
  try {
    const { question, papers, history } = await request.json() as {
      question: string;
      papers: Paper[];
      history?: { role: string; content: string }[];
    };

    if (!question?.trim()) return Response.json({ error: "Question required" }, { status: 400 });
    if (!papers?.length) return Response.json({ error: "No papers provided" }, { status: 400 });

    const charsPerPaper = Math.floor(4000 / Math.max(papers.length, 1));
    const context = papers
      .map((p, i) => `=== PAPER ${i + 1}: "${p.title}" (${p.year}) by ${p.authors} ===\nAbstract: ${p.abstract?.substring(0, 400) || ""}\nFindings: ${p.keyFindings?.slice(0, 3).join("; ") || ""}\nExcerpt: ${p.fullText.substring(0, charsPerPaper)}`)
      .join("\n\n---\n\n");

    const historyText = history?.length
      ? `\nPrior: ${history.slice(-2).map(m => `${m.role}: ${m.content.substring(0, 200)}`).join(" | ")}\n`
      : "";

    const prompt = `Research assistant with ${papers.length} paper(s).${historyText}

${context}

QUESTION: ${question}

Answer concisely (3-5 sentences). Cite papers as [Paper Title]. If not found, say so.`;

    const stream = await streamGroq(prompt, "You are an expert research assistant. Always cite sources from the provided papers using [Paper Title] format.");
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : "Q&A failed" }, { status: 500 });
  }
}
