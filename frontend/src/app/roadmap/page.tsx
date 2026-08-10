// frontend/src/app/dashboard/roadmap/page.tsx
"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Sparkles, CheckCircle2, Clock, Circle, Loader2, Compass } from "lucide-react";

interface Milestone {
  step: number;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
  duration: string;
}

export default function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [knownStack, setKnownStack] = useState("React, C++, Node.js");
  const [isGenerating, setIsGenerating] = useState(false);

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      step: 1,
      title: "Advanced Next.js App Router Architecture",
      description: "Master server components, streaming SSR, and Turbopack module resolution.",
      status: "completed",
      duration: "2 Weeks",
    },
    {
      step: 2,
      title: "Scalable Database Design & ORM Mastery",
      description: "Implement PostgreSQL schema migrations, Prisma ORM indexing, and Redis caching layers.",
      status: "in_progress",
      duration: "3 Weeks",
    },
    {
      step: 3,
      title: "Distributed Systems & Asynchronous Task Queues",
      description: "Integrate BullMQ, WebSockets, and event-driven worker processes for high-volume background tasks.",
      status: "pending",
      duration: "4 Weeks",
    },
  ]);

  const handleGenerateRoadmap = async () => {
    if (!targetRole.trim() || !knownStack.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, knownStack }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.milestones) {
          setMilestones(data.milestones);
        }
      }
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStatus = (index: number) => {
    setMilestones((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const nextStatus =
            item.status === "completed"
              ? "in_progress"
              : item.status === "in_progress"
              ? "pending"
              : "completed";
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <AppShell>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 pb-6 border-b border-border mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          Dynamic Career Roadmap & Skill Gap Graph
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Track Configuration Panel */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-5 sticky top-6">
          <h2 className="text-base font-heading font-bold text-foreground">Configure Track</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-foreground block mb-1.5">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Engineer, AI Architect"
                className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-foreground"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1.5">Known Stack</label>
              <input
                type="text"
                value={knownStack}
                onChange={(e) => setKnownStack(e.target.value)}
                placeholder="e.g. React, C++, Node.js"
                className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-foreground"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateRoadmap}
            disabled={isGenerating}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50 mt-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isGenerating ? "Analyzing Skill Gap..." : "Generate Path"}
          </button>
        </div>

        {/* Right Milestone Graph List */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              MILESTONE GRAPH ({milestones.length} STAGES)
            </h3>
            <span className="text-xs font-bold text-emerald-700">
              {milestones.filter((m) => m.status === "completed").length} / {milestones.length} Completed
            </span>
          </div>

          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                onClick={() => toggleStatus(idx)}
                className={`p-5 border rounded-2xl transition cursor-pointer flex items-start gap-4 ${
                  m.status === "completed"
                    ? "bg-emerald-50/40 border-emerald-300"
                    : m.status === "in_progress"
                    ? "bg-amber-50/30 border-amber-300"
                    : "bg-background border-border hover:border-accent"
                }`}
              >
                {/* Status Indicator Icon */}
                <div className="mt-0.5 shrink-0">
                  {m.status === "completed" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  )}
                  {m.status === "in_progress" && (
                    <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                  )}
                  {m.status === "pending" && (
                    <Circle className="w-5 h-5 text-muted-foreground/40" />
                  )}
                </div>

                {/* Milestone Details */}
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-foreground">
                      {m.step || idx + 1}. {m.title}
                    </h4>
                    {m.duration && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {m.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}