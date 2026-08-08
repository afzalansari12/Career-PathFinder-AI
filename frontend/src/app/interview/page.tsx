// frontend/src/app/interview/page.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

interface Feedback {
  overallScore: number;
  technicalAccuracyScore: number;
  communicationScore: number;
  strengths: string[];
  areasToImprove: string[];
  modelAnswer: string;
}

export default function InterviewPage() {
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [currentQuestion, setCurrentQuestion] = useState(
    "How would you design a rate limiter for an API endpoint handling 100,000 requests per second in Next.js?"
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          answer: userAnswer,
          targetRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(data.evaluation);
      }
    } catch (err) {
      console.error("Failed to submit answer:", err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-2">
            AI Interview Simulator
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white">Technical Practice</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time evaluation across technical depth, system trade-offs, and structure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Question & Answer Panel */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-neutral-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Active Scenario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-white font-medium leading-relaxed bg-black/40 p-4 rounded-lg border border-white/5">
                {currentQuestion}
              </p>

              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-400">YOUR RESPONSE</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Explain your approach, architecture, data models, or STAR response..."
                  rows={10}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-xs text-neutral-300 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                />
              </div>

              <Button
                onClick={handleSubmitAnswer}
                disabled={evaluating || !userAnswer.trim()}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium h-10"
              >
                {evaluating ? "Analyzing Response..." : "Submit Response for Evaluation"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Panel */}
        <div className="lg:col-span-6 space-y-6">
          {!feedback ? (
            <Card className="bg-neutral-900/20 border-white/5 h-full flex flex-col justify-center items-center p-12 text-center">
              <Sparkles className="w-10 h-10 text-neutral-600 mb-4 animate-pulse" />
              <h3 className="text-neutral-300 font-medium text-sm">Awaiting Submission</h3>
              <p className="text-neutral-500 text-xs max-w-sm mt-1">
                Complete your response on the left to receive automated breakdown scores and targeted feedback.
              </p>
            </Card>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="bg-neutral-900/80 border-white/10 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-mono text-neutral-400 uppercase">Evaluation Score</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-5xl font-extrabold text-white">{feedback.overallScore}</span>
                      <span className="text-neutral-500 text-sm font-mono">/ 100</span>
                    </div>
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                    Evaluated
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-mono block">TECHNICAL ACCURACY</span>
                    <span className="text-sm font-semibold text-white">{feedback.technicalAccuracyScore}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-mono block">COMMUNICATION</span>
                    <span className="text-sm font-semibold text-white">{feedback.communicationScore}%</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-neutral-900/50 border-white/10 p-4 space-y-3">
                <span className="text-xs font-mono text-emerald-400 block flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Key Strengths
                </span>
                <ul className="space-y-1 text-xs text-neutral-300 list-disc list-inside">
                  {feedback.strengths.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-neutral-900/50 border-white/10 p-4 space-y-3">
                <span className="text-xs font-mono text-amber-400 block flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Suggested Refinements
                </span>
                <ul className="space-y-1 text-xs text-neutral-300 list-disc list-inside">
                  {feedback.areasToImprove.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}