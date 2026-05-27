"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Lightbulb, Loader2, Copy, Check, Upload } from "lucide-react";
import { usePapers, streamResponse } from "@/lib/usePapers";
import Link from "next/link";

export default function HypothesisPage() {
  const { papers } = usePapers();
  const [focus, setFocus] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!papers.length) return;
    setLoading(true); setOutput(""); setError("");
    try {
      await streamResponse("/api/hypothesis", { papers, focus }, setOutput);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (papers.length === 0) return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Lightbulb className="w-10 h-10 text-white/20 mb-4" />
      <p className="text-white/50 mb-4">Upload papers first to forge hypotheses.</p>
      <Link href="/vault" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white text-sm font-semibold hover:opacity-90">
        <Upload className="w-4 h-4" /> Go to Paper Vault
      </Link>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#f472b6]/15 border border-[#f472b6]/25 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-[#f472b6]" />
          </div>
          <h1 className="text-2xl font-bold">Hypothesis Forge</h1>
        </div>
        <p className="text-white/40 text-sm ml-11">AI generates novel, testable research hypotheses from your papers.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card rounded-2xl p-5 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {papers.map(p => (
            <span key={p.id} className="text-xs px-2.5 py-1 rounded-lg bg-[#f472b6]/10 border border-[#f472b6]/20 text-[#f472b6]">
              {p.title.substring(0, 35)}{p.title.length > 35 ? "…" : ""}
            </span>
          ))}
        </div>
        <div className="mb-4">
          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1.5">Research Focus (optional)</label>
          <input value={focus} onChange={e => setFocus(e.target.value)} placeholder="e.g. cross-domain generalization, robustness under noise" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#f472b6]/50" />
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm mb-3">{error}</div>}
        <button onClick={generate} disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#a78bfa] text-white font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Forging hypotheses…</> : <><Lightbulb className="w-4 h-4" /> Forge Hypotheses</>}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card rounded-2xl p-6 min-h-[400px]">
        {!output && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <Lightbulb className="w-8 h-8 text-white/15 mb-3" />
            <p className="text-white/30 text-sm">5 novel hypotheses + quick-wins + a moonshot idea will appear here.</p>
          </div>
        )}
        {loading && !output && (
          <div className="flex items-center gap-3 justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-[#f472b6]" />
            <span className="text-white/50 text-sm">Synthesizing literature and generating novel hypotheses…</span>
          </div>
        )}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/40">Based on {papers.length} paper{papers.length !== 1 ? "s" : ""}</span>
              <button onClick={copy} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg">
                {copied ? <><Check className="w-3.5 h-3.5 text-[#34d399]" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            </div>
            <div className="prose text-sm"><ReactMarkdown>{output}</ReactMarkdown></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
