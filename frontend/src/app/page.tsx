// frontend/src/app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  Sparkles,
  FileText,
  Target,
  Briefcase,
  Video,
  Bot,
  ArrowRight,
  CheckCircle2,
  LogIn,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-hidden selection:bg-emerald-500/30">
      {/* Glow Ambient Background Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
            P
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">PathFinder AI</span>
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/dashboard?demo=true"
                className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs px-4 py-2.5 rounded-xl border border-border transition flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" /> Instant Demo
              </Link>
              <Link
                href="/sign-in"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered Career Accelerator SaaS
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1]">
          Supercharge Your Career with <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            Deterministic ATS & AI Intelligence
          </span>
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Upload your resume for instant deterministic ATS scoring, generate step-by-step target role roadmaps, match direct tech job vacancies, and practice AI mock interviews.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard?demo=true"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-900/40 transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> Try Instant Demo Dashboard
          </Link>
          <Link
            href="/sign-in"
            className="w-full sm:w-auto bg-secondary/80 hover:bg-secondary text-secondary-foreground font-semibold text-sm px-8 py-3.5 rounded-2xl border border-border transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Sign In / Create Account
          </Link>
        </div>

        {/* Feature Badges Grid */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-muted-foreground max-w-4xl mx-auto border-t border-border/50">
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card/40 border border-border/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Deterministic ATS Score
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card/40 border border-border/50">
            <Target className="w-4 h-4 text-emerald-400" /> Target Role Roadmaps
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card/40 border border-border/50">
            <Briefcase className="w-4 h-4 text-emerald-400" /> Direct Job Portal Links
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card/40 border border-border/50">
            <Bot className="w-4 h-4 text-emerald-400" /> 24/7 AI Career Assistant
          </div>
        </div>
      </section>

      {/* Core SaaS Capabilities Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-12 relative z-10 border-t border-border/60">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Complete Career Preparation Platform
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Everything you need to go from candidate application to hired tech professional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-foreground">
              Deterministic & AI ATS Scoring
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload PDF resumes to compute realistic category scores (Structure, Keywords, Impact, Formatting) alongside recruiter-level AI recommendations.
            </p>
            <Link
              href="/dashboard/resume"
              className="text-xs font-semibold text-emerald-400 hover:underline inline-flex items-center gap-1 pt-2"
            >
              Analyze Resume <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-foreground">
              Target Role Roadmap Generator
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Input any target role (Full Stack, AI/ML, DevOps) to receive customized milestone phases, learning objectives, and project challenges.
            </p>
            <Link
              href="/roadmap"
              className="text-xs font-semibold text-emerald-400 hover:underline inline-flex items-center gap-1 pt-2"
            >
              Generate Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-foreground">
              AI Mock Technical Interview
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Practice real-time technical & system design interview questions, submit your answer, and receive score rubrics and model feedback.
            </p>
            <Link
              href="/interview"
              className="text-xs font-semibold text-emerald-400 hover:underline inline-flex items-center gap-1 pt-2"
            >
              Start Practice <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
        <span>© 2026 PathFinder AI. All rights reserved.</span>
        <Link href="/sign-in" className="text-emerald-400 font-semibold hover:underline">
          Sign In ↗
        </Link>
      </footer>
    </div>
  );
}