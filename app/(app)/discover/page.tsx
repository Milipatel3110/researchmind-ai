"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Telescope, Search, ExternalLink, Loader2, BookOpen, Users, Calendar, Star, FileDown } from "lucide-react";
import type { ScholarPaper } from "@/lib/semantic-scholar";
import type { ArxivPaper } from "@/lib/arxiv";

type Tab = "both" | "scholar" | "arxiv";

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("both");
  const [scholar, setScholar] = useState<ScholarPaper[]>([]);
  const [arxiv, setArxiv] = useState<ArxivPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(""); setSearched(true);
    try {
      const params = new URLSearchParams({ q: query, source: tab });
      const res = await fetch(`/api/discover?${params}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setScholar(data.scholar || []);
      setArxiv(data.arxiv || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Search failed"); }
    finally { setLoading(false); }
  };

  const SUGGESTIONS = ["transformer attention mechanism", "federated learning privacy", "large language models reasoning", "deepfake detection", "reinforcement learning robotics"];

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#34d399]/15 border border-[#34d399]/25 flex items-center justify-center">
            <Telescope className="w-4 h-4 text-[#34d399]" />
          </div>
          <h1 className="text-2xl font-bold">Discover Papers</h1>
        </div>
        <p className="text-white/40 text-sm ml-11">Search live across Semantic Scholar and ArXiv.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card rounded-2xl p-4 mb-4">
        <div className="flex gap-3 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} placeholder="Search papers by topic, title, or keywords…" className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none" />
          </div>
          <select value={tab} onChange={e => setTab(e.target.value as Tab)} className="bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-white/80 outline-none">
            <option value="both">Both Sources</option>
            <option value="scholar">Semantic Scholar</option>
            <option value="arxiv">ArXiv</option>
          </select>
          <button onClick={search} disabled={loading || !query.trim()} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#4f8ef7] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40 flex items-center gap-2 transition-opacity">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => { setQuery(s); }} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/8 transition-colors">
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 text-red-400 text-sm">{error}</div>}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16">
          <Loader2 className="w-5 h-5 animate-spin text-[#34d399]" />
          <span className="text-white/50 text-sm">Searching Semantic Scholar &amp; ArXiv…</span>
        </div>
      )}

      {!loading && searched && scholar.length === 0 && arxiv.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <BookOpen className="w-8 h-8 mx-auto mb-3" />
          <p>No papers found. Try different keywords.</p>
        </div>
      )}

      {!loading && !searched && (
        <div className="text-center py-16 text-white/20">
          <Telescope className="w-10 h-10 mx-auto mb-3" />
          <p>Search to discover papers from Semantic Scholar and ArXiv.</p>
        </div>
      )}

      {!loading && (scholar.length > 0 || arxiv.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-6">
          {scholar.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-[#f59e0b]" /> Semantic Scholar ({scholar.length})
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {scholar.map((p, i) => (
                    <motion.div key={p.paperId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card rounded-xl p-4 hover:border-white/15 transition-colors">
                      <h3 className="font-medium text-white text-sm leading-snug mb-2">{p.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-2">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{p.authors.slice(0, 2).map(a => a.name).join(", ")}{p.authors.length > 2 ? " et al." : ""}</span>
                        {p.year && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.year}</span>}
                        {p.citationCount !== undefined && <span className="flex items-center gap-1 text-[#f59e0b]"><Star className="w-3 h-3" />{p.citationCount.toLocaleString()} citations</span>}
                      </div>
                      {p.abstract && <p className="text-xs text-white/40 line-clamp-2 mb-3">{p.abstract}</p>}
                      <div className="flex gap-2">
                        <a href={p.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#4f8ef7] hover:underline">
                          <ExternalLink className="w-3 h-3" /> View Paper
                        </a>
                        {p.openAccessPdf?.url && (
                          <a href={p.openAccessPdf.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#34d399] hover:underline">
                            <FileDown className="w-3 h-3" /> PDF
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {arxiv.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#a78bfa]" /> ArXiv ({arxiv.length})
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {arxiv.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card rounded-xl p-4 hover:border-white/15 transition-colors">
                      <h3 className="font-medium text-white text-sm leading-snug mb-2">{p.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-2">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{p.authors.slice(0, 2).join(", ")}{p.authors.length > 2 ? " et al." : ""}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(p.published).getFullYear()}</span>
                        {p.categories[0] && <span className="px-1.5 py-0.5 rounded bg-[#a78bfa]/10 text-[#a78bfa]">{p.categories[0]}</span>}
                      </div>
                      <p className="text-xs text-white/40 line-clamp-2 mb-3">{p.summary}</p>
                      <div className="flex gap-2">
                        <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#a78bfa] hover:underline">
                          <ExternalLink className="w-3 h-3" /> Abstract
                        </a>
                        <a href={p.pdfLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#34d399] hover:underline">
                          <FileDown className="w-3 h-3" /> PDF
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
