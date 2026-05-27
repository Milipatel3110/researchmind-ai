"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="lg:hidden sticky top-0 z-30 h-12 border-b border-white/5 backdrop-blur flex items-center px-4" style={{ background: "rgba(6,7,26,0.9)" }}>
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/60">
            <Menu className="w-5 h-5" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
