// frontend/src/components/pro/UpgradeProModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getProStatus, setProStatus } from "@/lib/proStatus";
import {
  Crown,
  CheckCircle2,
  X,
  Check,
  ArrowRight,
  Zap,
  RotateCcw,
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
  const [isCurrentlyPro, setIsCurrentlyPro] = useState(false);

  const userId = user?.id || user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (isOpen) {
      setIsCurrentlyPro(getProStatus(userId));
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleMockUpgrade = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setIsSuccess(true);

      setProStatus(userId, true);

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setIsSuccess(false);
      }, 1500);
    }, 1000);
  };

  const handleSwitchToFree = () => {
    setProStatus(userId, false);
    setIsCurrentlyPro(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-card border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Glow backdrop effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 border border-amber-500 flex items-center justify-center mx-auto shadow-xl shadow-amber-950/40">
              <CheckCircle2 className="w-10 h-10 animate-bounce text-slate-950" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-heading font-extrabold text-foreground">
                Upgraded to PRO Candidate! 🎉
              </h3>
              <p className="text-xs text-amber-400 font-mono font-bold">
                Subscription Verified • Unlimited AI Access Activated
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 border border-amber-500 text-xs font-mono font-black shadow-sm">
                <Crown className="w-4 h-4 text-slate-950 fill-slate-950" /> PRO Candidate Plan
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
                Supercharge Your AI Career Suite
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlock unlimited ATS resume scans, 1-click optimized PDF export, advanced system design mock interviews, and priority AI compute.
              </p>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-muted-foreground font-bold">Pro Candidate Tier</span>
                <div className="text-2xl font-extrabold text-foreground flex items-baseline gap-1">
                  <span>$19</span>
                  <span className="text-xs text-muted-foreground font-normal">/ month</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-amber-400 text-slate-950 border border-amber-500 font-black shadow-sm">
                  Instant Unlock
                </span>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Unlimited Deterministic & AI ATS Resume Audits</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1-Click AI-Optimized Resume PDF Download & Formatting</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Unlimited Mock Technical Interview Questions & Evaluation</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Priority Groq Llama-3.3 70B Deep Technical Prompts</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verified 👑 PRO Candidate Gold Badge across Dashboard</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleMockUpgrade}
                disabled={processing}
                className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-950/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer border border-amber-500"
              >
                {processing ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Verifying Subscription & Activating Pro...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>Activate PRO Plan (Instant Upgrade)</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              {isCurrentlyPro && (
                <button
                  type="button"
                  onClick={handleSwitchToFree}
                  className="w-full py-2 text-xs font-mono text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Switch to Free Tier (Test Mode)
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
