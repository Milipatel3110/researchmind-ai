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

    const context = papers
      .map((p, i) => `=== PAPER ${i + 1}: "${p.title}" (${p.year}) by ${p.authors} ===\n${p.fullText.substring(0, Math.floor(50000 / papers.length))}`)
      .join("\n\n---\n\n");

    const historyText = history?.length
      ? `\nConversation history:\n${history.slice(-4).map(m => `${m.role}: ${m.content}`).join("\n")}\n`
      : "";

    const prompt = `You are a research assistant with access to ${papers.length} paper(s).${historyText}

PAPERS:
${context}

QUESTION: ${question}

Answer the question based ONLY on the provided papers. For every key claim, cite the paper title in brackets like [Paper Title]. If the answer spans multiple papers, compare and contrast them. If not found in the papers, say so clearly.`;

    const stream = await streamGroq(prompt, "You are an expert research assistant. Always cite sources from the provided papers using [Paper Title] format.");
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : "Q&A failed" }, { status: 500 });
  }
}
