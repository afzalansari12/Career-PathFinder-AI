// frontend/src/app/forgot-password/page.tsx
"use client";

import React, { useEffect } from "react";
import { SignIn, useAuth } from "@clerk/nextjs";
import { Sparkles, KeyRound, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { markUserSignedUp } from "@/lib/authTracking";

export default function ForgotPasswordPage() {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      markUserSignedUp();
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-emerald-500/30">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-8">
        {/* Left SaaS Hero Branding Card */}
        <div className="lg:col-span-6 space-y-6 text-left p-6 lg:p-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/40 text-lg">
              P
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
              PathFinder AI
            </span>
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <KeyRound className="w-3.5 h-3.5" /> Password Recovery Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight leading-tight">
              Recover your password & access <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Your AI Career Dashboard
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Enter your email below to receive a secure password reset link or verification code.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-foreground/90 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Verification Code via Email</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-foreground/90 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Secure Encrypted Password Reset</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-foreground/90 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automatic Session Restoration</span>
            </div>
          </div>
        </div>

        {/* Right Clerk SignIn Component with Forgot Password Flow */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-4">
          <div className="w-full max-w-md bg-card/80 border border-border/80 p-2 sm:p-4 rounded-3xl shadow-2xl backdrop-blur-xl">
            <SignIn
              appearance={{
                elements: {
                  card: "bg-transparent shadow-none p-4",
                  headerTitle: "text-foreground font-heading font-bold text-xl",
                  headerSubtitle: "text-muted-foreground text-xs",
                  socialButtonsBlockButton:
                    "bg-secondary border border-border text-foreground hover:bg-secondary/80 text-xs font-semibold rounded-xl",
                  formButtonPrimary:
                    "bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-950/20 transition",
                  formFieldInput:
                    "bg-background border border-border text-foreground text-xs rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-emerald-500",
                  footerActionLink: "text-emerald-400 hover:text-emerald-300 font-semibold text-xs",
                },
              }}
            />
          </div>

          <div className="w-full max-w-md flex justify-between items-center text-xs px-2 pt-1 text-muted-foreground font-medium">
            <Link href="/sign-in" className="text-emerald-400 hover:underline font-semibold">
              Remembered Password? Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-foreground">
              Need an account? <span className="text-emerald-400 font-semibold">Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
