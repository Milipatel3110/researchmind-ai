import { NextRequest } from "next/server";
import { callGroq } from "@/lib/groq";
import { chunkText } from "@/lib/papers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

    let fullText = "";
    if (file.type === "application/pdf") {
      const uint8Array = new Uint8Array(await file.arrayBuffer());
      const { getDocumentProxy, extractText } = await import("unpdf");
      const pdf = await getDocumentProxy(uint8Array);
      const { text } = await extractText(pdf, { mergePages: true });
      fullText = text;
    } else {
      fullText = await file.text();
    }

    if (!fullText.trim()) return Response.json({ error: "Could not extract text from file" }, { status: 400 });

    const metaPrompt = `Extract metadata from this research paper. Return ONLY a JSON object with these fields:
{
  "title": "paper title",
  "authors": "Author1, Author2 (comma separated)",
  "year": "publication year or Unknown",
  "abstract": "abstract text (max 300 words)",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "methodology": "brief methodology description",
  "dataset": "dataset used or N/A"
}

Paper text (first 2500 chars):
${fullText.substring(0, 2500)}`;

    const metaRaw = await callGroq(metaPrompt, "You are a research paper metadata extractor. Return ONLY valid JSON, no markdown fences.");
    let meta = { title: file.name, authors: "Unknown", year: "Unknown", abstract: "", keyFindings: [] as string[], methodology: "", dataset: "" };
    try {
      const cleaned = metaRaw.replace(/```json\n?|\n?```/g, "").trim();
      meta = { ...meta, ...JSON.parse(cleaned) };
    } catch {}

    const chunks = chunkText(fullText);

    return Response.json({
      id: `paper_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      fileName: file.name,
      fullText: fullText.substring(0, 80000),
      chunks: chunks.slice(0, 60),
      uploadedAt: Date.now(),
      ...meta,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
