"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, ChevronRight, ChevronLeft, Loader2, Download, Copy, Check, Upload, FileText, Sparkles } from "lucide-react";
import { usePapers } from "@/lib/usePapers";
import Link from "next/link";

// ─── Section options ────────────────────────────────────────────────
const ALL_SECTIONS = [
  { id: "abstract",     label: "Abstract",               recommended: true },
  { id: "introduction", label: "I. Introduction",         recommended: true },
  { id: "background",   label: "II. Background & Related Work", recommended: true },
  { id: "methodology",  label: "III. Methodology",         recommended: true },
  { id: "comparison",   label: "IV. Comparative Analysis", recommended: true },
  { id: "results",      label: "V. Results & Discussion",  recommended: true },
  { id: "limitations",  label: "VI. Limitations",          recommended: false },
  { id: "future",       label: "VII. Future Research Directions", recommended: true },
  { id: "conclusion",   label: "VIII. Conclusion",         recommended: true },
];

const LENGTH_OPTIONS = [
  { value: "short",  label: "Short",  pages: "~4 pages",  words: "~1,400 words" },
  { value: "medium", label: "Medium", pages: "~6 pages",  words: "~2,200 words" },
  { value: "long",   label: "Long",   pages: "~8 pages",  words: "~3,000 words" },
];

