// frontend/src/app/roadmap/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  HelpCircle,
  Briefcase,
  Compass,
  Zap,
  BarChart3,
  Bot,
  Send,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  LearnerProfile,
  StructuredLearningPath,
  LearningPhase,
  CourseRecommendation,
  ProjectRecommendation,
  ResourceRecommendation,
} from "@/types/learningPath";
import {
  loadStoredProfile,
  saveStoredProfile,
  loadStoredLearningPath,
  saveStoredLearningPath,
  FALLBACK_COURSES,
  FALLBACK_PROJECTS,
  FALLBACK_RESOURCES,
} from "@/lib/learningPathEngine";
import SkillRadarChart from "@/components/learning/SkillRadarChart";
import RecommendationExplainerModal from "@/components/learning/RecommendationExplainerModal";
import PathAdaptModal from "@/components/learning/PathAdaptModal";
import QuizModal from "@/components/learning/QuizModal";

export default function LearningPathPage() {
  const [activeTab, setActiveTab] = useState<"path" | "recommendations" | "skillgaps" | "assistant">("path");
  const [profile, setProfile] = useState<LearnerProfile>(loadStoredProfile());
  const [learningPath, setLearningPath] = useState<StructuredLearningPath | null>(loadStoredLearningPath());
  const [generating, setGenerating] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [activeStep, setActiveStep] = useState<number>(1);

  // Recommendations state
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
        "Hello! I am your AI Learning Path Assistant. Describe your career goals, weekly time commitment, or learning style in natural language, and I will generate a custom structured roadmap and recommendations for you!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Load initial stored state
  useEffect(() => {
    const p = loadStoredProfile();
    setProfile(p);
    const path = loadStoredLearningPath();
    if (path) {
      setLearningPath(path);
    } else {
      handleGenerateInitialPath(p);
    }
    handleFetchRecommendations(p);
  }, []);

  const handleGenerateInitialPath = async (prof: LearnerProfile) => {
    setGenerating(true);
    try {
      const res = await fetch("/api/learning-path/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: prof }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.path) {
          setLearningPath(data.path);
          saveStoredLearningPath(data.path);
        }
      }
    } catch (e) {
      console.error("Path gen error:", e);
    } finally {
      setGenerating(false);
    }
  };

  const handleFetchRecommendations = async (prof: LearnerProfile) => {
    try {
      const res = await fetch("/api/learning-path/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: prof }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.courses) setCourses(data.courses);
        if (data.projects) setProjects(data.projects);
        if (data.resources) setResources(data.resources);
      }
    } catch (e) {
      console.error("Fetch rec error:", e);
    }
  };

  const handleNaturalLanguageConverse = async (text?: string) => {
    const query = text || promptInput;
    if (!query.trim() || generating) return;

    setGenerating(true);
    try {
      const converseRes = await fetch("/api/learning-path/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: query, currentProfile: profile }),
      });

      if (converseRes.ok) {
        const data = await converseRes.json();

        // Update profile with extracted intent
        if (data.extractedProfileUpdates) {
          const updated: LearnerProfile = {
            ...profile,
            targetGoal: data.extractedProfileUpdates.targetGoal || profile.targetGoal,
            preferences: {
              ...profile.preferences,
              ...(data.extractedProfileUpdates.preferences || {}),
            },
          };
          setProfile(updated);
          saveStoredProfile(updated);

          // Generate new path and recommendations
          await handleGenerateInitialPath(updated);
          await handleFetchRecommendations(updated);
        }
      }
    } catch (e) {
      console.error("Converse error:", e);
    } finally {
      setGenerating(false);
      setPromptInput("");
    }
  };

  const togglePhaseStatus = (stepNumber: number) => {
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
  };

  const handleSendAssistantChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/learning-path/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: msg, currentProfile: profile }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "I've tailored your recommendations." },
      ]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try asking again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const completedPhases = learningPath?.phases.filter((p) => p.status === "completed").length || 0;
  const totalPhases = learningPath?.phases.length || 4;
  const progressPercent = Math.round((completedPhases / totalPhases) * 100);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6 p-2 sm:p-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Zap className="w-3.5 h-3.5" /> AI-Powered Personalized Learning Path Recommender
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
              Learning Path & Recommendations
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Describe your target career goals in natural language to generate custom roadmap milestones, course recommendations, and AI gap analyses.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-card border border-border/80 px-5 py-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase">Path Mastery</div>
                <div className="text-base font-bold text-foreground">{progressPercent}% Completed</div>
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase">Target Goal</div>
              <div className="text-xs font-bold text-emerald-400 truncate max-w-[130px]">
                {profile.targetGoal}
              </div>
            </div>
          </div>
        </div>

        {/* Conversational Natural Language Goal Bar */}
        <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-xl space-y-3">
          <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-foreground">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Natural Language Goal Description
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              e.g. "I want to become an AI Engineer in 6 months, 12 hrs/week..."
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNaturalLanguageConverse()}
              placeholder="Describe your goal, learning preferences, or target position in plain English..."
              className="flex-1 bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            <button
              onClick={() => handleNaturalLanguageConverse()}
              disabled={generating || !promptInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
              {generating ? "AI Thinking..." : "Generate AI Path"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border/80 gap-2 overflow-x-auto pb-1">
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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
            <div className="flex items-center justify-between bg-card/60 p-4 rounded-2xl border border-border/70">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-mono text-muted-foreground">Pace: <b className="text-foreground">{learningPath?.learningPace || profile.preferences.pace}</b></span>
                <span className="h-3 w-px bg-border" />
                <span className="font-mono text-muted-foreground">Commitment: <b className="text-foreground">{profile.preferences.hoursPerWeek} hrs/week</b></span>
                <span className="h-3 w-px bg-border" />
                <span className="font-mono text-emerald-400 font-bold">{learningPath?.matchScore || 95}% Profile Match</span>
              </div>

              <button
                onClick={() => setIsAdaptModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-accent text-foreground text-xs font-semibold flex items-center gap-1.5 border border-border transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Adapt Path with AI
              </button>
            </div>

            {/* AI Summary Banner */}
            {learningPath?.aiSummary && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-foreground/90 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-emerald-400 block mb-0.5">AI Path Rationale:</span>
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
                        className={`relative pl-14 pr-5 py-5 rounded-2xl border transition-all cursor-pointer ${
                          isActive
                            ? "bg-card border-emerald-500/50 shadow-xl ring-1 ring-emerald-500/30"
                            : "bg-card/60 border-border/70 hover:border-border hover:bg-card"
                        }`}
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePhaseStatus(p.step);
                          }}
                          className={`absolute left-3 top-5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 cursor-pointer ${
                            isDone
                              ? "bg-emerald-500 text-white shadow-md"
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
                            <h3 className="text-base font-heading font-bold text-foreground">{p.title}</h3>
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
                              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
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
                    className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition"
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
                        href={course.url || "#"}
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
                    className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between hover:border-blue-500/40 transition"
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
                  Visualizing your current proficiency levels vs target role requirements.
                </p>
              </div>

              <SkillRadarChart knownSkills={profile.knownSkills} targetSkills={profile.targetSkills} />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Skill Gaps Identified ({profile.skillGaps.length})
              </h3>

              <div className="space-y-3">
                {profile.skillGaps.map((gap, idx) => (
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
                    className={`p-4 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
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
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
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