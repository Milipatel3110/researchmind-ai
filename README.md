# ResearchMind AI

> An AI research intelligence platform for academics, PhD students, and researchers.

**GitHub → [github.com/Milipatel3110/researchmind-ai](https://github.com/Milipatel3110/researchmind-ai)**

---

## Overview

ResearchMind AI is your AI-powered second brain for research. Upload papers from your library, ask questions across all of them at once, discover research gaps, generate literature reviews, compare methodologies, forge new hypotheses, and even generate complete IEEE-format review papers — ready to submit or paste into Overleaf.

Built with Next.js 16, Groq (Llama 3.3 70B + Llama 3.1 8B), Semantic Scholar API, and ArXiv API. All AI responses stream in real time.

---

## Features

| Feature | Description |
|---|---|
| **Paper Vault** | Upload PDFs — AI auto-extracts title, authors, year, abstract, key findings, and methodology |
| **Cross-Paper Q&A** | Ask any question across your entire paper library — answers include citations to the exact paper |
| **Literature Review Generator** | Select papers, choose style (academic / concise / narrative) → get a structured lit review ready to paste into your thesis |
| **Research Gap Analyzer** | AI reads all your papers and surfaces unexplored areas, methodological limitations, and priority research directions |
| **Paper Comparison Matrix** | Side-by-side comparison of problem statement, methodology, dataset, results, and limitations across papers |
| **Hypothesis Forge** | AI generates 5 novel testable hypotheses + quick-win ideas + a moonshot hypothesis from your paper library |
| **IEEE Paper Forge** | Configure title, authors, sections, page count, and citation limit → generate a complete IEEE review paper. Export as PDF (two-column letter format) or IEEEtran LaTeX for Overleaf |
| **Discover Papers** | Live search across Semantic Scholar and ArXiv — citation counts, open-access PDF links, and abstracts |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **AI:** Groq API
  - Llama 3.3 70B Versatile — analysis, Q&A, gap detection, hypotheses
  - Llama 3.1 8B Instant — IEEE paper generation (131K TPM free tier)
- **Paper Discovery:** Semantic Scholar API + ArXiv API (both free, no key required)
- **PDF Parsing:** unpdf (server-side)
- **UI:** Tailwind CSS v4 + Framer Motion
- **Storage:** localStorage (client-side, no database required)
- **Deployment:** Vercel

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Groq API key](https://console.groq.com) — free tier available

### Installation

```bash
git clone https://github.com/Milipatel3110/researchmind-ai.git
cd researchmind-ai
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key
```

That's the only key needed. Semantic Scholar and ArXiv APIs are public and require no authentication.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
├── (app)/                  # App pages (sidebar layout)
│   ├── dashboard/
│   ├── vault/              # Paper Vault
│   ├── qa/                 # Cross-Paper Q&A
│   ├── review/             # Literature Review Generator
│   ├── gaps/               # Research Gap Analyzer
│   ├── compare/            # Paper Comparison Matrix
│   ├── hypothesis/         # Hypothesis Forge
│   ├── paper-forge/        # IEEE Paper Forge
│   └── discover/           # ArXiv + Semantic Scholar search
├── api/                    # API route handlers
│   ├── upload/             # PDF ingestion + metadata extraction
│   ├── qa/
│   ├── review/
│   ├── gaps/
│   ├── compare/
│   ├── hypothesis/
│   ├── paper-forge/
│   └── discover/
└── page.tsx                # Landing page
components/
└── Sidebar.tsx
lib/
├── groq.ts                 # Groq streaming + completion helpers
├── papers.ts               # Paper type + chunking utilities
├── usePapers.ts            # localStorage hook
├── semantic-scholar.ts     # Semantic Scholar API client
└── arxiv.ts                # ArXiv API client
```

---

## IEEE Paper Forge — How It Works

1. Upload your source papers to the Paper Vault
2. Go to **IEEE Paper Forge** → enter title, authors, affiliation, keywords
3. Select which sections to include (Abstract, Introduction, Background, Methodology, Comparative Analysis, Results, Limitations, Future Work, Conclusion, References)
4. Choose target length (4 / 6 / 8 pages) and max citation count
5. Click **Generate** — watch the paper write itself in real time
6. **Download PDF** — opens a new tab with the IEEE-formatted paper, print dialog auto-launches → Save as PDF (Letter size)
7. **Copy LaTeX** — copies a complete IEEEtran-compatible `.tex` file ready to paste into Overleaf

---

## Deployment

Deploy instantly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Milipatel3110/researchmind-ai)

Add `GROQ_API_KEY` in the Vercel environment variables during setup.

---

## License

MIT — free to fork and build on.

---

*Built by [Mili Patel](https://github.com/Milipatel3110)*
