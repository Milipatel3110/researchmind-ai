"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Trash2, Loader2, CheckCircle, ChevronDown, ChevronUp, BookOpen, Users, Calendar, Lightbulb } from "lucide-react";
import { usePapers } from "@/lib/usePapers";
import type { Paper } from "@/lib/papers";

export default function VaultPage() {
  const { papers, addPaper, removePaper, clearAll } = usePapers();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type === "application/pdf" || f.name.endsWith(".txt"));
    if (!arr.length) { setUploadError("Only PDF and TXT files are supported."); return; }
    setUploading(true);
    setUploadError("");
    for (const file of arr) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Upload failed"); }
        const paper: Paper = await res.json();
        addPaper(paper);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Upload failed");
      }
    }
    setUploading(false);
  }, [addPaper]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-[#4f8ef7]/15 border border-[#4f8ef7]/25 flex items-center justify-center">
                <Upload className="w-4 h-4 text-[#4f8ef7]" />
              </div>
              <h1 className="text-2xl font-bold">Paper Vault</h1>
            </div>
            <p className="text-white/40 text-sm ml-11">Upload research papers — AI auto-extracts all metadata.</p>
          </div>
          {papers.length > 0 && (
            <button onClick={clearAll} className="text-xs text-red-400/60 hover:text-red-400 transition-colors border border-red-400/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg">
              Clear All
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`card rounded-2xl p-10 mb-6 text-center border-2 border-dashed transition-all cursor-pointer ${dragOver ? "border-[#4f8ef7]/60 bg-[#4f8ef7]/5" : "border-white/10 hover:border-white/20"}`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input id="file-input" type="file" accept=".pdf,.txt" multiple className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#4f8ef7] animate-spin" />
            <p className="text-white/60 text-sm">Processing paper… extracting metadata with AI</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#4f8ef7]" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">Drop PDFs here or click to browse</p>
              <p className="text-xs text-white/40">PDF and TXT supported · Multiple files allowed</p>
            </div>
          </div>
        )}
      </motion.div>

      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 text-red-400 text-sm">{uploadError}</div>
      )}

      {papers.length === 0 && !uploading && (
        <div className="text-center py-16 text-white/30">
          <BookOpen className="w-8 h-8 mx-auto mb-3" />
          <p>No papers yet. Upload your first paper above.</p>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {papers.map((paper, i) => (
            <motion.div key={paper.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }} className="card rounded-2xl overflow-hidden">
              <div className="px-5 py-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4f8ef7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-[#4f8ef7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm leading-snug mb-1">{paper.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{paper.authors || "Unknown"}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{paper.year || "Unknown"}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{paper.chunks?.length || 0} chunks</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-[#34d399]" />
                  <button onClick={() => setExpanded(expanded === paper.id ? null : paper.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                    {expanded === paper.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => removePaper(paper.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expanded === paper.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 overflow-hidden">
                    <div className="px-5 py-4 space-y-4">
                      {paper.abstract && (
                        <div>
                          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Abstract</div>
                          <p className="text-sm text-white/60 leading-relaxed">{paper.abstract}</p>
                        </div>
                      )}
                      {(paper.keyFindings?.length ?? 0) > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Lightbulb className="w-3 h-3 text-[#f59e0b]" />Key Findings</div>
                          <ul className="space-y-1.5">
                            {(paper.keyFindings ?? []).map((f, j) => (
                              <li key={j} className="flex gap-2 text-sm text-white/60">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f59e0b]/70 flex-shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {paper.methodology && (
                        <div>
                          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Methodology</div>
                          <p className="text-sm text-white/60">{paper.methodology}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
