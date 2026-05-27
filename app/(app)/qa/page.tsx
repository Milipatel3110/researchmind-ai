"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Loader2, FileText, Trash2, Upload } from "lucide-react";
import { usePapers, streamResponse } from "@/lib/usePapers";
import Link from "next/link";

interface Message { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "What are the main findings across all papers?",
  "What methodologies are used and how do they differ?",
  "What datasets were used in these studies?",
  "What limitations do the authors acknowledge?",
  "How do the results compare across papers?",
];

export default function QAPage() {
  const { papers } = usePapers();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (papers.length > 0 && selectedIds.length === 0) setSelectedIds(papers.map(p => p.id));
  }, [papers]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const selectedPapers = papers.filter(p => selectedIds.includes(p.id));

  const ask = async (question: string) => {
    if (!question.trim() || loading || !selectedPapers.length) return;
    const userMsg: Message = { role: "user", content: question };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const placeholder: Message = { role: "assistant", content: "" };
    setMessages(prev => [...prev, placeholder]);
    try {
      await streamResponse("/api/qa", {
        question,
        papers: selectedPapers,
        history: messages.slice(-6),
      }, (text) => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: text };
          return updated;
        });
      });
    } catch (e) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: `Error: ${e instanceof Error ? e.message : "Failed"}` };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  if (papers.length === 0) return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <FileText className="w-10 h-10 text-white/20 mb-4" />
      <p className="text-white/50 mb-4">Upload papers first to start asking questions.</p>
      <Link href="/vault" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white text-sm font-semibold hover:opacity-90">
        <Upload className="w-4 h-4" /> Go to Paper Vault
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] lg:h-screen max-w-4xl mx-auto">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#a78bfa]/15 border border-[#a78bfa]/25 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-[#a78bfa]" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Cross-Paper Q&A</h1>
            <p className="text-xs text-white/40">{selectedPapers.length} of {papers.length} paper{papers.length !== 1 ? "s" : ""} selected</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {papers.length > 1 && (
        <div className="px-6 py-2 border-b border-white/5 flex flex-wrap gap-2">
          {papers.map(p => (
            <button key={p.id} onClick={() => setSelectedIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${selectedIds.includes(p.id) ? "bg-[#4f8ef7]/15 border-[#4f8ef7]/30 text-[#4f8ef7]" : "border-white/10 text-white/30 hover:text-white/60"}`}>
              {p.title.substring(0, 30)}{p.title.length > 30 ? "…" : ""}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-white/40 text-sm text-center mb-6">Ask anything about your papers. I'll cite sources in my answers.</p>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => ask(s)} className="w-full text-left px-4 py-3 rounded-xl card text-sm text-white/60 hover:text-white hover:border-white/15 transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "user" ? (
                <div className="max-w-[80%] bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm">
                  {msg.content}
                </div>
              ) : (
                <div className="max-w-[90%] card rounded-2xl rounded-bl-sm px-4 py-3">
                  {!msg.content && loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#a78bfa]" />
                  ) : (
                    <div className="prose text-sm"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), ask(input))}
            placeholder="Ask a question about your papers..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#4f8ef7]/50 transition-colors"
          />
          <button onClick={() => ask(input)} disabled={!input.trim() || loading || !selectedPapers.length}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4f8ef7] to-[#a78bfa] text-white hover:opacity-90 disabled:opacity-30 transition-opacity">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
