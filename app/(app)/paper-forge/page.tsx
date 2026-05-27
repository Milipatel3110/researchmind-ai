"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, ChevronRight, ChevronLeft, Loader2, Download, Copy, Check, Upload, FileText, Sparkles } from "lucide-react";
import { usePapers } from "@/lib/usePapers";
import Link from "next/link";

// ─── Section options ─────────────────────────────────────────────────
const ALL_SECTIONS = [
  { id: "abstract",     label: "Abstract",                    recommended: true },
  { id: "introduction", label: "I. Introduction",              recommended: true },
  { id: "background",   label: "II. Background & Related Work",recommended: true },
  { id: "methodology",  label: "III. Methodology",             recommended: true },
  { id: "comparison",   label: "IV. Comparative Analysis",     recommended: true },
  { id: "results",      label: "V. Results & Discussion",      recommended: true },
  { id: "limitations",  label: "VI. Limitations",              recommended: false },
  { id: "future",       label: "VII. Future Research Directions", recommended: true },
  { id: "conclusion",   label: "VIII. Conclusion",             recommended: true },
];

const LENGTH_OPTIONS = [
  { value: "short",  label: "Short",  pages: "~4 pages", words: "~1,400 words" },
  { value: "medium", label: "Medium", pages: "~6 pages", words: "~2,200 words" },
  { value: "long",   label: "Long",   pages: "~8 pages", words: "~3,000 words" },
];

