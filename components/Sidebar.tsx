"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, LayoutDashboard, Upload, MessageSquare, BookOpen,
  Search, GitBranch, Lightbulb, Telescope, X, ScrollText, Sparkles
} from "lucide-react";

const nav = [
  { label: "Dashboard",       icon: LayoutDashboard, href: "/dashboard" },
  { label: "Paper Vault",     icon: Upload,          href: "/vault" },
  { label: "Q&A",             icon: MessageSquare,   href: "/qa" },
  { label: "Lit Review",      icon: BookOpen,        href: "/review" },
  { label: "Gap Analyzer",    icon: Search,          href: "/gaps" },
  { label: "Compare Papers",  icon: GitBranch,       href: "/compare" },
  { label: "Hypothesis Forge",icon: Lightbulb,       href: "/hypothesis" },
  { label: "IEEE Paper Forge",icon: ScrollText,      href: "/paper-forge", badge: "New" },
  { label: "Discover",        icon: Telescope,       href: "/discover" },
];

interface NavItem { label: string; icon: React.ElementType; href: string; badge?: string; }
interface Props { mobileOpen?: boolean; onClose?: () => void; }

export default function Sidebar({ mobileOpen, onClose }: Props) {
  const pathname = usePathname();

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #06b6d4 100%)" }}
          >
            <Brain className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-[13px] text-white">ResearchMind</div>
            <div className="text-[10px] font-medium" style={{ color: "#a78bfa" }}>AI Platform</div>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {(nav as NavItem[]).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
              style={isActive ? { background: "rgba(139,92,246,0.1)" } : {}}
            >
              {/* Left accent bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
                  style={{ background: "linear-gradient(180deg, #a78bfa, #06b6d4)" }}
                />
              )}
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? "text-[#a78bfa]" : "text-white/30 group-hover:text-white/60"
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    color: "#a78bfa",
                    border: "1px solid rgba(139,92,246,0.3)",
                  }}
                >
                  {item.badge}
                </span>
              )}
              {isActive && !item.badge && (
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#8b5cf6" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 space-y-2.5">
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3" style={{ color: "#f59e0b" }} />
            <p className="text-[11px] font-medium" style={{ color: "rgba(200,200,230,0.55)" }}>
              Groq · Llama 3.3 70B
            </p>
          </div>
        </div>
        <p className="text-[10px] text-center" style={{ color: "rgba(170,170,210,0.28)" }}>
          &copy; 2026 Mili Patel
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col w-60 h-screen border-r border-white/5 fixed left-0 top-0 z-40"
        style={{ background: "#06071a" }}
      >
        <Content />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-60 border-r border-white/5 z-50 lg:hidden"
              style={{ background: "#06071a" }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
              >
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
