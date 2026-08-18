// frontend/src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { isUserSignedUp, markUserSignedUp } from "@/lib/authTracking";
import {
  Sparkles,
  CheckCircle2,
  LogIn,
  UserPlus,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const [hasSignedUp, setHasSignedUp] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    if (isSignedIn) {
      markUserSignedUp();
      setHasSignedUp(true);
    } else {
      setHasSignedUp(isUserSignedUp());
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden selection:bg-emerald-500/30">
      {/* Glow Ambient Background Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/40 text-sm sm:text-base">
            P
          </div>
          <span className="font-heading text-base sm:text-xl font-bold tracking-tight text-foreground">
            PathFinder<span className="hidden xs:inline"> AI</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5 shrink-0"
            >
              <span className="hidden sm:inline">Go to</span> Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/dashboard?demo=true"
                className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-border transition flex items-center gap-1 shrink-0"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Demo</span>
              </Link>

              {/* Dynamic Auth Buttons: If user has previously signed up, show Sign In as primary */}
              {isMounted && hasSignedUp ? (
                <>
                  <Link
                    href="/sign-up"
                    className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-border transition flex items-center gap-1.5 shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="whitespace-nowrap">Sign Up</span>
                  </Link>
                  <Link
                    href="/sign-in"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5 shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span className="whitespace-nowrap">Sign In</span>
                  </Link>
                </>
              ) : (
                /* First Time User -> Sign Up is primary action */
                <>
                  <Link
                    href="/sign-in"
                    className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-border transition flex items-center gap-1.5 shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span className="whitespace-nowrap">Sign In</span>
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5 shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="whitespace-nowrap">Sign Up</span>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-16 sm:pb-20 text-center space-y-6 sm:space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono max-w-full truncate">
          <Sparkles className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">AI-Powered Career Accelerator SaaS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-[1.15] sm:leading-[1.1]">
          Supercharge Your Career with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
            Deterministic ATS & AI Intelligence
          </span>
        </h1>

        <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Upload your resume for instant deterministic ATS scoring, generate step-by-step target role roadmaps, match direct tech job vacancies, and practice AI mock interviews.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full">
          <Link
            href="/dashboard?demo=true"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl shadow-xl shadow-emerald-900/40 transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> Try Instant Demo Dashboard
          </Link>

          {/* Hero Auth CTA depending on whether user has previously signed up */}
          {isMounted && hasSignedUp ? (
            <Link
              href="/sign-in"
              className="w-full sm:w-auto bg-secondary/80 hover:bg-secondary text-secondary-foreground font-semibold text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl border border-border transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-emerald-400" /> Sign In to Your Account
            </Link>
          ) : (
            <Link
              href="/sign-up"
              className="w-full sm:w-auto bg-secondary/80 hover:bg-secondary text-secondary-foreground font-semibold text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl border border-border transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" /> First Time? Create Account (Sign Up)
            </Link>
          )}
        </div>

        {/* Feature Badges Grid */}
        <div className="pt-8 sm:pt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs font-medium text-muted-foreground max-w-4xl mx-auto border-t border-border/50">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl bg-card/40 border border-border/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Deterministic ATS</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl bg-card/40 border border-border/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Role Roadmaps</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl bg-card/40 border border-border/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Live Job Matcher</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl bg-card/40 border border-border/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Mock AI Interview</span>
          </div>
        </div>
      </section>
    </div>
  );
}