// ─── Parse AI markdown output into structured sections ───────────────
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

    if (/^#{1,3}\s*ABSTRACT/i.test(trimmed)) {
      inAbstract = true; inRefs = false; current = null; continue;
    }
    if (/^#{1,3}\s*REFERENCES?/i.test(trimmed)) {
      inRefs = true; inAbstract = false;
      if (current) { body.push(current); current = null; }
      continue;
    }
    if (/^#{1,3}\s+.+/.test(trimmed) && !inRefs) {
      if (current) body.push(current);
      inAbstract = false;
      const heading = trimmed.replace(/^#{1,3}\s+/, "").replace(/\*\*/g, "");
      current = { heading, content: "" };
      continue;
    }

    if (inRefs) {
      const refLine = trimmed.replace(/^\[?\d+\]?\s*/, "").replace(/^\*+\[?\d+\]?\*+\s*/, "");
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

// ─── Screen preview (dark app context) ───────────────────────────────
function IEEEPreview({ content, title, authors, affiliation, keywords }: {
  content: string; title: string; authors: string; affiliation?: string; keywords?: string;
}) {
  const s = parseIEEE(content);
  return (
    <div className="bg-white text-black p-10 max-w-[720px] mx-auto font-serif text-[11px] leading-relaxed">
      <div className="text-center mb-5">
        <div className="text-[18px] font-bold leading-tight mb-2">{title}</div>
        <div className="text-[12px] italic mb-1">{authors}</div>
        {affiliation && <div className="text-[10px] text-gray-500">{affiliation}</div>}
      </div>
      {s.abstract && (
        <div className="border border-gray-400 px-4 py-3 mb-5 text-[10px] leading-relaxed">
          <span className="font-bold italic">Abstract— </span>{s.abstract}
          {keywords && <div className="mt-2"><span className="font-bold italic">Index Terms— </span>{keywords}</div>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2 grid grid-cols-2 gap-5">
          {s.body.map((sec, i) => (
            <div key={i} className="mb-3">
              <div className="font-bold text-[10px] uppercase tracking-wide mb-1 border-b border-gray-200 pb-0.5">{sec.heading}</div>
              <div className="whitespace-pre-wrap text-[10px] text-justify">{sec.content}</div>
            </div>
          ))}
        </div>
        {s.references.length > 0 && (
          <div className="col-span-2">
            <div className="font-bold text-[10px] uppercase tracking-wide mb-1 border-b border-gray-200 pb-0.5">References</div>
            {s.references.map((ref, i) => (
              <div key={i} className="flex gap-1 text-[9px] mb-0.5">
                <span className="flex-shrink-0 font-medium">[{i + 1}]</span>
                <span>{ref}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Generate a complete IEEE HTML document for printing ─────────────
function generatePrintHTML(
  content: string, title: string, authors: string,
  affiliation?: string, keywords?: string
): string {
  const s = parseIEEE(content);
  const esc = (t: string) => t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

  const bodyHtml = s.body.map(sec => `
    <div class="section">
      <div class="sec-heading">${esc(sec.heading)}</div>
      <div class="sec-body">${esc(sec.content).replace(/\n\n/g,"</p><p>").replace(/\n/g," ")}</div>
    </div>`).join("");

  const refsHtml = s.references.length > 0 ? `
    <div class="section refs">
      <div class="sec-heading">References</div>
      ${s.references.map((r,i) => `<div class="ref"><span class="ref-num">[${i+1}]</span><span>${esc(r)}</span></div>`).join("")}
    </div>` : "";

  const abstractHtml = s.abstract ? `
    <div class="abstract">
      <strong><em>Abstract—</em></strong>${esc(s.abstract)}
      ${keywords ? `<div class="keywords"><strong><em>Index Terms—</em></strong>${esc(keywords)}</div>` : ""}
    </div>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<style>
  @page { size: letter; margin: 0.75in; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 10pt;
    line-height: 1.45;
    color: #000;
    background: #fff;
  }
  .header { text-align: center; margin-bottom: 14pt; }
  .paper-title { font-size: 18pt; font-weight: bold; line-height: 1.2; margin-bottom: 10pt; }
  .paper-authors { font-size: 11pt; font-style: italic; margin-bottom: 4pt; }
  .paper-affil { font-size: 9pt; color: #333; }
  .abstract {
    border: 0.75pt solid #000;
    padding: 7pt 10pt;
    margin-bottom: 14pt;
    font-size: 9pt;
    line-height: 1.4;
  }
  .abstract .keywords { margin-top: 5pt; }
  .divider {
    border: none;
    border-top: 0.75pt solid #000;
    margin-bottom: 10pt;
  }
  .columns {
    column-count: 2;
    column-gap: 18pt;
    column-rule: 0.5pt solid #bbb;
  }
  .section { break-inside: avoid-column; margin-bottom: 10pt; }
  .sec-heading {
    font-weight: bold;
    font-size: 10pt;
    text-transform: uppercase;
    letter-spacing: 0.3pt;
    margin-bottom: 3pt;
  }
  .sec-body {
    font-size: 10pt;
    text-align: justify;
    hyphens: auto;
    white-space: pre-wrap;
  }
  .refs .ref {
    display: flex;
    gap: 4pt;
    font-size: 9pt;
    margin-bottom: 3pt;
    text-align: left;
  }
  .refs .ref-num { flex-shrink: 0; font-weight: bold; }
  @media print {
    body { print-color-adjust: exact; }
    .section { break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="header">
  <div class="paper-title">${esc(title)}</div>
  <div class="paper-authors">${esc(authors)}</div>
  ${affiliation ? `<div class="paper-affil">${esc(affiliation)}</div>` : ""}
</div>
${abstractHtml}
<hr class="divider">
<div class="columns">
${bodyHtml}
${refsHtml}
</div>
<script>
  window.addEventListener("load", function() {
    setTimeout(function() { window.print(); }, 400);
  });
</script>
</body>
</html>`;
}

// ─── LaTeX export ─────────────────────────────────────────────────────
function toLatex(content: string, title: string, authors: string, affiliation: string, keywords: string): string {
  const s = parseIEEE(content);
  const esc = (t: string) => t.replace(/[&%$#_{}~^\\]/g, (c) => `\\${c}`);
  const body = s.body.map(sec => {
    const heading = sec.heading.replace(/^[IVX]+\.\s*/i,"").replace(/^[0-9]+\.\s*/,"");
    return `\\section{${esc(heading)}}\n${esc(sec.content)}\n`;
  }).join("\n");
  const refs = s.references.map((r,i) => `\\bibitem{ref${i+1}} ${esc(r)}`).join("\n");
  return `\\documentclass[conference]{IEEEtran}
\\IEEEoverridecommandlockouts
\\usepackage{cite,amsmath,amssymb,graphicx,hyperref}
\\begin{document}
\\title{${esc(title)}}
\\author{\\IEEEauthorblockN{${esc(authors)}}${affiliation ? `\n\\IEEEauthorblockA{${esc(affiliation)}}` : ""}}
\\maketitle
${s.abstract ? `\\begin{abstract}\n${esc(s.abstract)}\n\\end{abstract}` : ""}
${keywords ? `\\begin{IEEEkeywords}\n${esc(keywords)}\n\\end{IEEEkeywords}` : ""}
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
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= current ? "bg-[#4f8ef7] text-white" : "bg-white/10 text-white/30"}`}>{i + 1}</div>
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

  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [keywords, setKeywords] = useState("");
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>(
    ALL_SECTIONS.filter(s => s.recommended).map(s => s.id)
  );
  const [targetLength, setTargetLength] = useState<"short"|"medium"|"long">("medium");
  const [maxCitations, setMaxCitations] = useState(15);

  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [latexCopied, setLatexCopied] = useState(false);

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
        body: JSON.stringify({ papers: selectedPapers, config: { title, authors, affiliation, keywords, sections: selectedSections, targetLength, maxCitations } }),
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

  // Opens a new tab with a complete IEEE HTML doc — browser prints it as PDF
  const downloadPDF = () => {
    const html = generatePrintHTML(output, title, authors, affiliation, keywords);
    const win = window.open("", "_blank");
    if (!win) { alert("Please allow pop-ups for this site, then click Download PDF again."); return; }
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  const copyLatex = async () => {
    await navigator.clipboard.writeText(toLatex(output, title, authors, affiliation, keywords));
    setLatexCopied(true); setTimeout(() => setLatexCopied(false), 2000);
  };

  const copyText = async () => {
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
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4f8ef7] to-[#a78bfa] flex items-center justify-center">
            <ScrollText className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold">IEEE Paper Forge</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#34d399]/15 border border-[#34d399]/25 text-[#34d399]">New</span>
        </div>
        <p className="text-white/40 text-sm ml-11">Upload papers → configure sections → get a ready IEEE review paper PDF.</p>
      </motion.div>

      <Steps current={step} />

      <AnimatePresence mode="wait">

        {/* ── Step 0: Configure ─────────────────────────────────── */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid lg:grid-cols-[1fr,340px] gap-6">

              <div className="space-y-4">
                {/* Metadata */}
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
                    <label className="text-xs text-white/50 block mb-1.5">IEEE Index Terms</label>
                    <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="deep learning, anomaly detection, survey" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#4f8ef7]/50" />
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
                      <label key={p.id} className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/3 transition-colors">
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

              {/* Right column */}
              <div className="space-y-4">
                <div className="card rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#34d399]" /> Sections</h2>
                  <div className="space-y-1.5">
                    {ALL_SECTIONS.map(s => (
                      <label key={s.id} className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-white/3 transition-colors">
                        <input type="checkbox" checked={selectedSections.includes(s.id)} onChange={() => toggleSection(s.id)} className="accent-[#34d399]" />
                        <span className={`text-sm ${selectedSections.includes(s.id) ? "text-white" : "text-white/40"}`}>{s.label}</span>
                        {s.recommended && <span className="text-[10px] text-[#34d399]/60 ml-auto">rec.</span>}
                      </label>
                    ))}
                    <label className="flex items-center gap-2.5 p-1.5 opacity-50 cursor-not-allowed">
                      <input type="checkbox" checked disabled className="accent-[#4f8ef7]" />
                      <span className="text-sm text-white/50">References</span>
                      <span className="text-[10px] text-white/30 ml-auto">always</span>
                    </label>
                  </div>
                </div>

                <div className="card rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-white/70 mb-3">Target Length</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {LENGTH_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => setTargetLength(opt.value as "short"|"medium"|"long")}
                        className={`py-2.5 px-2 rounded-xl border text-center transition-all ${targetLength === opt.value ? "bg-[#4f8ef7]/15 border-[#4f8ef7]/40 text-[#4f8ef7]" : "border-white/10 text-white/40 hover:text-white/70"}`}>
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div className="text-[10px] mt-0.5 opacity-70">{opt.pages}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-white/70">Max Citations</h2>
                    <span className="text-sm font-bold text-[#4f8ef7]">{maxCitations}</span>
                  </div>
                  <input type="range" min={selectedPapers.length || 5} max={40} value={maxCitations} onChange={e => setMaxCitations(Number(e.target.value))} className="w-full accent-[#4f8ef7]" />
                  <div className="flex justify-between text-[10px] text-white/30 mt-1"><span>5 min</span><span>40 max</span></div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs">{error}</div>}

                <button onClick={generate} disabled={!canGenerate}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] via-[#a78bfa] to-[#34d399] text-white font-semibold hover:opacity-90 disabled:opacity-30 transition-opacity flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> Generate IEEE Paper
                </button>
                {!canGenerate && (
                  <p className="text-xs text-white/30 text-center">
                    {!title.trim() ? "Enter a title" : !authors.trim() ? "Enter authors" : !selectedPapers.length ? "Select ≥1 paper" : "Select ≥2 sections"}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Step 1: Generating ────────────────────────────────── */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-5">
              <Loader2 className="w-5 h-5 animate-spin text-[#4f8ef7]" />
              <span className="text-white font-medium">Writing your IEEE paper…</span>
              <span className="text-white/40 text-sm ml-auto">{output.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <div className="bg-black/30 rounded-xl p-4 max-h-96 overflow-y-auto font-mono text-xs text-white/60 whitespace-pre-wrap leading-relaxed">
              {output || <span className="animate-pulse text-white/30">Generating…</span>}
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Preview + Download ────────────────────────── */}
        {step === 2 && output && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            {/* Action bar */}
            <div className="card rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{title}</p>
                <p className="text-xs text-white/40">{output.split(/\s+/).filter(Boolean).length} words · {selectedPapers.length} source{selectedPapers.length!==1?"s":""} · IEEE format</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setStep(0)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={copyText} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                  {copied ? <><Check className="w-3.5 h-3.5 text-[#34d399]" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy Text</>}
                </button>
                <button onClick={copyLatex} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#a78bfa]/30 bg-[#a78bfa]/10 text-xs text-[#a78bfa] hover:opacity-90 transition-opacity">
                  {latexCopied ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><FileText className="w-3.5 h-3.5" />Copy LaTeX</>}
                </button>
                <button onClick={downloadPDF} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white text-xs font-semibold hover:opacity-90 transition-opacity">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-white/5 border-b border-white/5 px-4 py-2 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" /><div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                <span className="text-xs text-white/30 ml-2">IEEE Preview</span>
                <span className="text-xs text-white/20 ml-auto">Two-column layout renders when printed</span>
              </div>
              <div className="overflow-y-auto max-h-[72vh]">
                <IEEEPreview content={output} title={title} authors={authors} affiliation={affiliation} keywords={keywords} />
              </div>
            </div>

            <p className="text-xs text-white/30 text-center mt-3">
              <strong className="text-white/50">Download PDF</strong> opens a new tab → print dialog auto-appears → choose <em>Save as PDF</em> → set paper size to <em>Letter</em>.
              &nbsp;Pop-ups must be allowed for this site.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
