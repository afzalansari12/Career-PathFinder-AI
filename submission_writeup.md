# CareerPathfinder AI — Prototype Submission Write-Up

> **Official Prototype Submission Documentation**  
> Comprehensive overview of product architecture, AI/ML pipeline, UX design decisions, and judge walkthrough guide.

---

## 🌐 Deliverable Links
- **Live Production App URL**: [https://career-path-finder-ai-three.vercel.app](https://career-path-finder-ai-three.vercel.app)
- **1-Click Instant Demo Link (Evaluator Access)**: [https://career-path-finder-ai-three.vercel.app/dashboard?demo=true](https://career-path-finder-ai-three.vercel.app/dashboard?demo=true)
- **GitHub Repository**: [https://github.com/afzalansari12/career-pathfinder-ai](https://github.com/afzalansari12/career-pathfinder-ai)

---

## 🎯 1. Problem Statement & Product Vision

Navigating early tech careers and transitioning into specialized engineering roles is often fragmented. Job seekers struggle with three primary hurdles:
1. **ATS Gatekeeping**: Resumes fail initial applicant tracking software filters due to missing keywords, formatting errors, or weak metric quantification.
2. **Unclear Skill Roadmap**: Candidates don't know the exact step-by-step technical milestone gap between their current stack and their target role requirements.
3. **Interview Unpreparedness**: Generic interview preparation lacks role-specific technical questions, instant scoring rubrics, and feedback on architectural trade-offs.

**CareerPathfinder AI** solves this with an end-to-end SaaS platform that analyzes resumes with deterministic scoring, generates customized career roadmaps, matches active tech job listings with direct application links, and simulates real AI technical mock interviews.

---

## 🧠 2. AI / ML Components & Technical Architecture

The application combines deterministic rules engines with multi-LLM orchestration for high reliability and deep natural language feedback:

### A. Deterministic ATS Scoring Engine
- **No-Hallucination Scoring**: Unlike pure LLM-based resume raters that generate inconsistent scores, our engine uses deterministic logic ([`src/lib/ats/engine.ts`](file:///Users/afzalansari/career-pathfinder-ai/frontend/src/lib/ats/engine.ts)) to calculate objective category scores:
  - **Structure (25 pts)**: Header compliance, section order, contact info validation.
  - **Keywords & Density (35 pts)**: Detected vs. missing target role skills.
  - **Impact & Verbs (20 pts)**: Action verb frequency and metric quantification percentage.
  - **Formatting & Parseability (20 pts)**: Bullet density, word count ratios, and PDF layout flags.

### B. Multi-Model AI Pipeline
- **Groq Llama-3.3-70B Versatile**: Generates recruiter-level executive narrative summaries, actionable bullet point improvement recommendations, custom 4-phase learning roadmaps, and candidate mock interview answer evaluations.
- **Google Gemini 1.5 Flash**: Provides fast multimodal fallback inference and structured JSON response formatting.
- **PDF Text Extractor (`pdf-parse-fixed`)**: Cleanly extracts raw text from PDF binary streams without corrupting layout formatting.

### C. Live Job Aggregator Engine
- Integrates **Adzuna API** for real-time tech vacancy data paired with direct **Google Careers / LinkedIn / Lever / Greenhouse** application URLs.

---

## 🎨 3. UX Decisions & Design Aesthetics

- **Modern Dark-Mode Design**: Built with curated HSL color palettes (emerald glowing accents, deep dark card surfaces, subtle borders), Google Outfit/Inter typography, and smooth glassmorphism.
- **Zero-Friction 1-Click Instant Demo**: Evaluators and judges can access the complete dashboard in 1 click using `?demo=true`, bypassing login steps while preserving full interactive AI functionality.
- **Global 24/7 AI Chatbot Assistant**: Embedded on every single page via [`AppShell`](file:///Users/afzalansari/career-pathfinder-ai/frontend/src/components/layout/AppShell.tsx) with quick starter prompts, plus a dedicated full-page AI Career Coach at [`/chat`](file:///Users/afzalansari/career-pathfinder-ai/frontend/src/app/chat/page.tsx).
- **Responsive Layout**: Fluid layouts across desktop monitors, laptops, tablets, and mobile screens.

---

## 🛠️ 4. Tech Stack & Production Feasibility

- **Frontend**: Next.js 16 (App Router, React 19), Tailwind CSS v4, Lucide React, Framer Motion, Recharts.
- **Backend / API**: Next.js Serverless Route Handlers, Node.js text parsing pipelines.
- **Authentication**: Clerk Authentication (`@clerk/nextjs`) with protected route middleware.
- **Database / Storage**: Supabase PostgreSQL and Supabase Storage for resume file archiving.
- **Hosting / Deployment**: Deployed on Vercel with clean production build pass across all 29 routes.

---

## 📋 5. How to Test the Demo (Quick Walkthrough for Judges)

1. Open **[https://career-pathfinder-ai-three.vercel.app/dashboard?demo=true](https://career-pathfinder-ai-three.vercel.app/dashboard?demo=true)**.
2. Click **"ATS Resume"** in the sidebar:
   - Upload any sample PDF resume to view the live circular score gauge, breakdown bars, missing skills, and AI recruiter narrative.
3. Click **"Career Roadmap"**:
   - Enter a target role (e.g. *AI Engineer* or *Full Stack Engineer*) and click **"Generate AI Roadmap"** to see interactive 4-phase milestones and project challenges.
4. Click **"Live Jobs"**:
   - Filter active listings by role or location and click **"Apply Now ↗"** to test direct application redirection.
5. Click **"Mock Interview"**:
   - Select a role, generate a technical question, type your response, and click **"Submit Answer"** to receive an instant AI evaluation score (0-100) and feedback.
6. Click the floating **"Ask AI"** button at the bottom right of any page to ask the assistant career or coding questions.
