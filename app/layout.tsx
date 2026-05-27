import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResearchMind AI — Research Intelligence Platform",
  description: "AI-powered platform for researchers. Upload papers, ask questions, find gaps, generate literature reviews and hypotheses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
