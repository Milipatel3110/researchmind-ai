"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload, MessageSquare, BookOpen, Search, GitBranch,
  Lightbulb, Telescope, FileText, ArrowRight, ScrollText, Sparkles
} from "lucide-react";
import type { Paper } from "@/lib/papers";

const tools = [
  { label: "Paper Vault",      icon: Upload,        href: "/vault",      desc: "Upload & manage papers",    color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  { label: "Q&A",              icon: MessageSquare, href: "/qa",         desc: "Ask across your library",   color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
  { label: "Lit Review",       icon: BookOpen,      href: "/review",     desc: "Generate lit reviews",      color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  { label: "Gap Analyzer",     icon: Search,        href: "/gaps",       desc: "Find research gaps",        color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  { label: "Compare",          icon: GitBranch,     href: "/compare",    desc: "Compare paper matrices",    color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
  { label: "Hypotheses",       icon: Lightbulb,     href: "/hypothesis", desc: "Forge new hypotheses",      color: "#f472b6", bg: "rgba(244,114,182,0.1)" },
  { label: "IEEE Paper Forge", icon: ScrollText,    href: "/paper-forge",desc: "Generate IEEE papers",      color: "#a78bfa", bg: "rgba(167,139,250,0.1)", badge: "New" },
  { label: "Discover",         icon: Telescope,     href: "/discover",   desc: "Search ArXiv & Scholar",    color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
];

const statColors = ["#a78bfa", "#06b6d4", "#34d399", "#f59e0b"];

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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <p className="text-white/35 text-sm ml-12">
          {papers.length === 0
            ? "Upload papers to unlock the full research workflow."
            : `${papers.length} paper${papers.length !== 1 ? "s" : ""} in your vault · ready to analyze`}
        </p>
      </motion.div>

      {/* Empty state */}
      {papers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl p-10 mb-8 text-center relative overflow-hidden"
          style={{
            background: "rgba(13,14,35,0.8)",
            border: "1px dashed rgba(139,92,246,0.25)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.06), transparent 60%)" }}
          />
          <FileText className="w-10 h-10 mx-auto mb-4" style={{ color: "rgba(167,139,250,0.4)" }} />
          <p className="text-white/45 mb-6 max-w-sm mx-auto leading-relaxed">
            No papers yet. Upload your first research paper to unlock all 8 AI features.
          </p>
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
          >
            <Upload className="w-4 h-4" /> Upload Papers
          </Link>
        </motion.div>
      )}

      {/* Stats */}
      {papers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Papers",  value: papers.length },
            { label: "Authors", value: [...new Set(papers.map(p => p.authors).filter(Boolean))].length },
            { label: "Years",   value: [...new Set(papers.map(p => p.year).filter(a => a !== "Unknown"))].length },
            { label: "Chunks",  value: papers.reduce((acc, p) => acc + (p.chunks?.length || 0), 0) },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12 + i * 0.05 }}
              className="card rounded-2xl p-5"
            >
              <div className="text-2xl font-bold mb-1" style={{ color: statColors[i] }}>{s.value}</div>
              <div className="text-xs text-white/35 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tools grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <h2 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tools.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + i * 0.04 }}
              >
                <Link
                  href={t.href}
                  className="card rounded-2xl p-4 flex items-center gap-3 hover:border-white/12 transition-all group block"
                  style={{ transitionDuration: "180ms" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                    style={{ background: t.bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: t.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-medium text-white text-sm">{t.label}</span>
                      {t.badge && (
                        <span
                          className="text-[8px] px-1 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}
                        >
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/35">{t.desc}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/45 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent papers */}
      {papers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-8"
        >
          <h2 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4">Recent Papers</h2>
          <div className="space-y-2">
            {papers.slice(-5).reverse().map((p) => (
              <div key={p.id} className="card rounded-xl px-4 py-3 flex items-center gap-3">
                <FileText className="w-4 h-4 flex-shrink-0" style={{ color: "#a78bfa" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{p.title}</div>
                  <div className="text-xs text-white/35">{p.authors} · {p.year}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