// ─── IEEE paper renderer (screen + print) ───────────────────────────
function IEEEPaper({ content, title, authors, affiliation, keywords }: {
  content: string; title: string; authors: string; affiliation?: string; keywords?: string;
}) {
  const sections = parseIEEE(content);

  return (
    <div id="ieee-paper" className="ieee-paper font-serif text-black bg-white p-8 max-w-[780px] mx-auto">
      {/* Title block */}
      <div className="text-center mb-4">
        <h1 className="text-[20px] font-bold leading-tight mb-3">{title}</h1>
        <p className="text-[13px] italic">{authors}</p>
        {affiliation && <p className="text-[11px] text-gray-600 mt-1">{affiliation}</p>}
      </div>

      {/* Abstract (single column) */}
      {sections.abstract && (
        <div className="border border-gray-400 px-4 py-3 mb-4 text-[11px] leading-relaxed">
          <span className="font-bold italic">Abstract—</span>
          <span>{sections.abstract}</span>
          {keywords && <div className="mt-2"><span className="font-bold italic">Index Terms—</span><span>{keywords}</span></div>}
        </div>
      )}

      {/* Body sections (two-column via CSS) */}
      <div className="ieee-columns text-[11px] leading-relaxed">
        {sections.body.map((sec, i) => (
          <div key={i} className="mb-3 break-inside-avoid-column">
            <h2 className="font-bold text-[11px] uppercase tracking-wide mb-1">{sec.heading}</h2>
            <div className="whitespace-pre-wrap">{sec.content}</div>
          </div>
        ))}

        {/* References */}
        {sections.references.length > 0 && (
          <div className="mt-2">
            <h2 className="font-bold text-[11px] uppercase tracking-wide mb-1">REFERENCES</h2>
            <ol className="list-none space-y-0.5">
              {sections.references.map((ref, i) => (
                <li key={i} className="flex gap-1.5 text-[10px]">
                  <span className="flex-shrink-0">[{i + 1}]</span>
                  <span>{ref}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Parse the markdown-like AI output into structured sections ──────
function parseIEEE(text: string) {
  const lines = text.split("\n");
  let abstract = "";
  const body: { heading: string; content: string }[] = [];
  const references: string[] = [];
  let current: { heading: string; content: string } | null = null;
  let inAbstract = false;
  let inRefs = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { if (current) current.content += "\n"; continue; }

    if (/^#{1,3}\s*ABSTRACT/i.test(trimmed)) { inAbstract = true; inRefs = false; current = null; continue; }
    if (/^#{1,3}\s*REFERENCES?/i.test(trimmed)) { inRefs = true; inAbstract = false; if (current) { body.push(current); current = null; } continue; }
    if (/^#{1,3}\s+([IVX]+\.|[0-9]+\.)?\s*.+/.test(trimmed) && !inRefs) {
      if (current) body.push(current);
      inAbstract = false;
      const heading = trimmed.replace(/^#{1,3}\s+/, "").replace(/\*\*/g, "");
      current = { heading, content: "" };
      continue;
    }

    if (inRefs) {
      const refLine = trimmed.replace(/^\[?\d+\]?\s*/, "").replace(/^\*\*?\[?\d+\]?\*\*?\s*/, "");
      if (refLine) references.push(refLine);
    } else if (inAbstract) {
      abstract += (abstract ? " " : "") + trimmed.replace(/\*\*/g, "");
    } else if (current) {
      current.content += (current.content ? "\n" : "") + trimmed.replace(/\*\*/g, "");
    }
  }
  if (current) body.push(current);

  return { abstract, body, references };
}

// ─── LaTeX export ────────────────────────────────────────────────────
function toLatex(content: string, title: string, authors: string, affiliation: string, keywords: string): string {
  const sections = parseIEEE(content);
  const escape = (s: string) => s.replace(/[&%$#_{}~^\\]/g, (c) => `\\${c}`);

  const body = sections.body.map(s => {
    const heading = s.heading.replace(/^[IVX]+\.\s*/i, "").replace(/^[0-9]+\.\s*/, "");
    return `\\section{${escape(heading)}}\n${escape(s.content)}\n`;
  }).join("\n");

  const refs = sections.references.map((r, i) => `\\bibitem{ref${i + 1}} ${escape(r)}`).join("\n");

  return `\\documentclass[conference]{IEEEtran}
\\IEEEoverridecommandlockouts
\\usepackage{cite}
\\usepackage{amsmath,amssymb}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\begin{document}
\\title{${escape(title)}}
\\author{\\IEEEauthorblockN{${escape(authors)}}${affiliation ? `\n\\IEEEauthorblockA{${escape(affiliation)}}` : ""}}
\\maketitle

\\begin{abstract}
${escape(sections.abstract)}
\\end{abstract}
${keywords ? `\\begin{IEEEkeywords}\n${escape(keywords)}\n\\end{IEEEkeywords}` : ""}

${body}

\\begin{thebibliography}{99}
${refs}
\\end{thebibliography}

\\end{document}`;
}

// ─── Step indicator ───────────────────────────────────────────────────
function Steps({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {["Configure", "Generate", "Download"].map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= current ? "bg-[#4f8ef7] text-white" : "bg-white/10 text-white/30"}`}>
            {i + 1}
          </div>
          <span className={`text-sm ${i === current ? "text-white font-medium" : "text-white/40"}`}>{label}</span>
          {i < 2 && <ChevronRight className="w-3.5 h-3.5 text-white/20" />}
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────
export default function PaperForgePage() {
  const { papers } = usePapers();
  const [step, setStep] = useState(0);

  // Config state
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [keywords, setKeywords] = useState("");
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>(
    ALL_SECTIONS.filter(s => s.recommended).map(s => s.id)
  );
  const [targetLength, setTargetLength] = useState<"short" | "medium" | "long">("medium");
  const [maxCitations, setMaxCitations] = useState(15);

  // Output state
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [latexCopied, setLatexCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const selectedPapers = papers.filter(p => selectedPaperIds.includes(p.id));
  const toggleSection = (id: string) => setSelectedSections(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const togglePaper = (id: string) => setSelectedPaperIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const canGenerate = title.trim() && authors.trim() && selectedPapers.length > 0 && selectedSections.length >= 2;

  const generate = async () => {
    if (!canGenerate) return;
    setGenerating(true); setOutput(""); setError(""); setStep(1);
    try {
      const res = await fetch("/api/paper-forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          papers: selectedPapers,
          config: { title, authors, affiliation, keywords, sections: selectedSections, targetLength, maxCitations },
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Generation failed"); }
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setOutput(result);
      }
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
      setStep(0);
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = () => {
    const printStyle = document.createElement("style");
    printStyle.id = "ieee-print-style";
    printStyle.textContent = `
      @media print {
        @page { size: letter; margin: 0.75in; }
        body > * { display: none !important; }
        #ieee-print-root { display: block !important; }
        .ieee-paper { font-family: 'Times New Roman', Times, serif !important; }
        .ieee-columns { column-count: 2; column-gap: 0.25in; }
        h1, h2, h3 { page-break-after: avoid; }
        .break-inside-avoid-column { break-inside: avoid; }
      }
    `;
    document.head.appendChild(printStyle);

    const root = document.getElementById("ieee-print-root");
    if (root) root.style.display = "block";
    window.print();
    setTimeout(() => {
      document.head.removeChild(printStyle);
      if (root) root.style.display = "none";
    }, 1000);
  };

  const copyLatex = async () => {
    const latex = toLatex(output, title, authors, affiliation, keywords);
    await navigator.clipboard.writeText(latex);
    setLatexCopied(true); setTimeout(() => setLatexCopied(false), 2000);
  };

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (papers.length === 0) return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <ScrollText className="w-10 h-10 text-white/20 mb-4" />
      <p className="text-white/50 mb-4">Upload papers first to generate a review paper.</p>
      <Link href="/vault" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white text-sm font-semibold hover:opacity-90">
        <Upload className="w-4 h-4" /> Go to Paper Vault
      </Link>
    </div>
  );

  return (
    <>
      {/* Hidden print root */}
      <div id="ieee-print-root" style={{ display: "none" }}>
        {output && <IEEEPaper content={output} title={title} authors={authors} affiliation={affiliation} keywords={keywords} />}
      </div>

      <div className="p-6 sm:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4f8ef7] to-[#a78bfa] flex items-center justify-center">
              <ScrollText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold">IEEE Paper Forge</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#34d399]/15 border border-[#34d399]/25 text-[#34d399]">New</span>
          </div>
          <p className="text-white/40 text-sm ml-11">Select papers → configure sections → generate a ready-to-submit IEEE review paper PDF.</p>
        </motion.div>

        <Steps current={step} />

        {/* Step 0: Configure */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="grid lg:grid-cols-[1fr,340px] gap-6">

                {/* Left: Papers + Metadata */}
                <div className="space-y-4">
                  {/* Paper metadata */}
                  <div className="card rounded-2xl p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-white/70 flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-[#4f8ef7]" /> Paper Metadata</h2>
                    <div>
                      <label className="text-xs text-white/50 block mb-1.5">Paper Title *</label>
                      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="A Survey on Deep Learning Methods for Anomaly Detection" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#4f8ef7]/50" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-white/50 block mb-1.5">Author(s) *</label>
                        <input value={authors} onChange={e => setAuthors(e.target.value)} placeholder="Mili Patel, John Smith" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#4f8ef7]/50" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 block mb-1.5">Affiliation</label>
                        <input value={affiliation} onChange={e => setAffiliation(e.target.value)} placeholder="University of North Texas" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#4f8ef7]/50" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 block mb-1.5">Keywords (IEEE index terms)</label>
                      <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="deep learning, anomaly detection, survey, neural networks" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#4f8ef7]/50" />
                    </div>
                  </div>

                  {/* Paper selection */}
                  <div className="card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-white/70 flex items-center gap-2"><Upload className="w-3.5 h-3.5 text-[#a78bfa]" /> Source Papers ({selectedPaperIds.length}/{papers.length})</h2>
                      <button onClick={() => setSelectedPaperIds(papers.map(p => p.id))} className="text-xs text-[#4f8ef7] hover:underline">Select All</button>
                    </div>
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {papers.map(p => (
                        <label key={p.id} className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/3 transition-colors">
                          <input type="checkbox" checked={selectedPaperIds.includes(p.id)} onChange={() => togglePaper(p.id)} className="mt-0.5 accent-[#4f8ef7] flex-shrink-0" />
                          <div>
                            <p className="text-sm text-white leading-snug">{p.title}</p>
                            <p className="text-xs text-white/35">{p.authors} · {p.year}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Sections + Length */}
                <div className="space-y-4">
                  {/* Section picker */}
                  <div className="card rounded-2xl p-5">
                    <h2 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#34d399]" /> Sections to Include</h2>
                    <div className="space-y-2">
                      {ALL_SECTIONS.map(s => (
                        <label key={s.id} className="flex items-center gap-2.5 cursor-pointer group p-1.5 rounded-lg hover:bg-white/3 transition-colors">
                          <input type="checkbox" checked={selectedSections.includes(s.id)} onChange={() => toggleSection(s.id)} className="accent-[#34d399]" />
                          <span className={`text-sm ${selectedSections.includes(s.id) ? "text-white" : "text-white/40"}`}>{s.label}</span>
                          {s.recommended && <span className="text-[10px] text-[#34d399]/60 ml-auto">recommended</span>}
                        </label>
                      ))}
                      <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-white/3 transition-colors opacity-60">
                        <input type="checkbox" checked disabled className="accent-[#4f8ef7]" />
                        <span className="text-sm text-white/50">References</span>
                        <span className="text-[10px] text-white/30 ml-auto">always</span>
                      </label>
                    </div>
                  </div>

                  {/* Length */}
                  <div className="card rounded-2xl p-5">
                    <h2 className="text-sm font-semibold text-white/70 mb-3">Target Length</h2>
                    <div className="grid grid-cols-3 gap-2">
                      {LENGTH_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => setTargetLength(opt.value as "short" | "medium" | "long")}
                          className={`py-2.5 px-2 rounded-xl border text-center transition-all ${targetLength === opt.value ? "bg-[#4f8ef7]/15 border-[#4f8ef7]/40 text-[#4f8ef7]" : "border-white/10 text-white/40 hover:text-white/70"}`}>
                          <div className="text-xs font-semibold">{opt.label}</div>
                          <div className="text-[10px] mt-0.5 opacity-70">{opt.pages}</div>
                          <div className="text-[10px] opacity-50">{opt.words}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Citations */}
                  <div className="card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-white/70">Max Citations</h2>
                      <span className="text-sm font-bold text-[#4f8ef7]">{maxCitations}</span>
                    </div>
                    <input type="range" min={selectedPapers.length || 5} max={40} value={maxCitations} onChange={e => setMaxCitations(Number(e.target.value))}
                      className="w-full accent-[#4f8ef7]" />
                    <div className="flex justify-between text-[10px] text-white/30 mt-1">
                      <span>{selectedPapers.length || 5} min</span><span>40 max</span>
                    </div>
                  </div>

                  {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs">{error}</div>}

                  <button onClick={generate} disabled={!canGenerate}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] via-[#a78bfa] to-[#34d399] text-white font-semibold hover:opacity-90 disabled:opacity-30 transition-opacity flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Generate IEEE Paper
                  </button>
                  {!canGenerate && (
                    <p className="text-xs text-white/30 text-center">
                      {!title.trim() ? "Enter a paper title" : !authors.trim() ? "Enter author name(s)" : !selectedPapers.length ? "Select at least 1 paper" : "Select at least 2 sections"}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Generating */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Loader2 className="w-5 h-5 animate-spin text-[#4f8ef7]" />
                <span className="text-white font-medium">Generating your IEEE paper…</span>
                <span className="text-white/40 text-sm ml-auto">{output.split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <div className="bg-black/30 rounded-xl p-4 max-h-96 overflow-y-auto font-mono text-xs text-white/60 whitespace-pre-wrap leading-relaxed">
                {output || <span className="animate-pulse text-white/30">Starting generation…</span>}
              </div>
            </motion.div>
          )}

          {/* Step 2: Preview + Download */}
          {step === 2 && output && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              {/* Action bar */}
              <div className="card rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="text-xs text-white/40">{output.split(/\s+/).filter(Boolean).length} words · {selectedPapers.length} source{selectedPapers.length !== 1 ? "s" : ""} · IEEE format</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setStep(0)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={copyMarkdown} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                    {copied ? <><Check className="w-3.5 h-3.5 text-[#34d399]" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Text</>}
                  </button>
                  <button onClick={copyLatex} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#a78bfa]/30 bg-[#a78bfa]/10 text-xs text-[#a78bfa] hover:opacity-90 transition-opacity">
                    {latexCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><FileText className="w-3.5 h-3.5" /> Copy LaTeX</>}
                  </button>
                  <button onClick={downloadPDF} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white text-xs font-semibold hover:opacity-90 transition-opacity">
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                </div>
              </div>

              {/* IEEE Preview */}
              <div ref={previewRef} className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="bg-white/5 border-b border-white/5 px-4 py-2 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                  <span className="text-xs text-white/30 ml-2">IEEE Paper Preview</span>
                  <span className="text-xs text-white/20 ml-auto">Looks different when printed — browser handles 2-column layout</span>
                </div>
                <div className="bg-white overflow-y-auto max-h-[75vh]">
                  <IEEEPaper content={output} title={title} authors={authors} affiliation={affiliation} keywords={keywords} />
                </div>
              </div>

              <p className="text-xs text-white/30 text-center mt-3">
                Click <strong className="text-white/50">Download PDF</strong> → your browser&apos;s print dialog opens → select <em>&quot;Save as PDF&quot;</em> → choose <em>Letter</em> size for proper IEEE format.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Print styles injected in <head> at runtime via downloadPDF() */}
      <style>{`
        .ieee-paper { font-family: 'Times New Roman', Times, serif; color: #000; }
        .ieee-columns { }
        @media print {
          @page { size: letter; margin: 0.75in; }
          .ieee-columns { column-count: 2; column-gap: 0.25in; column-rule: 0.5px solid #ccc; }
        }
      `}</style>
    </>
  );
}
