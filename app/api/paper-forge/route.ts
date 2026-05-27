import { NextRequest } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// Use 8B model — 131K TPM free tier vs 12K for 70B. Fine for structured text generation.
const MODEL = "llama-3.1-8b-instant";

export async function POST(request: NextRequest) {
  try {
    const { papers, config } = await request.json() as {
      papers: {
        title: string; authors: string; year: string;
        abstract?: string; keyFindings?: string[];
        methodology?: string; dataset?: string;
      }[];
      config: {
        title: string;
        authors: string;
        affiliation?: string;
        sections: string[];
        targetLength: "short" | "medium" | "long";
        maxCitations: number;
        keywords?: string;
      };
    };

    if (!papers?.length) return Response.json({ error: "No papers" }, { status: 400 });
    if (!config.title?.trim()) return Response.json({ error: "Title required" }, { status: 400 });

    const wordTarget = config.targetLength === "short" ? "1200–1600" : config.targetLength === "medium" ? "2000–2500" : "2800–3200";
    const pagesTarget = config.targetLength === "short" ? "4" : config.targetLength === "medium" ? "6" : "8";

    const paperSummaries = papers.map((p, i) =>
      `[${i + 1}] ${p.authors}. "${p.title}," ${p.year}.\n   Abstract: ${(p.abstract || "").substring(0, 200)}\n   Key Findings: ${p.keyFindings?.slice(0, 3).join("; ") || "N/A"}\n   Method: ${(p.methodology || "N/A").substring(0, 120)}\n   Dataset: ${p.dataset || "N/A"}`
    ).join("\n\n");

    const sectionInstructions = config.sections.map((s, i) => {
      const num = toRoman(i + 1);
      switch (s) {
        case "abstract":       return `\n## ABSTRACT\n(150–200 word structured abstract: background, objective, methods surveyed, key findings, conclusion)`;
        case "introduction":   return `\n## ${num}. INTRODUCTION\n(Motivate the problem, state contributions, describe paper organization)`;
        case "background":     return `\n## ${num}. BACKGROUND AND RELATED WORK\n(Survey prior work, compare to surveyed papers, cite [1]–[${papers.length}])`;
        case "methodology":    return `\n## ${num}. METHODOLOGY\n(Describe and compare the methodologies from the surveyed papers in detail)`;
        case "comparison":     return `\n## ${num}. COMPARATIVE ANALYSIS\n(Systematic comparison of approaches, strengths, weaknesses — use a table if helpful)`;
        case "results":        return `\n## ${num}. RESULTS AND DISCUSSION\n(Synthesize quantitative and qualitative results across papers, highlight consensus and conflicts)`;
        case "limitations":    return `\n## ${num}. LIMITATIONS AND CHALLENGES\n(Cross-paper limitations, open problems, reproducibility concerns)`;
        case "future":         return `\n## ${num}. FUTURE RESEARCH DIRECTIONS\n(Concrete future directions emerging from the gaps in surveyed literature)`;
        case "conclusion":     return `\n## ${num}. CONCLUSION\n(Summarize the survey, restate contributions, final remarks)`;
        default:               return `\n## ${num}. ${s.toUpperCase()}\n(Write this section based on the surveyed papers)`;
      }
    }).join("\n");

    const refsSection = config.sections.includes("references") || true
      ? `\n## REFERENCES\n(List all cited papers in IEEE format: [1] Author(s), "Title," Journal/Conference, vol., no., pp., year. Include all ${Math.min(papers.length + Math.floor(config.maxCitations * 0.4), config.maxCitations)} references. Always include the ${papers.length} surveyed papers.)`
      : "";

    const prompt = `You are an expert academic writer. Write a complete, publication-ready IEEE survey/review paper.

PAPER METADATA:
Title: ${config.title}
Authors: ${config.authors}${config.affiliation ? `\nAffiliation: ${config.affiliation}` : ""}${config.keywords ? `\nKeywords: ${config.keywords}` : ""}
Target: ~${wordTarget} words (approximately ${pagesTarget} IEEE pages)

SURVEYED PAPERS (these are your primary sources, cite them):
${paperSummaries}

OUTPUT INSTRUCTIONS:
- Write each section fully — do not use placeholders like "[write more here]"
- Use IEEE citation style: cite papers as [1], [2], etc.
- Section headers exactly as shown below (e.g., "## I. INTRODUCTION")
- Write ${wordTarget} words total across all body sections
- Be specific: mention paper titles, authors, results, metrics where relevant
- For the References section: format each as [N] Firstname Lastname, "Title," Source, year.

GENERATE THE COMPLETE PAPER NOW:
${sectionInstructions}
${refsSection}`;

    const stream = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are an expert IEEE paper writer. Write complete, detailed academic content. Never truncate sections. Always finish every section fully." },
        { role: "user", content: prompt },
      ],
      stream: true,
      max_tokens: 3500,
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content ?? "";
              if (text) controller.enqueue(encoder.encode(text));
            }
          } finally {
            controller.close();
          }
        },
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  } catch (error: unknown) {
    console.error("Paper forge error:", error);
    return Response.json({ error: error instanceof Error ? error.message : "Generation failed" }, { status: 500 });
  }
}

function toRoman(n: number): string {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}
