"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, MessageSquare, BookOpen, Search, GitBranch, Lightbulb, Telescope, FileText, ArrowRight } from "lucide-react";
import type { Paper } from "@/lib/papers";

const tools = [
  { label: "Paper Vault", icon: Upload, href: "/vault", desc: "Upload & manage papers", color: "text-[#4f8ef7]", bg: "bg-[#4f8ef7]/10" },
  { label: "Q&A", icon: MessageSquare, href: "/qa", desc: "Ask across your library", color: "text-[#a78bfa]", bg: "bg-[#a78bfa]/10" },
  { label: "Lit Review", icon: BookOpen, href: "/review", desc: "Generate literature reviews", color: "text-[#34d399]", bg: "bg-[#34d399]/10" },
  { label: "Gap Analyzer", icon: Search, href: "/gaps", desc: "Find research gaps", color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10" },
  { label: "Compare", icon: GitBranch, href: "/compare", desc: "Compare paper matrices", color: "text-[#06b6d4]", bg: "bg-[#06b6d4]/10" },
  { label: "Hypotheses", icon: Lightbulb, href: "/hypothesis", desc: "Forge new hypotheses", color: "text-[#f472b6]", bg: "bg-[#f472b6]/10" },
  { label: "Discover", icon: Telescope, href: "/discover", desc: "Search ArXiv & Scholar", color: "text-[#34d399]", bg: "bg-[#34d399]/10" },
];

export default function DashboardPage() {
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("researchmind_papers");
      if (stored) setPapers(JSON.parse(stored));
    } catch {}
  }, []);

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-white/40 text-sm">
          {papers.length === 0 ? "Upload papers to get started." : `${papers.length} paper${papers.length !== 1 ? "s" : ""} in your vault.`}
        </p>
      </motion.div>

      {papers.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card rounded-2xl p-8 mb-8 text-center border-dashed">
          <FileText className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-4">No papers yet. Upload your first research paper to unlock all features.</p>
          <Link href="/vault" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            <Upload className="w-4 h-4" /> Upload Papers
          </Link>
        </motion.div>
      )}

      {papers.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Papers", value: papers.length, color: "text-[#4f8ef7]" },
            { label: "Authors", value: [...new Set(papers.map(p => p.authors).filter(Boolean))].length, color: "text-[#a78bfa]" },
            { label: "Years", value: [...new Set(papers.map(p => p.year).filter(a => a !== "Unknown"))].length, color: "text-[#34d399]" },
            { label: "Chunks", value: papers.reduce((acc, p) => acc + (p.chunks?.length || 0), 0), color: "text-[#f59e0b]" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }} className="card rounded-2xl p-5">
              <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div key={t.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }}>
              <Link href={t.href} className="card rounded-2xl p-5 flex items-start gap-3 hover:border-white/15 transition-colors group block">
                <div className={`w-9 h-9 rounded-xl ${t.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${t.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm mb-0.5">{t.label}</div>
                  <div className="text-xs text-white/40">{t.desc}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0 mt-0.5" />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {papers.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
          <h2 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">Recent Papers</h2>
          <div className="space-y-2">
            {papers.slice(-5).reverse().map((p) => (
              <div key={p.id} className="card rounded-xl px-4 py-3 flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#4f8ef7] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{p.title}</div>
                  <div className="text-xs text-white/40">{p.authors} · {p.year}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
