// frontend/src/components/learning/RecommendationExplainerModal.tsx
"use client";

import React, { useState } from "react";
import { Sparkles, X, Loader2, BookOpen, CheckCircle, Lightbulb, Send } from "lucide-react";
import { LearnerProfile } from "@/types/learningPath";

interface ExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    provider?: string;
    whyRecommended?: string;
    matchScore?: number;
    skillsCovered?: string[];
  } | null;
  profile: LearnerProfile;
}

export default function RecommendationExplainerModal({
  isOpen,
  onClose,
  item,
  profile,
}: ExplainerModalProps) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState("");

  if (!isOpen || !item) return null;

  const fetchAIExplanation = async (customQuery?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/learning-path/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendationItem: item,
          userProfile: profile,
          userQuery: customQuery || userQuery,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExplanation(data.explanation);
        setStudyPlan(data.suggestedStudyPlan);
      }
    } catch (e) {
      console.error("AI Explain error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border/80 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Explainer
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground">{item.title}</h3>
            {item.provider && <p className="text-xs text-muted-foreground mt-0.5">{item.provider}</p>}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Why Recommended Base Rationale */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
              Match Confidence
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {item.matchScore || 95}% Match
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs text-foreground/90 leading-relaxed">
            <span className="font-bold text-emerald-400 block mb-1">Direct Profile Alignment:</span>
            {item.whyRecommended ||
              "Recommended because it targets your missing core competency requirements for your target role."}
          </div>
        </div>

        {/* Deep AI Detailed Breakdown */}
        {explanation ? (
          <div className="space-y-3 border-t border-border pt-4 text-xs">
            <div>
              <h4 className="font-mono font-bold text-emerald-400 uppercase text-[11px] flex items-center gap-1.5 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Deep AI Analysis
              </h4>
              <p className="text-foreground/90 leading-relaxed bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-500/20">
                {explanation}
              </p>
            </div>

            {studyPlan && (
              <div>
                <h4 className="font-mono font-bold text-blue-400 uppercase text-[11px] flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Suggested Execution Plan
                </h4>
                <p className="text-foreground/90 leading-relaxed bg-blue-950/20 p-3.5 rounded-2xl border border-blue-500/20">
                  {studyPlan}
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => fetchAIExplanation()}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Analyzing Profile Gap..." : "Generate Deep AI Breakdown & Study Plan"}
          </button>
        )}

        {/* Ask Question to AI */}
        <div className="border-t border-border pt-4 space-y-2">
          <label className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
            Ask AI specific questions about this resource
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchAIExplanation()}
              placeholder="e.g., How does this prepare me for system design interviews?"
              className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => fetchAIExplanation()}
              disabled={loading || !userQuery.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
