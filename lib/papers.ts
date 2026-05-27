export interface Paper {
  id: string;
  title: string;
  authors: string;
  year: string;
  abstract: string;
  fullText: string;
  chunks: string[];
  uploadedAt: number;
  fileName: string;
  keyFindings?: string[];
  methodology?: string;
  dataset?: string;
}

export function chunkText(text: string, size = 1200, overlap = 150): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + size).join(" ");
    if (chunk.trim()) chunks.push(chunk);
    i += size - overlap;
  }
  return chunks;
}

export function buildContext(papers: Paper[], maxChars = 60000): string {
  return papers
    .map(
      (p, idx) =>
        `=== PAPER ${idx + 1}: ${p.title} (${p.year}) by ${p.authors} ===\n${p.fullText.substring(0, Math.floor(maxChars / papers.length))}`
    )
    .join("\n\n");
}
