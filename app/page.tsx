"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, Upload, MessageSquare, BookOpen, Search,
  GitBranch, Lightbulb, Telescope, ArrowRight, Sparkles,
  FileText, Zap, Globe, ScrollText, ChevronRight
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Paper Vault",
    desc: "Upload PDFs — AI auto-extracts title, authors, abstract, key findings, and methodology.",
    accent: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
  },
  {
    icon: MessageSquare,
    title: "Cross-Paper Q&A",
    desc: "Ask any question across your entire library. Get answers with citations to exact papers.",
    accent: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
  },
  {
    icon: BookOpen,
    title: "Literature Review",
    desc: "Select papers and style → get a structured lit review ready for your thesis or submission.",
    accent: "#34d399",
    bg: "rgba(52,211,153,0.12)",
  },
  {
    icon: Search,
    title: "Research Gap Analyzer",
    desc: "AI reads all your papers and surfaces unexplored areas and methodological limitations.",
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  {
    icon: GitBranch,
    title: "Paper Comparison",
    desc: "Side-by-side matrix: problem, methodology, dataset, results, and limitations at a glance.",
    accent: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
  },
  {
    icon: Lightbulb,
    title: "Hypothesis Forge",
    desc: "5 novel hypotheses + quick-wins + a moonshot idea generated from your paper library.",
    accent: "#f472b6",
    bg: "rgba(244,114,182,0.12)",
  },
  {
    icon: ScrollText,
    title: "IEEE Paper Forge",
    desc: "Generate a complete IEEE review paper — export as PDF (two-column) or IEEEtran LaTeX.",
    accent: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    badge: "New",
  },
  {
    icon: Telescope,
    title: "Discover Papers",
    desc: "Live search across Semantic Scholar and ArXiv with citation counts and open-access links.",
    accent: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
  },
];

const stats = [
  { value: "8", label: "AI Features", color: "#a78bfa" },
  { value: "131K", label: "Token Window", color: "#06b6d4" },
  { value: "Free", label: "Groq Tier", color: "#34d399" },
  { value: "Live", label: "ArXiv + Scholar", color: "#f59e0b" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#06071a" }}>

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl"
        style={{ background: "rgba(6,7,26,0.85)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6, #06b6d4)" }}
            >
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm gradient-text">ResearchMind AI</span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            Launch App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-28 px-6 overflow-hidden">
        {/* Mesh gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)" }}
          />
          <div
            className="absolute top-10 right-0 w-[450px] h-[450px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 65%)" }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)" }}
          />
        </div>
        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-25" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/4 text-xs text-white/55 mb-8"
          >
            <Sparkles className="w-3 h-3" style={{ color: "#f59e0b" }} />
            Built for researchers &nbsp;·&nbsp; 8 AI-powered tools &nbsp;·&nbsp; IEEE Paper Forge
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.07] tracking-tight mb-6"
          >
            The AI Research<br />
            <span className="gradient-text">Intelligence Platform</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="text-lg text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload papers. Ask questions across your library. Find research gaps.
            Generate lit reviews and IEEE-format papers — all powered by Groq&apos;s Llama 3.3 70B.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/vault"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #06b6d4 100%)",
                boxShadow: "0 8px 32px rgba(124,58,237,0.3)",
              }}
            >
              <Upload className="w-4 h-4" /> Upload Papers
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-white/75 font-semibold hover:bg-white/10 hover:text-white transition-all"
            >
              <Globe className="w-4 h-4" /> Explore ArXiv
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6 border-y border-white/5" style={{ background: "rgba(13,14,35,0.6)" }}>
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="text-center"
            >
              <div className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-white/35 font-medium tracking-wide">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-5"
            style={{ background: "radial-gradient(ellipse, #8b5cf6, transparent)" }}
          />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/3 text-xs text-white/45 mb-4">
              <Sparkles className="w-3 h-3 text-[#a78bfa]" /> Complete research workflow
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything a researcher needs
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              From paper ingestion to IEEE-format review paper generation — the full research intelligence workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="card rounded-2xl p-5 hover:border-white/12 transition-all group relative overflow-hidden"
                  style={{ transitionDuration: "200ms" }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                    style={{ boxShadow: `inset 0 0 40px ${f.accent}08` }}
                  />
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
                      style={{ background: f.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: f.accent }} />
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                      {f.badge && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}
                        >
                          {f.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-white/5" style={{ background: "rgba(13,14,35,0.5)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-white/40">From upload to insight in three steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px"
              style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3))" }}
            />

            {[
              {
                icon: FileText,
                step: "01",
                title: "Upload Papers",
                desc: "Drop your PDFs. AI extracts metadata, key findings, and methodology automatically.",
                color: "#a78bfa",
              },
              {
                icon: Zap,
                step: "02",
                title: "AI Analysis",
                desc: "Llama 3.3 70B with 128K context reads across all your papers simultaneously.",
                color: "#f59e0b",
              },
              {
                icon: Lightbulb,
                step: "03",
                title: "Discover Insights",
                desc: "Get lit reviews, gap analysis, hypotheses, and complete IEEE papers in seconds.",
                color: "#06b6d4",
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card rounded-2xl p-7 text-center relative"
                >
                  <div
                    className="text-5xl font-bold mb-5 opacity-15 tracking-tight"
                    style={{ color: s.color }}
                  >
                    {s.step}
                  </div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: s.color }} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* IEEE Paper Forge highlight */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.08) 100%)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15), transparent)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 w-48 h-48 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1), transparent)" }}
            />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                  style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}
                >
                  <ScrollText className="w-3 h-3" /> IEEE Paper Forge
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Generate a complete IEEE paper in minutes
                </h2>
                <p className="text-white/45 leading-relaxed mb-6">
                  Pick sections, set page length, choose citation count. AI writes the full paper — export as PDF
                  (two-column letter) or IEEEtran LaTeX for Overleaf.
                </p>
                <Link
                  href="/paper-forge"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity text-sm"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
                >
                  Try Paper Forge <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Abstract, Intro, Background, Methodology…", icon: "①" },
                  { label: "Target length: 4 / 6 / 8 pages", icon: "②" },
                  { label: "Max citation count slider", icon: "③" },
                  { label: "Export: PDF (two-column) + LaTeX", icon: "④" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.12)" }}
                  >
                    <span className="text-sm font-bold" style={{ color: "#a78bfa" }}>{item.icon}</span>
                    <span className="text-sm text-white/65">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 8px 32px rgba(124,58,237,0.3)" }}
          >
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start researching smarter</h2>
          <p className="text-white/40 mb-8 leading-relaxed">
            Upload your first paper and experience the difference. No account required — powered by Groq&apos;s free tier.
          </p>
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold hover:opacity-90 transition-opacity"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #06b6d4 100%)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.28)",
            }}
          >
            <Upload className="w-4 h-4" /> Upload Papers Free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6" style={{ background: "rgba(6,7,26,0.8)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
            >
              <Brain className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold gradient-text">ResearchMind AI</span>
          </div>
          <p className="text-white/25 text-xs">
            Powered by Groq &amp; Llama 3.3 &nbsp;|&nbsp; &copy; 2026 Mili Patel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
