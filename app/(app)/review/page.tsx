"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { BookOpen, Loader2, Copy, Check, Upload } from "lucide-react";
import { usePapers, streamResponse } from "@/lib/usePapers";
import Link from "next/link";

export default function ReviewPage() {
  const { papers } = usePapers();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("academic");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const toggle = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll = () => setSelectedIds(papers.map(p => p.id));
  const selected = papers.filter(p => selectedIds.includes(p.id));

  const generate = async () => {
    if (!selected.length) { setError("Select at least one paper."); return; }
    setLoading(true); setOutput(""); setError("");
    try {
      await streamResponse("/api/review", { papers: selected, topic, style }, setOutput);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (papers.length === 0) return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <BookOpen className="w-10 h-10 text-white/20 mb-4" />
      <p className="text-white/50 mb-4">Upload papers first to generate a literature review.</p>
      <Link href="/vault" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white text-sm font-semibold hover:opacity-90">
        <Upload className="w-4 h-4" /> Go to Paper Vault
      </Link>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#34d399]/15 border border-[#34d399]/25 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#34d399]" />
          </div>
          <h1 className="text-2xl font-bold">Literature Review Generator</h1>
        </div>
        <p className="text-white/40 text-sm ml-11">Select papers → get a structured lit review ready for your thesis.</p>
      </motion.div>

      <div className="grid lg:grid-cols-[320px,1fr] gap-6">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Papers ({selected.length}/{papers.length})</span>
              <button onClick={selectAll} className="text-xs text-[#4f8ef7] hover:underline">Select All</button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {papers.map(p => (
                <label key={p.id} className="flex items-start gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggle(p.id)} className="mt-0.5 accent-[#4f8ef7]" />
                  <div>
                    <div className="text-sm text-white group-hover:text-[#4f8ef7] transition-colors leading-snug">{p.title.substring(0, 50)}{p.title.length > 50 ? "…" : ""}</div>
                    <div className="text-xs text-white/30">{p.year}</div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card rounded-2xl p-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1.5">Focus Topic (optional)</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. transfer learning in NLP" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#34d399]/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1.5">Writing Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none">
                <option value="academic">Academic (Formal)</option>
                <option value="concise">Concise (Bullet-heavy)</option>
                <option value="narrative">Narrative (Story-driven)</option>
              </select>
            </div>
          </motion.div>

          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">{error}</div>}

          <button onClick={generate} disabled={loading || !selected.length}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#34d399] to-[#4f8ef7] text-white font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><BookOpen className="w-4 h-4" /> Generate Review</>}
          </button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card rounded-2xl p-6 min-h-[400px]">
          {!output && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <BookOpen className="w-8 h-8 text-white/15 mb-3" />
              <p className="text-white/30 text-sm">Your literature review will appear here.</p>
            </div>
          )}
          {loading && !output && (
            <div className="flex items-center gap-3 justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-[#34d399]" />
              <span className="text-white/50 text-sm">Writing your literature review…</span>
            </div>
          )}
          {output && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/40">{selected.length} paper{selected.length !== 1 ? "s" : ""} synthesized</span>
                <button onClick={copy} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg">
                  {copied ? <><Check className="w-3.5 h-3.5 text-[#34d399]" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>
              <div className="prose text-sm"><ReactMarkdown>{output}</ReactMarkdown></div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
