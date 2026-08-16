// frontend/src/app/interview/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import UpgradeProModal from "@/components/pro/UpgradeProModal";
import { getProStatus } from "@/lib/proStatus";
import { useUser } from "@clerk/nextjs";
import {
  Sparkles,
  Lightbulb,
  Send,
  Loader2,
  Award,
  RefreshCw,
  Clock,
  Code2,
  ArrowRight,
  Crown,
  Lock,
  CheckCircle2,
  BrainCircuit,
  Zap,
  Target,
} from "lucide-react";

const INTERVIEW_ROLES = [
  "Full Stack Engineer",
  "Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "AI / ML Specialist",
  "DevOps Architect",
];

const DEFAULT_QUESTIONS: Record<string, string> = {
  "Full Stack Engineer":
    "How would you design a rate-limiting middleware for a Next.js application that handles 50,000 requests per minute without overloading your primary PostgreSQL database?",
  "Software Engineer":
    "Explain the internal implementation of a Hash Table, including collision resolution techniques (Chaining vs Open Addressing) and asymptotic time complexities.",
  "Frontend Engineer":
    "How do Virtual DOM diffing algorithms work in React, and how can you leverage React 19 server components to minimize client-side bundle size?",
  "Backend Engineer":
    "What are the key differences between ACID transactions in SQL and Eventual Consistency in NoSQL databases? How do you maintain data consistency in microservices?",
  "AI / ML Specialist":
    "Explain how self-attention mechanisms work in Transformer architectures and how multi-head attention improves feature extraction for LLMs.",
  "DevOps Architect":
    "How do you implement zero-downtime rolling deployments using Kubernetes ingress controllers and automated canary releases?",
};

export default function InterviewPage() {
  const { user } = useUser();
  const [role, setRole] = useState(INTERVIEW_ROLES[0]);
  const [question, setQuestion] = useState(DEFAULT_QUESTIONS[INTERVIEW_ROLES[0]]);
  const [answer, setAnswer] = useState("");
  const [fetchingQuestion, setFetchingQuestion] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string;
  } | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const userId = user?.id || user?.primaryEmailAddress?.emailAddress;

  const checkProStatus = () => {
    setIsPro(getProStatus(userId));
  };

  useEffect(() => {
    checkProStatus();
    window.addEventListener("pro_status_updated", checkProStatus);
    return () => window.removeEventListener("pro_status_updated", checkProStatus);
  }, [userId]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setQuestion(DEFAULT_QUESTIONS[newRole] || DEFAULT_QUESTIONS["Software Engineer"]);
    setAnswer("");
    setEvaluation(null);
  };

  const handleFetchNextQuestion = async () => {
    setFetchingQuestion(true);
    setEvaluation(null);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.question) {
          setQuestion(data.question);
        }
      }
    } catch (err) {
      console.error("Fetch question error:", err);
      setQuestion(DEFAULT_QUESTIONS[role] || DEFAULT_QUESTIONS["Software Engineer"]);
    } finally {
      setFetchingQuestion(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || evaluating) return;

    setEvaluating(true);
    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, targetRole: role }),
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluation({
          score: typeof data.score === "number" ? data.score : 15,
          feedback: data.feedback || "Solid response demonstrating core technical principles and clear problem-solving rationale.",
        });
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setEvaluation({
        score: 15,
        feedback: "Your response could not be properly scored. Please retry with a detailed explanation.",
      });
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 p-3 sm:p-6">
        {/* Mesh Glow Hero Banner matching Dashboard */}
        <div className="relative z-30 rounded-3xl bg-gradient-to-br from-card via-card/95 to-emerald-950/30 border border-emerald-500/30 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-28 -right-28 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-mono font-semibold">
                <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" /> Real-Time AI Technical Mock Simulator
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground flex items-center gap-3">
                Mock Technical Interview Simulator
                {isPro && (
                  <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-300" /> PRO UNLOCKED
                  </span>
                )}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Practice role-specific technical questions, type your explanation, and get instant AI scoring with recruiter feedback.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!isPro && (
                <button
                  onClick={() => setIsUpgradeOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition duration-300 cursor-pointer"
                >
                  <Crown className="w-4 h-4" /> Unlock PRO Unlimited Questions
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Role Selection Pills */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" /> Select Target Technical Role
          </label>
          <div className="flex border-b border-border/80 gap-2 overflow-x-auto pb-2">
            {INTERVIEW_ROLES.map((r) => {
              const isActive = role === r;
              return (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-300 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-950/20"
                      : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {role} Interview Question
            </span>
            <button
              onClick={handleFetchNextQuestion}
              disabled={fetchingQuestion}
              className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchingQuestion ? "animate-spin text-emerald-400" : ""}`} />
              Next Question
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground leading-relaxed">
            {question}
          </h2>
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmitAnswer} className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-400" /> Type Your Explanation & Architecture Strategy
          </label>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            placeholder="Explain your technical strategy step-by-step, including data structures, algorithmic complexity, trade-offs, and edge cases..."
            className="w-full bg-background border border-border/80 rounded-2xl p-4 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={evaluating || !answer.trim()}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg shadow-emerald-950/20 transition flex items-center gap-2 cursor-pointer"
            >
              {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {evaluating ? "Evaluating Strategy..." : "Submit Answer for AI Evaluation"}
            </button>
          </div>
        </form>

        {/* AI Evaluation Results */}
        {evaluation && (
          <div className="bg-card border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4 bg-gradient-to-br from-card via-card to-emerald-950/20">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="font-heading font-bold text-lg text-foreground">AI Technical Evaluation Score</h3>
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400">{evaluation.score} / 100</div>
            </div>

            <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-muted/20 p-4 rounded-2xl border border-border/60">
              <b className="text-emerald-400 block mb-1">Recruiter & AI Feedback:</b>
              {evaluation.feedback}
            </div>
          </div>
        )}
      </div>

      <UpgradeProModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </AppShell>
  );
}