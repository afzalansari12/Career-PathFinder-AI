"use client";

import AppShell from "@/components/layout/AppShell";
import { MessageSquare, Sparkles, Send, CheckCircle2 } from "lucide-react";

export default function InterviewPage() {
  return (
    <AppShell>
      {/* Top Header Bar */}
      <div className="-mt-6 -mx-6 lg:-mt-10 lg:-mx-10 border-b border-border bg-card px-6 py-3 mb-6 flex items-center justify-between shadow-2xs">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" /> AI Interview Simulator
        </span>
        <span className="text-xs font-bold text-muted-foreground">Session #104</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Assessment Sidebar */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-6 sticky top-6">
          <div>
            <h2 className="text-base font-heading font-bold text-foreground">
              Technical Practice
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">System Design & Trade-Offs</p>
          </div>

          <div className="p-4 bg-accent/40 border border-border rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-primary uppercase">Active Scenario</span>
            <p className="text-xs font-medium text-foreground leading-relaxed">
              How would you design a rate limiter for an API endpoint handling 100,000 requests per second in Next.js?
            </p>
          </div>
        </div>

        {/* Right Interactive Sheet */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-8 shadow-2xs space-y-6">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Candidate Response</h3>
          <textarea
            rows={10}
            placeholder="Detail your architecture, data structures (e.g. Redis sliding window), and trade-offs..."
            className="w-full bg-background border border-border rounded-xl p-4 text-xs text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none font-mono"
          />
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-2xs">
            <Send className="w-3.5 h-3.5" /> Submit Response for Evaluation
          </button>
        </div>
      </div>
    </AppShell>
  );
}