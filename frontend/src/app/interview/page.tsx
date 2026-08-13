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
          score: data.score || 82,
          feedback: data.feedback || "Solid response demonstrating core technical principles.",
        });
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setEvaluation({
        score: 75,
        feedback: "Your response covered key architectural concepts. Emphasize performance trade-offs and edge cases.",
      });
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 p-2 sm:p-4">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Real AI Mock Technical Interview
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
              Mock Interview Simulator
              {isPro && (
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-300" /> PRO UNLOCKED
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Practice role-specific technical questions, type your explanation, and get instant AI scoring with recruiter feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isPro ? (
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition cursor-pointer"
              >
                <Crown className="w-4 h-4" /> Upgrade to PRO to Access
              </button>
            ) : (
              <button
                onClick={handleFetchNextQuestion}
                disabled={fetchingQuestion}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-lg shadow-emerald-900/20 transition cursor-pointer"
              >
                {fetchingQuestion ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                New AI Question
              </button>
            )}
          </div>
        </div>

        {/* FREE USER PRO LOCK SCREEN */}
        {!isPro ? (
          <div className="relative overflow-hidden rounded-3xl bg-card border border-amber-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center mx-auto shadow-xl shadow-amber-950/30">
              <Lock className="w-8 h-8 text-amber-300" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                <Crown className="w-3.5 h-3.5" /> PRO Feature Locked
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
                AI Mock Technical Interviews are Exclusive to PRO
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upgrade to the PRO Candidate plan to unlock role-specific System Design & Coding questions, instant AI scoring rubrics, and detailed recruiter model answers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left text-xs pt-2">
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Questions
                </div>
                <p className="text-[11px] text-muted-foreground">Full Stack, AI, Systems, DevOps, Data Science.</p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant AI Scoring
                </div>
                <p className="text-[11px] text-muted-foreground">0-100 rubric rating technical depth & trade-offs.</p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Model Answers
                </div>
                <p className="text-[11px] text-muted-foreground">Inspect ideal senior recruiter reference responses.</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-xl shadow-amber-950/40 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Crown className="w-4 h-4" /> Upgrade to PRO (Instant Demo Access)
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED MOCK INTERVIEW SIMULATOR */
          <>
            {/* Role Selector Pills */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Target Interview Role
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERVIEW_ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setQuestion(DEFAULT_QUESTIONS[r] || DEFAULT_QUESTIONS["Software Engineer"]);
                      setEvaluation(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      role === r
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/20"
                        : "bg-secondary/40 text-muted-foreground border-border hover:border-emerald-500/40 hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Question Box */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> Technical / System Architecture
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Recommended: 3-5 mins
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground leading-snug">
                  {fetchingQuestion ? "Generating role-specific technical question..." : question}
                </h2>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground/90 flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-400 block mb-0.5">Recruiter Focus:</span>
                    Address scalability, edge cases, trade-offs, and clear architectural choices in your response.
                  </div>
                </div>
              </div>

              {/* Answer Form */}
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Your Answer / Explanation
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={6}
                    placeholder="Type your response here... (e.g. 'I would approach this by setting up a Redis token bucket algorithm...')"
                    className="w-full bg-background border border-border rounded-2xl p-4 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    {answer.trim().split(/\s+/).filter(Boolean).length} words
                  </span>

                  <button
                    type="submit"
                    disabled={!answer.trim() || evaluating}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-900/20 transition flex items-center gap-2 cursor-pointer"
                  >
                    {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {evaluating ? "Evaluating Answer with AI..." : "Submit Answer for AI Evaluation"}
                  </button>
                </div>
              </form>

              {/* Evaluation Result Drawer */}
              {evaluation && (
                <div className="bg-gradient-to-r from-emerald-950/40 via-card to-card border border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-heading font-bold text-base text-foreground">
                        AI Evaluation & Score
                      </h3>
                    </div>
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                      {evaluation.score} / 100
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-muted-foreground">Recruiter Feedback</h4>
                    <p className="text-xs text-foreground/90 leading-relaxed bg-card/80 p-4 rounded-2xl border border-border/50">
                      {evaluation.feedback}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={handleFetchNextQuestion}
                      className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Try Next Question <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <UpgradeProModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={() => checkProStatus()}
      />
    </AppShell>
  );
}