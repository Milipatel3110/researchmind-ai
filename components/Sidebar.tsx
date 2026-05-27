"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, LayoutDashboard, Upload, MessageSquare, BookOpen,
  Search, GitBranch, Lightbulb, Telescope, X, ScrollText
} from "lucide-react";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Paper Vault", icon: Upload, href: "/vault" },
  { label: "Q&A", icon: MessageSquare, href: "/qa" },
  { label: "Lit Review", icon: BookOpen, href: "/review" },
  { label: "Gap Analyzer", icon: Search, href: "/gaps" },
  { label: "Compare Papers", icon: GitBranch, href: "/compare" },
  { label: "Hypothesis Forge", icon: Lightbulb, href: "/hypothesis" },
  { label: "IEEE Paper Forge", icon: ScrollText, href: "/paper-forge", badge: "New" },
  { label: "Discover", icon: Telescope, href: "/discover" },
];

interface NavItem { label: string; icon: React.ElementType; href: string; badge?: string; }
interface Props { mobileOpen?: boolean; onClose?: () => void; }

export default function Sidebar({ mobileOpen, onClose }: Props) {
  const pathname = usePathname();

  const Content = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4f8ef7] via-[#a78bfa] to-[#34d399] flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm gradient-text">ResearchMind AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {(nav as NavItem[]).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-[#4f8ef7]/15 via-[#a78bfa]/15 to-[#34d399]/10 text-white border border-white/10"
                  : "text-white/45 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-[#4f8ef7]" : "text-white/35 group-hover:text-white/60"}`} />
              <span>{item.label}</span>
              {item.badge && <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/25">{item.badge}</span>}
              {isActive && !item.badge && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4f8ef7]" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/5 space-y-2">
        <div className="card rounded-xl p-3">
          <p className="text-xs text-white/40 text-center">Powered by Groq &amp; Llama 3.3</p>
        </div>
        <p className="text-[10px] text-white/20 text-center">&copy; 2026 Mili Patel. All rights reserved.</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 h-screen bg-[#080b14] border-r border-white/5 fixed left-0 top-0 z-40">
        <Content />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed left-0 top-0 h-screen w-60 bg-[#080b14] border-r border-white/5 z-50 lg:hidden">
              <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <Content />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
