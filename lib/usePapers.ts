import { useState, useEffect } from "react";
import type { Paper } from "./papers";

const KEY = "researchmind_papers";

export function usePapers() {
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setPapers(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (updated: Paper[]) => {
    setPapers(updated);
    try { localStorage.setItem(KEY, JSON.stringify(updated)); } catch {}
  };

  const addPaper = (paper: Paper) => save([...papers, paper]);
  const removePaper = (id: string) => save(papers.filter(p => p.id !== id));
  const clearAll = () => save([]);

  return { papers, addPaper, removePaper, clearAll };
}

export async function streamResponse(
  url: string,
  body: unknown,
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
    onChunk(result);
  }
}
