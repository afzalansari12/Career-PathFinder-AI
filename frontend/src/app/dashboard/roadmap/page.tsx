// frontend/src/app/dashboard/roadmap/page.tsx
"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Sparkles, CheckCircle2, Clock, Circle, Loader2, Compass, Layers, Code2, Rocket } from "lucide-react";

interface Phase {
  phaseNumber: number;
  title: string;
  duration: string;
  skillGapSummary: string;
  topics: string[];
  projectIdea: string;
  status?: "completed" | "in_progress" | "pending";
}

export default function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [knownStack, setKnownStack] = useState("React, C++, Node.js");
  const [isGenerating, setIsGenerating] = useState(false);
  const [overallAnalysis, setOverallAnalysis] = useState(
    "Strong C++ logic and core Node.js/React fundamentals. Critical gaps identified in distributed state, PostgreSQL ORM optimization, Redis caching layers, and production CI/CD deployments."
  );

  const [phases, setPhases] = useState<Phase[]>([
    {
      phaseNumber: 1,
      title: "Advanced React & Distributed Client Architecture",
      duration: "2 Weeks",
      skillGapSummary: "Transition from basic hooks to enterprise state management, SSR streaming, and Next.js App Router performance tuning.",
      topics: ["Next.js Server Components & Suspense", "Zustand & TanStack Query (React Query)", "Custom Hooks & Memory Leak Profiling"],
      projectIdea: "Build a real-time collaborative dashboard with optimistic UI updates and Server-Sent Events (SSE).",
      status: "completed",
    },
    {
      phaseNumber: 2,
      title: "Production Backend Architecture & Database Scaling",
      duration: "3 Weeks",
      skillGapSummary: "Evolve raw Node.js script patterns into layered microservices with relational schema design and query indexing.",
      topics: ["PostgreSQL Schema Design & Prisma ORM", "Redis Rate Limiting & Session Caching", "JWT Auth with Refresh Tokens & RBAC"],
      projectIdea: "Implement a secure payment & subscription engine integrated with Razorpay and webhooks.",
      status: "in_progress",
    },
  ]);

  const handleGenerateRoadmap = async () => {
    if (!targetRole.trim() || !knownStack.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, currentSkills: knownStack }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.overallAnalysis) setOverallAnalysis(data.overallAnalysis);
        if (data.phases) {
          const mappedPhases = data.phases.map((p: Phase, idx: number) => ({
            ...p,
            status: idx === 0 ? "completed" : idx === 1 ? "in_progress" : "pending",
          }));
          setPhases(mappedPhases);
        }
      }
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          AI Skill-Gap & Career Architecture Analysis
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Track Configuration */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-5 sticky top-6">
          <h2 className="text-base font-heading font-bold text-foreground">Configure Track</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-foreground block mb-1.5">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none text-xs font-medium text-foreground"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1.5">Known Stack</label>
              <input
                type="text"
                value={knownStack}
                onChange={(e) => setKnownStack(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none text-xs font-medium text-foreground"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateRoadmap}
            disabled={isGenerating}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? "Performing Deep Analysis..." : "Generate Analytical Path"}
          </button>
        </div>

        {/* Right Deep Analysis View */}
        <div className="lg:col-span-8 space-y-6">
          {/* Executive Analysis Banner */}
          {overallAnalysis && (
            <div className="p-5 bg-emerald-50/40 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Layers className="w-4 h-4 text-emerald-600" /> Executive Skill-Gap Diagnosis
              </div>
              <p className="text-xs text-foreground leading-relaxed">{overallAnalysis}</p>
            </div>
          )}

          {/* Detailed Phase Cards */}
          <div className="space-y-4">
            {phases.map((phase, idx) => (
              <div
                key={idx}
                className="p-6 bg-card border border-border rounded-2xl shadow-2xs space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {phase.status === "completed" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {phase.status === "in_progress" && <Clock className="w-5 h-5 text-amber-600 animate-pulse" />}
                    {phase.status === "pending" && <Circle className="w-5 h-5 text-muted-foreground/40" />}
                    <h3 className="text-sm font-bold text-foreground">
                      Phase {phase.phaseNumber || idx + 1}: {phase.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                    {phase.duration}
                  </span>
                </div>

                {phase.skillGapSummary && (
                  <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                    <span className="font-bold text-foreground">Gap Diagnosis: </span>
                    {phase.skillGapSummary}
                  </p>
                )}

                {/* Key Technical Topics Badges */}
                {phase.topics && phase.topics.length > 0 && (
                  <div className="pl-8 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground">
                      <Code2 className="w-3.5 h-3.5 text-primary" /> Key Core Competencies
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase.topics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 bg-background border border-border rounded-lg text-[11px] font-semibold text-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestone Project Deliverable */}
                {phase.projectIdea && (
                  <div className="ml-8 p-3.5 bg-accent/30 border border-border rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <Rocket className="w-3.5 h-3.5 text-emerald-600" /> Production Deliverable Project
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{phase.projectIdea}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}