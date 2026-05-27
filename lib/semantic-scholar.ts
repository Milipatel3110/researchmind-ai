export interface ScholarPaper {
  paperId: string;
  title: string;
  abstract?: string;
  year?: number;
  citationCount?: number;
  authors: { name: string }[];
  externalIds?: { DOI?: string; ArXiv?: string };
  openAccessPdf?: { url: string };
  url: string;
}

export async function searchScholar(query: string, limit = 10): Promise<ScholarPaper[]> {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    fields: "title,abstract,year,citationCount,authors,externalIds,openAccessPdf,url",
  });
  const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?${params}`, {
    headers: { "User-Agent": "ResearchMindAI/1.0" },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export async function getRecommendations(paperId: string, limit = 6): Promise<ScholarPaper[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    fields: "title,abstract,year,citationCount,authors,externalIds,openAccessPdf,url",
  });
  const res = await fetch(
    `https://api.semanticscholar.org/recommendations/v1/papers/forpaper/${paperId}?${params}`,
    { headers: { "User-Agent": "ResearchMindAI/1.0" } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.recommendedPapers || [];
}
