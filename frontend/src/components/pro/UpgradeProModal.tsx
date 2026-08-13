// frontend/src/components/pro/UpgradeProModal.tsx
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { setProStatus } from "@/lib/proStatus";
import {
  Crown,
  CheckCircle2,
  X,
  Check,
  ArrowRight,
  Zap,
} from "lucide-react";

interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UpgradeProModal({ isOpen, onClose, onSuccess }: UpgradeProModalProps) {
  const { user } = useUser();
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleMockUpgrade = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setIsSuccess(true);

      const userId = user?.id || user?.primaryEmailAddress?.emailAddress || "demo";
      setProStatus(userId, true);

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setIsSuccess(false);
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-card border border-emerald-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Glow backdrop effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/40">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-heading font-extrabold text-foreground">
                Upgraded to PRO Candidate! 🎉
              </h3>
              <p className="text-xs text-emerald-400 font-mono">
                Subscription Verified • Unlimited AI Access Activated
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                <Crown className="w-3.5 h-3.5" /> PRO Candidate Plan
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
                Supercharge Your AI Career Suite
              </h2>
              <p className="text-xs text-muted-foreground">
                Unlock unlimited ATS resume scans, 1-click optimized PDF export, advanced system design mock interviews, and priority AI compute.
              </p>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-muted-foreground">Special Demo Tier</span>
                <div className="text-2xl font-extrabold text-foreground flex items-baseline gap-1">
                  <span>$19</span>
                  <span className="text-xs text-muted-foreground font-normal">/ month</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Instant Demo Unlock
                </span>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited Deterministic & AI ATS Resume Audits</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click AI-Optimized Resume PDF Download & Formatting</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority Groq Llama-3.3 70B Deep Technical Prompts</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Advanced System Design & Coding Mock Interview Rounds</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified 👑 PRO Candidate Gold Badge on Dashboard</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleMockUpgrade}
                disabled={processing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-xl shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                {processing ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Verifying Subscription & Activating Pro...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>Activate Pro Plan (Instant Demo Upgrade)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-muted-foreground font-mono">
                Safe presentation mode — Instant state toggle for mentor demonstration.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
