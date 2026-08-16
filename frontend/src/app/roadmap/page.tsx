// frontend/src/app/roadmap/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Clock,
  Target,
  Layers,
  Loader2,
  ChevronRight,
  Code2,
  Trophy,
  Award,
  Sliders,
  Compass,
  Zap,
  BarChart3,
  Bot,
  Send,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  GraduationCap,
  Flame,
  Check,
} from "lucide-react";
import {
  LearnerProfile,
  StructuredLearningPath,
  LearningPhase,
  CourseRecommendation,
  ProjectRecommendation,
  ResourceRecommendation,
} from "@/types/learningPath";
import {
  DEFAULT_PROFILE,
  FALLBACK_COURSES,
  FALLBACK_PROJECTS,
  FALLBACK_RESOURCES,
  loadStoredProfile,
  saveStoredProfile,
  loadStoredLearningPath,
  saveStoredLearningPath,
  getRoleTailoredRecommendations,
  getRoleTargetSkills,
  calculateSkillGaps,
} from "@/lib/learningPathEngine";
import SkillRadarChart from "@/components/learning/SkillRadarChart";
import RecommendationExplainerModal from "@/components/learning/RecommendationExplainerModal";
import PathAdaptModal from "@/components/learning/PathAdaptModal";
import QuizModal from "@/components/learning/QuizModal";

