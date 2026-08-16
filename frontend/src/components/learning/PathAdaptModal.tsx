// frontend/src/components/learning/PathAdaptModal.tsx
"use client";

import React, { useState } from "react";
import { Sparkles, X, Loader2, RefreshCw, Sliders } from "lucide-react";
import { StructuredLearningPath } from "@/types/learningPath";

interface PathAdaptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: StructuredLearningPath | null;
  onPathAdapted: (newPath: StructuredLearningPath) => void;
}

export default function PathAdaptModal({
  isOpen,
  onClose,
  currentPath,
  onPathAdapted,
}: PathAdaptModalProps) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !currentPath) return null;

  const QUICK_ADAPT_PROMPTS = [
    "Pace is too fast, reduce weekly hours commitment.",
    "Focus more on hands-on backend & database projects.",
    "Add more AI & LLM RAG microservices topics.",
    "I already know basic React, skip basic frontend fundamentals.",
  ];

  const handleAdapt = async (textToUse?: string) => {
    const text = textToUse || feedback;
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/learning-path/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: text, currentPath }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.path) {
          onPathAdapted(data.path);
          onClose();
        }
      }
    } catch (e) {
      console.error("Adapt path error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-1.5">
              <Sliders className="w-3.5 h-3.5" /> AI Path Adaptability Engine
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground">Adapt Roadmap to Your Feedback</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tell the AI how you want to adjust pace, skip topics, or change project priorities.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
            Quick Adjustment Presets
          </label>
          <div className="space-y-1.5">
            {QUICK_ADAPT_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setFeedback(promptText);
                  handleAdapt(promptText);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-secondary/50 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-border/50 text-xs text-foreground/90 transition flex items-center justify-between group cursor-pointer"
              >
                <span>{promptText}</span>
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom text feedback */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
            Custom Feedback / Request
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="Describe what you want changed (e.g. Make Phase 2 focus on Docker and Kubernetes instead of standard Next.js)..."
            className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => handleAdapt()}
          disabled={loading || !feedback.trim()}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "Re-structuring Roadmap..." : "Apply AI Path Adaptation"}
        </button>
      </div>
    </div>
  );
}
