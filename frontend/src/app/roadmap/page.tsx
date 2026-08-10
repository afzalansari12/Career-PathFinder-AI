// frontend/src/app/roadmap/page.tsx
"use client";

import React, { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Clock,
  Target,
  Layers,
  ArrowRight,
  Loader2,
  ExternalLink,
  ChevronRight,
  Code2,
  Trophy,
} from "lucide-react";
import Link from "next/link";

interface Milestone {
  step: number;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
  duration: string;
  topics?: string[];
  projectIdea?: string;
}

const DEFAULT_MILESTONES: Milestone[] = [
  {
    step: 1,
    title: "System Fundamentals & Advanced TypeScript",
    description: "Deep dive into production-grade design patterns, memory execution, and type safety for large applications.",
    status: "completed",
    duration: "2 Weeks",
    topics: ["Generics & Utility Types", "Event Loop & Memory Allocation", "Design Patterns"],
    projectIdea: "Build a type-safe event-driven pub/sub architecture in TypeScript.",
  },
  {
    step: 2,
    title: "High-Throughput APIs & Full-Stack Next.js",
    description: "Master server-side rendering, streaming SSR, server actions, and middleware authentication.",
    status: "in_progress",
    duration: "3 Weeks",
    topics: ["App Router & Server Components", "API Route Middleware", "State Synchronization"],
    projectIdea: "Develop a real-time collaborative workspace app with WebSockets.",
  },
  {
    step: 3,
    title: "Database Scaling & Microservices Architecture",
    description: "Learn PostgreSQL query indexing, Redis sliding-window caching, and Docker microservice orchestration.",
    status: "pending",
    duration: "4 Weeks",
    topics: ["PostgreSQL Query Plans & Indexing", "Redis Cache Invalidation", "Docker & Kubernetes Basics"],
    projectIdea: "Implement a microservice rate-limiter with Redis and distributed logging.",
  },
  {
    step: 4,
    title: "System Design, CI/CD & Production Engineering",
    description: "Design fault-tolerant distributed systems, CAP theorem trade-offs, and automated deployment pipelines.",
    status: "pending",
    duration: "3 Weeks",
    topics: ["CAP Theorem & Sharding", "GitHub Actions CI/CD", "Prometheus & Grafana Telemetry"],
    projectIdea: "Architect and deploy an enterprise-ready auto-scaling cluster on cloud infrastructure.",
  },
];

export default function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [knownStack, setKnownStack] = useState("JavaScript, React, HTML/CSS");
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [generating, setGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(2);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, knownStack }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.milestones && Array.isArray(data.milestones)) {
          setMilestones(data.milestones);
          setActiveStep(1);
        }
      }
    } catch (err) {
      console.error("Roadmap generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const toggleStatus = (stepNumber: number) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.step === stepNumber) {
          const nextStatus: "completed" | "in_progress" | "pending" =
            m.status === "completed"
              ? "in_progress"
              : m.status === "in_progress"
              ? "pending"
              : "completed";
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 p-2 sm:p-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Target className="w-3.5 h-3.5" /> AI Career Pathfinder & Roadmap Generator
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
              Target Role Roadmap
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Custom AI-generated learning milestones designed to bridge your current technical skills to your target career position.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-card border border-border/80 px-5 py-3 rounded-2xl shadow-lg">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs text-muted-foreground font-mono uppercase">Target Progress</div>
              <div className="text-lg font-bold text-foreground">{progressPercent}% Achieved</div>
            </div>
          </div>
        </div>

        {/* Generator Input Form */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Engineer, AI Engineer, Data Scientist"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Current Known Skills
              </label>
              <input
                type="text"
                value={knownStack}
                onChange={(e) => setKnownStack(e.target.value)}
                placeholder="e.g. JavaScript, React, Python, Git"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={generating || !targetRole.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 cursor-pointer h-[42px]"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating ? "Generating..." : "Generate AI Roadmap"}
              </button>
            </div>
          </form>
        </div>

        {/* Milestone Steps Overview & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Milestone Timeline List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Milestone Phases for {targetRole}
            </h2>

            <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-border/60">
              {milestones.map((m) => {
                const isActive = activeStep === m.step;
                const isDone = m.status === "completed";
                const isInProgress = m.status === "in_progress";

                return (
                  <div
                    key={m.step}
                    onClick={() => setActiveStep(m.step)}
                    className={`relative pl-14 pr-5 py-5 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-card border-emerald-500/50 shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-500/30"
                        : "bg-card/60 border-border/70 hover:border-border hover:bg-card"
                    }`}
                  >
                    {/* Step Icon Badge */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(m.step);
                      }}
                      className={`absolute left-3 top-5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 cursor-pointer ${
                        isDone
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/30"
                          : isInProgress
                          ? "bg-amber-500 text-white shadow-md shadow-amber-900/30"
                          : "bg-secondary text-muted-foreground border border-border"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : m.step}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                            Phase {m.step}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {m.duration}
                          </span>
                        </div>
                        <h3 className="text-base font-heading font-bold text-foreground">{m.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.description}</p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                          isActive ? "translate-x-1 text-emerald-400" : ""
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Milestone Inspector Drawer */}
          <div className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-6 sticky top-6">
            {milestones.find((m) => m.step === activeStep) ? (
              (() => {
                const current = milestones.find((m) => m.step === activeStep)!;
                return (
                  <>
                    <div className="flex justify-between items-start border-b border-border pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          Phase {current.step} Detail
                        </span>
                        <h3 className="font-heading font-bold text-lg text-foreground mt-2">{current.title}</h3>
                      </div>
                      <button
                        onClick={() => toggleStatus(current.step)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                          current.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-secondary text-foreground border border-border hover:bg-accent"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {current.status === "completed" ? "Completed" : "Mark Done"}
                      </button>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <h4 className="font-mono uppercase text-[11px] text-muted-foreground mb-1">
                          Phase Learning Objective
                        </h4>
                        <p className="text-foreground/90 leading-relaxed bg-muted/20 p-3.5 rounded-2xl border border-border/40">
                          {current.description}
                        </p>
                      </div>

                      {/* Key Topics */}
                      <div className="space-y-2">
                        <h4 className="font-mono uppercase text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Key Mastery Topics
                        </h4>
                        <div className="space-y-1.5">
                          {(
                            current.topics || [
                              "Core Architectural Concepts",
                              "Production Optimization",
                              "Testing & Debugging",
                            ]
                          ).map((topic, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-xl bg-secondary/40 border border-border/50 font-medium text-foreground flex items-center justify-between"
                            >
                              <span>{topic}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Project Idea */}
                      <div className="space-y-2 pt-2">
                        <h4 className="font-mono uppercase text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-blue-400" /> Milestone Project Challenge
                        </h4>
                        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-foreground/90 leading-relaxed">
                          {current.projectIdea || "Build a real-world project demonstrating mastery of this phase."}
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <Link
                          href="/jobs"
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-center text-xs transition"
                        >
                          Find Matching Jobs ↗
                        </Link>
                      </div>
                    </div>
                  </>
                );
              })()
            ) : (
              <p className="text-xs text-muted-foreground">Select a phase to inspect learning goals.</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}