export default function LearningPathPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"path" | "recommendations" | "skillgaps" | "assistant">("path");

  // Baseline state matching SSR defaults to guarantee zero hydration mismatch
  const [profile, setProfile] = useState<LearnerProfile>(DEFAULT_PROFILE);
  const [learningPath, setLearningPath] = useState<StructuredLearningPath | null>(null);
  const [generating, setGenerating] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [activeStep, setActiveStep] = useState<number>(1);

  // Recommendations state matching standard defaults
  const [courses, setCourses] = useState<CourseRecommendation[]>(FALLBACK_COURSES);
  const [projects, setProjects] = useState<ProjectRecommendation[]>(FALLBACK_PROJECTS);
  const [resources, setResources] = useState<ResourceRecommendation[]>(FALLBACK_RESOURCES);

  // Modals state
  const [explainerModalItem, setExplainerModalItem] = useState<any | null>(null);
  const [isAdaptModalOpen, setIsAdaptModalOpen] = useState(false);
  const [quizModalPhase, setQuizModalPhase] = useState<LearningPhase | null>(null);

  // Conversational Assistant state
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Welcome to your AI Learning Path Assistant! Describe your target position, weekly time commitment, or learning style, and I will tailor your custom learning path.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Safe API helper that never throws JSON syntax errors or breaks React state
  const safeFetchJson = async (url: string, body: any) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      }
      return null;
    } catch (e) {
      console.warn("Safe fetch JSON error:", e);
      return null;
    }
  };

  // Load client stored state ONLY AFTER MOUNTING to guarantee 100% SSR-client hydration match
  useEffect(() => {
    setMounted(true);
    const p = loadStoredProfile();
    setProfile(p);

    const currentStoredPath = loadStoredLearningPath();
    if (currentStoredPath) {
      setLearningPath(currentStoredPath);
    } else {
      safeFetchJson("/api/learning-path/generate", { profile: p }).then((data) => {
        if (data && data.path) {
          setLearningPath(data.path);
          saveStoredLearningPath(data.path);
        }
      });
    }

    const roleRecs = getRoleTailoredRecommendations(p.targetGoal || "Software Engineer");
    setCourses(roleRecs.courses);
    setProjects(roleRecs.projects);
    setResources(roleRecs.resources);
  }, []);

  // Explicit user trigger for generating path from prompt / role search
  const handleNaturalLanguageConverse = useCallback(
    async (text?: string) => {
      const query = text || promptInput;
      if (!query.trim() || generating) return;

      setGenerating(true);

      // Infer role from query
      let updatedTargetRole = profile.targetGoal;
      if (query.toLowerCase().includes("software engineer") || query.toLowerCase().includes("sde")) {
        updatedTargetRole = "Software Engineer";
      } else if (query.toLowerCase().includes("frontend")) {
        updatedTargetRole = "Frontend Engineer";
      } else if (query.toLowerCase().includes("data")) {
        updatedTargetRole = "Data Scientist";
      } else if (query.toLowerCase().includes("ai") || query.toLowerCase().includes("machine learning")) {
        updatedTargetRole = "AI Engineer";
      } else if (query.toLowerCase().includes("devops") || query.toLowerCase().includes("cloud")) {
        updatedTargetRole = "DevOps Architect";
      } else {
        updatedTargetRole = query.trim();
      }

      // Update role-tailored recommendations immediately
      const roleRecs = getRoleTailoredRecommendations(updatedTargetRole);
      setCourses(roleRecs.courses);
      setProjects(roleRecs.projects);
      setResources(roleRecs.resources);

      const newTargetSkills = getRoleTargetSkills(updatedTargetRole);
      const updatedProfile: LearnerProfile = {
        ...profile,
        targetGoal: updatedTargetRole,
        targetSkills: newTargetSkills,
      };

      updatedProfile.skillGaps = calculateSkillGaps(updatedProfile);
      setProfile(updatedProfile);
      saveStoredProfile(updatedProfile);

      // Call generate API
      const data = await safeFetchJson("/api/learning-path/generate", { profile: updatedProfile });
      if (data && data.path) {
        setLearningPath(data.path);
        saveStoredLearningPath(data.path);
      }

      setGenerating(false);
      setPromptInput("");
    },
    [promptInput, generating, profile]
  );

  const togglePhaseStatus = useCallback(
    (stepNumber: number) => {
      if (!learningPath) return;

      const updatedPhases = learningPath.phases.map((p) => {
        if (p.step === stepNumber) {
          const nextStatus =
            p.status === "completed" ? "in_progress" : p.status === "in_progress" ? "pending" : "completed";
          return { ...p, status: nextStatus };
        }
        return p;
      });

      const updatedPath: StructuredLearningPath = {
        ...learningPath,
        phases: updatedPhases as any,
      };

      setLearningPath(updatedPath);
      saveStoredLearningPath(updatedPath);
    },
    [learningPath]
  );

  const handleSendAssistantChat = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);

    const data = await safeFetchJson("/api/learning-path/converse", {
      userPrompt: msg,
      currentProfile: profile,
    });

    if (data && data.reply) {
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } else {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: `I've analyzed your request for ${profile.targetGoal} and tailored your recommendations!` },
      ]);
    }
    setChatLoading(false);
  }, [chatInput, chatLoading, profile]);

  const completedPhases = useMemo(
    () => (learningPath?.phases || []).filter((p) => p.status === "completed").length,
    [learningPath]
  );
  const totalPhases = useMemo(() => learningPath?.phases?.length || 4, [learningPath]);
  const progressPercent = useMemo(
    () => (mounted ? Math.round((completedPhases / totalPhases) * 100) : 0),
    [completedPhases, totalPhases, mounted]
  );

  const skillGapsCount = useMemo(() => calculateSkillGaps(profile).length, [profile]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8 p-3 sm:p-6">
        {/* Decorative Hero Mesh Glow Banner matching Dashboard */}
        <div className="relative z-30 rounded-3xl bg-gradient-to-br from-card via-card/95 to-emerald-950/30 border border-emerald-500/30 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-28 -right-28 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-mono font-semibold">
                  <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" /> AI Personalized Learning Path Engine v2.0
                </div>
                {/* Prominent Large Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground leading-tight">
                  Learning Path & Recommendations
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
                  Interactive multi-phase milestone roadmaps, real course recommendations, portfolio projects, and AI skill gap matrices tailored specifically to your career goals.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsAdaptModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border hover:border-emerald-500/50 text-foreground text-xs sm:text-sm font-bold shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-emerald-400" /> Adapt Roadmap
                </button>
              </div>
            </div>

            {/* Natural Language Goal Input Bar inside Hero */}
            <div className="bg-card/90 border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-3">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-foreground">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Target Position & Career Goal Input
                </span>
                <span className="text-[11px] text-muted-foreground font-normal hidden sm:inline">
                  e.g. "Software Engineer", "Frontend Developer", "Data Scientist", or "AI Engineer"
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNaturalLanguageConverse()}
                  placeholder="Type your target role (e.g. Software Engineer, AI Engineer) to generate dynamic paths..."
                  className="flex-1 bg-background border border-border/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
                />

                <button
                  onClick={() => handleNaturalLanguageConverse()}
                  disabled={generating || !promptInput.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-950/30 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
                  {generating ? "Generating AI Path..." : "Generate AI Path"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Decorative Dashboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Path Mastery */}
          <div className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-emerald-500/50 p-5 shadow-xl space-y-3 backdrop-blur-md group transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
            <div className="flex justify-between items-center text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Path Mastery</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Trophy className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-extrabold text-foreground font-mono tracking-tight flex items-baseline gap-2" suppressHydrationWarning>
              <span>{mounted ? `${progressPercent}%` : "0%"}</span>
              <span className="text-xs text-muted-foreground font-normal">Completed</span>
            </div>

            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground flex justify-between">
                <span>{completedPhases} of {totalPhases} Phases</span>
                <span className="text-emerald-400 font-bold">{learningPath?.matchScore || 95}% Match</span>
              </div>
            </div>
          </div>

          {/* Card 2: Target Career Goal */}
          <div className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-blue-500/50 p-5 shadow-xl space-y-3 backdrop-blur-md group transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
            <div className="flex justify-between items-center text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Target Role</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Target className="w-4 h-4" />
              </div>
            </div>

            <div className="text-lg font-bold text-blue-400 truncate" suppressHydrationWarning>
              {mounted ? profile.targetGoal : "Software Engineer"}
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              Level: <b className="text-foreground">{profile.experienceLevel}</b>
            </div>
          </div>

          {/* Card 3: Study Commitment */}
          <div className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-purple-500/50 p-5 shadow-xl space-y-3 backdrop-blur-md group transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all" />
            <div className="flex justify-between items-center text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Weekly Pace</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-extrabold text-purple-400 font-mono tracking-tight">
              {profile.preferences.hoursPerWeek} <span className="text-xs font-normal text-muted-foreground">hrs/week</span>
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              Style: <b className="text-foreground">{profile.preferences.style}</b>
            </div>
          </div>

          {/* Card 4: Identified Skill Gaps */}
          <div className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-amber-500/50 p-5 shadow-xl space-y-3 backdrop-blur-md group transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
            <div className="flex justify-between items-center text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Identified Gaps</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
              {skillGapsCount} <span className="text-xs font-normal text-muted-foreground">Skills</span>
            </div>

            <button
              onClick={() => setActiveTab("skillgaps")}
              className="text-xs text-amber-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              View Radar Matrix <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Decorative Interactive Navigation Tabs */}
        <div className="flex border-b border-border/80 gap-3 overflow-x-auto pb-2">
          {[
            { id: "path", label: "Structured Roadmap", icon: Layers },
            { id: "recommendations", label: "AI Recommended Resources", icon: BookOpen, badge: `${courses.length + projects.length}` },
            { id: "skillgaps", label: "Skill Gap & Radar Matrix", icon: BarChart3 },
            { id: "assistant", label: "AI Explainer & Assistant", icon: Bot, badge: "AI" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-950/20"
                    : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    suppressHydrationWarning
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: STRUCTURED ROADMAP */}
        {activeTab === "path" && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between bg-card/80 p-4 rounded-2xl border border-border/80 shadow-md">
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="font-mono text-muted-foreground">Pace: <b className="text-foreground">{learningPath?.learningPace || profile.preferences.pace}</b></span>
                <span className="h-3 w-px bg-border" />
                <span className="font-mono text-muted-foreground">Commitment: <b className="text-foreground">{profile.preferences.hoursPerWeek} hrs/week</b></span>
                <span className="h-3 w-px bg-border" />
                <span className="font-mono text-emerald-400 font-bold">{learningPath?.matchScore || 95}% Profile Match</span>
              </div>

              <button
                onClick={() => setIsAdaptModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-secondary hover:bg-accent text-foreground text-xs font-semibold flex items-center gap-1.5 border border-border transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Adapt Path with AI
              </button>
            </div>

            {/* AI Summary Banner */}
            {learningPath?.aiSummary && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs sm:text-sm text-foreground/90 flex items-start gap-3 shadow-lg">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="leading-relaxed">
                  <span className="font-bold text-emerald-400 block mb-0.5">AI Path Strategy:</span>
                  {learningPath.aiSummary}
                </div>
              </div>
            )}

            {/* Grid Layout: Timeline + Phase Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Timeline list */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-border/60">
                  {learningPath?.phases.map((p) => {
                    const isActive = activeStep === p.step;
                    const isDone = p.status === "completed";
                    const isInProgress = p.status === "in_progress";

                    return (
                      <div
                        key={p.step}
                        onClick={() => setActiveStep(p.step)}
                        className={`relative pl-14 pr-5 py-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "bg-card border-emerald-500/60 shadow-xl ring-1 ring-emerald-500/40"
                            : "bg-card/70 border-border/70 hover:border-border hover:bg-card"
                        }`}
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePhaseStatus(p.step);
                          }}
                          className={`absolute left-3 top-5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 cursor-pointer ${
                            isDone
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-950/40"
                              : isInProgress
                              ? "bg-amber-500 text-white shadow-md"
                              : "bg-secondary text-muted-foreground border border-border"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : p.step}
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                                Phase {p.step}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {p.duration}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-heading font-bold text-foreground">{p.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
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
              <div className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-5 sticky top-6">
                {learningPath?.phases.find((p) => p.step === activeStep) ? (
                  (() => {
                    const current = learningPath.phases.find((p) => p.step === activeStep)!;
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
                            onClick={() => togglePhaseStatus(current.step)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
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
                          {/* Prerequisites */}
                          {current.prerequisites && current.prerequisites.length > 0 && (
                            <div>
                              <h4 className="font-mono uppercase text-[11px] text-muted-foreground mb-1 font-bold">
                                Prerequisites
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {current.prerequisites.map((prereq, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-1 rounded-lg bg-secondary text-foreground border border-border/60 text-[11px] font-medium"
                                  >
                                    {prereq}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Topics */}
                          <div className="space-y-2">
                            <h4 className="font-mono uppercase text-[11px] text-muted-foreground flex items-center gap-1.5 font-bold">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Key Topics to Master
                            </h4>
                            <div className="space-y-1.5">
                              {current.topics?.map((topic, i) => (
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
                          <div className="space-y-2 pt-1">
                            <h4 className="font-mono uppercase text-[11px] text-muted-foreground flex items-center gap-1.5 font-bold">
                              <Code2 className="w-3.5 h-3.5 text-blue-400" /> Milestone Project Challenge
                            </h4>
                            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-foreground/90 leading-relaxed">
                              {current.projectIdea || "Build a real-world project demonstrating phase mastery."}
                            </div>
                          </div>

                          {/* Quiz Button */}
                          <div className="pt-2">
                            <button
                              onClick={() => setQuizModalPhase(current)}
                              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/30"
                            >
                              <Award className="w-4 h-4" /> Take Milestone Assessment Quiz
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <p className="text-xs text-muted-foreground">Select a phase to view detailed learning goals.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI RECOMMENDED RESOURCES */}
        {activeTab === "recommendations" && (
          <div className="space-y-8">
            {/* Courses Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" /> Tailored Courses ({courses.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition duration-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {course.category || "Recommended"}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">{course.matchScore}% Match</span>
                      </div>

                      <h3 className="font-heading font-bold text-base text-foreground leading-snug">{course.title}</h3>
                      <p className="text-xs text-muted-foreground">{course.provider} • {course.duration}</p>

                      <p className="text-xs text-foreground/90 bg-muted/20 p-3 rounded-xl border border-border/40 leading-relaxed">
                        <b className="text-emerald-400">Why Recommended: </b>{course.whyRecommended}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setExplainerModalItem(course)}
                        className="flex-1 py-2 rounded-xl bg-secondary hover:bg-accent text-foreground text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border border-border"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Why Recommended?
                      </button>

                      <a
                        href={course.url || "https://www.coursera.org"}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        Enroll ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hands-On Portfolio Projects Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" /> Recommended Portfolio Projects ({projects.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between hover:border-blue-500/40 transition duration-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {proj.difficulty} • ~{proj.estimatedHours} Hours
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-400">{proj.matchScore}% Match</span>
                      </div>

                      <h3 className="font-heading font-bold text-base text-foreground leading-snug">{proj.title}</h3>
                      <p className="text-xs text-muted-foreground">{proj.description}</p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.techStack.map((tech, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setExplainerModalItem(proj)}
                        className="w-full py-2 rounded-xl bg-secondary hover:bg-accent text-foreground text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border border-border"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" /> AI Explainer & Project Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SKILL GAP & RADAR MATRIX */}
        {activeTab === "skillgaps" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">Skill Competency Radar Matrix</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Visualizing your current proficiency levels vs target role requirements for {profile.targetGoal}.
                </p>
              </div>

              <SkillRadarChart knownSkills={profile.knownSkills} targetSkills={profile.targetSkills} />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Skill Gaps Identified ({calculateSkillGaps(profile).length})
              </h3>

              <div className="space-y-3">
                {calculateSkillGaps(profile).map((gap, idx) => (
                  <div key={idx} className="bg-card border border-border/80 rounded-2xl p-4 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-foreground">{gap.skill}</h4>
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          gap.gapSeverity === "Critical"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : gap.gapSeverity === "Moderate"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {gap.gapSeverity} Gap
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">{gap.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI ASSISTANT & CHAT */}
        {activeTab === "assistant" && (
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4 max-w-4xl mx-auto h-[600px] flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl max-w-[80%] text-xs sm:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white font-medium rounded-br-none"
                        : "bg-muted/40 border border-border/60 text-foreground rounded-bl-none whitespace-pre-wrap"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>AI assistant is formulating recommendations...</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2 border-t border-border">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAssistantChat()}
                placeholder="Ask anything about your roadmap, prerequisites, or learning strategy..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleSendAssistantChat}
                disabled={chatLoading || !chatInput.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 rounded-xl transition flex items-center justify-center cursor-pointer font-bold text-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <RecommendationExplainerModal
        isOpen={!!explainerModalItem}
        onClose={() => setExplainerModalItem(null)}
        item={explainerModalItem}
        profile={profile}
      />

      <PathAdaptModal
        isOpen={isAdaptModalOpen}
        onClose={() => setIsAdaptModalOpen(false)}
        currentPath={learningPath}
        onPathAdapted={(newPath) => {
          setLearningPath(newPath);
          saveStoredLearningPath(newPath);
        }}
      />

      <QuizModal
        isOpen={!!quizModalPhase}
        onClose={() => setQuizModalPhase(null)}
        quiz={quizModalPhase?.quiz}
        onPassQuiz={() => {
          if (quizModalPhase) {
            togglePhaseStatus(quizModalPhase.step);
          }
        }}
      />
    </AppShell>
  );
}