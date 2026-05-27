"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, Upload, MessageSquare, BookOpen, Search,
  GitBranch, Lightbulb, Telescope, ArrowRight, Sparkles,
  FileText, Zap, Globe
} from "lucide-react";

const features = [
  { icon: Upload, title: "Paper Vault", desc: "Upload PDFs — AI auto-extracts title, authors, abstract, findings, and methodology.", color: "from-[#4f8ef7] to-[#6366f1]" },
  { icon: MessageSquare, title: "Cross-Paper Q&A", desc: "Ask questions across your entire library. Get answers with exact cited passages.", color: "from-[#a78bfa] to-[#ec4899]" },
  { icon: BookOpen, title: "Literature Review", desc: "Select papers and auto-generate a structured lit review ready for your thesis.", color: "from-[#34d399] to-[#059669]" },
  { icon: Search, title: "Research Gap Analyzer", desc: "AI reads all your papers and surfaces what the field hasn't studied yet.", color: "from-[#f59e0b] to-[#ef4444]" },
  { icon: GitBranch, title: "Paper Comparison", desc: "Side-by-side matrix: methodology, dataset, results, and limitations at a glance.", color: "from-[#06b6d4] to-[#4f8ef7]" },
  { icon: Lightbulb, title: "Hypothesis Forge", desc: "AI suggests novel research directions based on the gaps it finds across your papers.", color: "from-[#f472b6] to-[#a78bfa]" },
  { icon: Telescope, title: "Discover Papers", desc: "Live search across Semantic Scholar and ArXiv. Find related work instantly.", color: "from-[#34d399] to-[#4f8ef7]" },
];

const stats = [
  { value: "128K", label: "Token Context Window" },
  { value: "7", label: "AI-Powered Features" },
  { value: "Free", label: "Powered by Groq" },
  { value: "Live", label: "ArXiv + Semantic Scholar" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080b14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f8ef7] via-[#a78bfa] to-[#34d399] flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm gradient-text">ResearchMind AI</span>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Launch App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#4f8ef7]/8 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-[#a78bfa]/8 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full bg-[#34d399]/6 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 mb-8">
            <Sparkles className="w-3 h-3 text-[#a78bfa]" /> Built for researchers, powered by AI
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Your AI{" "}<span className="gradient-text">Second Brain</span><br />for Research
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload research papers, ask questions across your library, find research gaps, generate literature reviews, and forge new hypotheses — all powered by AI.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/vault" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#4f8ef7] via-[#a78bfa] to-[#34d399] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#4f8ef7]/20">
              <Upload className="w-4 h-4" /> Upload Your Papers
            </Link>
            <Link href="/discover" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-white/80 font-semibold hover:bg-white/10 transition-colors">
              <Globe className="w-4 h-4" /> Explore ArXiv
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything a researcher needs</h2>
            <p className="text-white/50 max-w-xl mx-auto">From paper ingestion to hypothesis generation — the full research intelligence workflow.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="card rounded-2xl p-6 hover:border-white/15 transition-colors group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, step: "01", title: "Upload Papers", desc: "Drop your PDFs. AI extracts metadata, key findings, and methodology automatically." },
              { icon: Zap, step: "02", title: "AI Analysis", desc: "Groq's Llama 3.3 70B with 128K context reads across all your papers simultaneously." },
              { icon: Lightbulb, step: "03", title: "Discover Insights", desc: "Get lit reviews, gap analysis, hypotheses, and cross-paper answers in seconds." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 relative">
                    <Icon className="w-6 h-6 text-[#4f8ef7]" />
                    <span className="absolute -top-2 -right-2 text-[10px] font-bold text-[#a78bfa] bg-[#080b14] border border-[#a78bfa]/30 rounded-full px-1.5 py-0.5">{s.step}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card rounded-3xl p-12 glow-blue relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#4f8ef7]/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#a78bfa]/10 blur-2xl" />
            <Brain className="w-10 h-10 text-[#4f8ef7] mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Start researching smarter</h2>
            <p className="text-white/50 mb-8">Upload your first paper and experience the difference.</p>
            <Link href="/vault" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#4f8ef7] via-[#a78bfa] to-[#34d399] text-white font-semibold hover:opacity-90 transition-opacity">
              <Upload className="w-4 h-4" /> Upload Papers Free
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#4f8ef7] to-[#a78bfa] flex items-center justify-center">
              <Brain className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold gradient-text">ResearchMind AI</span>
          </div>
          <p className="text-white/30 text-xs">
            Powered by Groq &amp; Llama 3.3 &nbsp;|&nbsp; &copy; 2026 Mili Patel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
