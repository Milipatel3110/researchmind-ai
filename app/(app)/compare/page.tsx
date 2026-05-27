"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Loader2, Upload, ChevronRight } from "lucide-react";
import { usePapers } from "@/lib/usePapers";
import Link from "next/link";

interface CompareResult {
  papers: {
    title: string; year: string; authors: string;
    problem: string; methodology: string; dataset: string;
    keyResults: string; limitations: string; contribution: string;
    citationWorthiness: string;
  }[];
  verdict: string;
  bestFor: Record<string, string>;
}

const FIELDS: { key: keyof CompareResult["papers"][0]; label: string; color: string }[] = [
  { key: "problem", label: "Problem", color: "text-[#4f8ef7]" },
  { key: "methodology", label: "Methodology", color: "text-[#a78bfa]" },
  { key: "dataset", label: "Dataset", color: "text-[#34d399]" },
  { key: "keyResults", label: "Key Results", color: "text-[#f59e0b]" },
  { key: "limitations", label: "Limitations", color: "text-[#ef4444]" },
  { key: "contribution", label: "Contribution", color: "text-[#06b6d4]" },
  { key: "citationWorthiness", label: "Citation Value", color: "text-[#f472b6]" },
];

export default function ComparePage() {
  const { papers } = usePapers();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selected = papers.filter(p => selectedIds.includes(p.id));

  const compare = async () => {
    if (selected.length < 2) { setError("Select at least 2 papers."); return; }
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ papers: selected }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setResult(await res.json());
    } catch (e) { setError(e instanceof Error ? e.message : "Comparison failed"); }
    finally { setLoading(false); }
  };

  if (papers.length === 0) return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <GitBranch className="w-10 h-10 text-white/20 mb-4" />
      <p className="text-white/50 mb-4">Upload papers first to compare them.</p>
      <Link href="/vault" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white text-sm font-semibold hover:opacity-90">
        <Upload className="w-4 h-4" /> Go to Paper Vault
      </Link>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#06b6d4]/15 border border-[#06b6d4]/25 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <h1 className="text-2xl font-bold">Paper Comparison Matrix</h1>
        </div>
        <p className="text-white/40 text-sm ml-11">Side-by-side: methodology, dataset, results, and more.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card rounded-2xl p-5 mb-6">
        <p className="text-xs text-white/40 mb-3">Select 2–5 papers to compare:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {papers.map(p => (
            <button key={p.id} onClick={() => toggle(p.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${selectedIds.includes(p.id) ? "bg-[#06b6d4]/15 border-[#06b6d4]/30 text-[#06b6d4]" : "border-white/10 text-white/40 hover:text-white/70"}`}>
              {p.title.substring(0, 40)}{p.title.length > 40 ? "…" : ""}
            </button>
          ))}
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm mb-3">{error}</div>}
        <button onClick={compare} disabled={loading || selected.length < 2}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4f8ef7] text-white font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Comparing {selected.length} papers…</> : <><GitBranch className="w-4 h-4" /> Compare {selected.length} Paper{selected.length !== 1 ? "s" : ""}</>}
        </button>
      </motion.div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {result.verdict && (
            <div className="card rounded-2xl p-5 mb-6 border-l-2 border-[#06b6d4]">
              <p className="text-xs font-semibold text-[#06b6d4] uppercase tracking-wider mb-2">Verdict</p>
              <p className="text-sm text-white/70">{result.verdict}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider w-32 bg-white/3 rounded-tl-xl">Dimension</th>
                  {result.papers.map((p, i) => (
                    <th key={i} className="text-left px-4 py-3 bg-white/3">
                      <div className="font-semibold text-white text-xs leading-snug">{p.title.substring(0, 45)}{p.title.length > 45 ? "…" : ""}</div>
                      <div className="text-white/40 text-[10px] font-normal">{p.authors.substring(0, 30)} · {p.year}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FIELDS.map((field, fi) => (
                  <tr key={field.key} className={fi % 2 === 0 ? "bg-white/2" : ""}>
                    <td className="px-4 py-3 font-medium">
                      <span className={`text-xs ${field.color}`}>{field.label}</span>
                    </td>
                    {result.papers.map((p, pi) => (
                      <td key={pi} className="px-4 py-3 text-xs text-white/60 border-l border-white/5 align-top">
                        {String(p[field.key] || "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {Object.keys(result.bestFor || {}).length > 0 && (
            <div className="card rounded-2xl p-5 mt-6">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Best Paper For…</p>
              <div className="space-y-2">
                {Object.entries(result.bestFor).map(([paper, reason]) => (
                  <div key={paper} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="w-3.5 h-3.5 text-[#06b6d4] mt-0.5 flex-shrink-0" />
                    <div><span className="text-white font-medium">{paper}</span><span className="text-white/50"> — {reason}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
