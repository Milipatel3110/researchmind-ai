export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  updated: string;
  link: string;
  pdfLink: string;
  categories: string[];
}

export async function searchArxiv(query: string, maxResults = 10): Promise<ArxivPaper[]> {
  const params = new URLSearchParams({
    search_query: `all:${query}`,
    start: "0",
    max_results: String(maxResults),
    sortBy: "relevance",
    sortOrder: "descending",
  });

  const res = await fetch(`https://export.arxiv.org/api/query?${params}`);
  if (!res.ok) return [];
  const xml = await res.text();

  const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
  return entries.map((entry) => {
    const get = (tag: string) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : "";
    };
    const authors = [...entry.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((m) => m[1].trim());
    const id = get("id").split("/abs/").pop() || "";
    const categories = [...entry.matchAll(/term="([^"]+)"/g)].map((m) => m[1]);
    return {
      id,
      title: get("title").replace(/\s+/g, " "),
      summary: get("summary").replace(/\s+/g, " "),
      authors,
      published: get("published"),
      updated: get("updated"),
      link: `https://arxiv.org/abs/${id}`,
      pdfLink: `https://arxiv.org/pdf/${id}`,
      categories,
    };
  });
}
