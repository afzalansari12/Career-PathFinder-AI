// frontend/src/app/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import DeleteAccountSection from "@/components/account/DeleteAccountSection";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Settings,
  ShieldCheck,
  KeyRound,
  User,
  Bell,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 p-3 sm:p-6">
        {/* Header Banner */}
        <div className="relative z-10 rounded-3xl bg-gradient-to-br from-card via-card/95 to-emerald-950/30 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <Settings className="w-4 h-4 text-emerald-400" /> Account & Security Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Manage your security preferences, update password credentials, and configure account settings.
            </p>
          </div>
        </div>

        {/* Security & Password Card */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 border-b border-border pb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-heading font-bold text-lg text-foreground">Password & Security</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-secondary/40 border border-border/60 space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Forgot or Reset Password</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Send a 6-digit verification code to your registered email address to set a new password.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 pt-1"
              >
                Reset Password via Email <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-secondary/40 border border-border/60 space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <User className="w-4 h-4 text-blue-400" />
                <span>User Profile & Credentials</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed" suppressHydrationWarning>
                Logged in as <span className="font-semibold text-foreground">{mounted ? (user?.primaryEmailAddress?.emailAddress || "Candidate") : "Candidate"}</span>.
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4 pt-1"
              >
                Edit Learner Profile <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Delete Account Danger Zone */}
        <DeleteAccountSection />
      </div>
    </AppShell>
  );
}