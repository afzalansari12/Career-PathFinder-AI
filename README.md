# 🚀 CareerPathfinder AI — SaaS Career Accelerator

> **AI-Powered Career & Learning Path Finder SaaS Application**  
> Instant deterministic ATS resume scoring, personalized target role roadmaps, live tech job listings with direct apply links, interactive AI mock technical interviews, and a 24/7 AI career assistant.

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Groq](https://img.shields.io/badge/Groq-Llama--3.3--70B-orange?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=googlecloud)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

---

## 🔗 Live Links

- **🌐 Live Production Application**: [https://career-path-finder-ai-three.vercel.app](https://career-path-finder-ai-three.vercel.app)
- **🚀 1-Click Instant Demo Access (Evaluators / Judges)**: [https://career-path-finder-ai-three.vercel.app/dashboard?demo=true](https://career-path-finder-ai-three.vercel.app/dashboard?demo=true)
- **📦 GitHub Repository**: [https://github.com/afzalansari12/career-pathfinder-ai](https://github.com/afzalansari12/career-pathfinder-ai)

---

## ✨ Key Features

### 1. 📄 Deterministic & AI ATS Resume Audit (`/dashboard/resume`)
- **Deterministic Rules Engine**: Calculates objective category scores without hallucination:
  - **Structural Compliance (25 pts)**: Section order, contact info audit, layout check.
  - **Keyword Matching & Density (35 pts)**: Detected vs. missing target role skills.
  - **Impact & Verbs (20 pts)**: Action verb frequency & metric quantification percentage.
  - **Formatting & Parseability (20 pts)**: Bullet density, word count ratios.
- **AI Recruiter Feedback**: Powered by Groq Llama-3.3-70B to generate narrative executive summaries, key strengths, and bullet-by-bullet improvement items.

### 2. 🎯 AI-Powered Personalized Learning Path Recommender (`/roadmap`)
- **Natural Language Conversational Interface**: Learners describe their target career goals, available time, and learning preferences in plain English to generate custom roadmaps.
- **Learner Profiling Engine**: Captures experience levels, known vs target skills, learning style (Project-Based, Video, Theory, Interactive), and completed course history (`/profile`).
- **Curated Course & Project Recommendations**: Recommends top courses, hands-on portfolio projects, and certifications complete with match percentages and AI **"Why Recommended"** explainer modals.
- **Milestone Roadmaps & Quizzes**: Multi-phase progressive roadmaps with prerequisite dependencies, project challenges, phase self-assessment quizzes, and real-time AI path adaptability.
- **Skill Competency Radar Matrix**: Visual Recharts radar chart comparing current proficiency vs target requirement levels.

### 3. 💼 Live Tech Jobs with Direct Apply Links (`/jobs`)
- Real-time tech vacancies aggregated from **Adzuna API** and verified openings at top companies (*Vercel, OpenAI, Stripe, GitHub, Google DeepMind*).
- Prominent **"Apply Now ↗"** buttons linking directly to official company career portals (LinkedIn, Lever, Greenhouse).
- Search filters by role keywords and locations (*Remote, India, Hybrid*).

### 4. 🎙️ Real AI Mock Technical Interview (`/interview`)
- Dynamically generates role-specific technical & system design questions.
- Candidate types their response and receives instant **AI scoring rubrics (0-100)**, detailed recruiter feedback on architectural trade-offs, and ideal reference answers.

### 5. 🤖 24/7 Global & Dedicated AI Assistant (`<ChatBot />` & `/chat`)
- **Global Floating Widget**: Embedded on **every single page** via `AppShell` for instant questions.
- **Dedicated Full-Page Assistant (`/chat`)**: Full conversation history, quick starter prompt cards, and markdown formatting.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, React 19) |
| **Styling** | Tailwind CSS v4, Lucide React, Framer Motion |
| **AI / LLM** | Groq SDK (`llama-3.3-70b-versatile`), Google Gemini (`gemini-1.5-flash`) |
| **PDF Parsing** | `pdf-parse-fixed` (clean binary text extraction) |
| **Authentication** | Clerk (`@clerk/nextjs`) with route guarding middleware |
| **Database** | Supabase PostgreSQL (`@supabase/supabase-js`, `@supabase/ssr`) |
| **Job Data** | Adzuna API + Curated Tech Vacancy Aggregator |
| **Deployment** | Vercel Serverless Platform |

---

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/afzalansari12/career-pathfinder-ai.git
cd career-pathfinder-ai/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create `.env.local` inside the `frontend/` directory:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📦 Production Build & Vercel Deployment

To test the production build locally:
```bash
npm run build
```

### Deploying to Vercel:
1. Connect your repository to [vercel.com](https://vercel.com/new).
2. Set **Root Directory** to `frontend`.
3. Add the environment variables from `.env.local` in Vercel settings.
4. Click **Deploy**.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
