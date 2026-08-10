// frontend/src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  ArrowUpRight,
  Zap,
  Target,
  Loader2,
  Sparkles,
  FileText,
  MessagesSquare,
  Briefcase,
  UserCircle,
  X,
  CheckCircle2,
  Activity,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface TelemetryData {
  targetRole: string;
  atsScore: number;
  scoreDiff: string;
  interviewReadiness: number;
  matchedRolesCount: number;
  creditsLeft: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<TelemetryData>({
    targetRole: "Software Development Engineer Intern",
    atsScore: 88,
    scoreDiff: "+12%",
    interviewReadiness: 82,
    matchedRolesCount: 24,
    creditsLeft: 10,
  });
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const profileRes = await fetch("/api/profile");
        let userSkills = ["React", "TypeScript", "Next.js", "C++"];
        let role = "Software Development Engineer Intern";

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.profile) {
            role = profileData.profile.targetRole || role;
            userSkills = profileData.profile.skills || userSkills;
          }
        }

        const jobsRes = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, userSkills }),
        });

        let jobCount = 24;
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          if (Array.isArray(jobsData.jobs)) {
            jobCount = jobsData.jobs.length;
          }
        }

        setData((prev) => ({
          ...prev,
          targetRole: role,
          matchedRolesCount: jobCount,
        }));
      } catch (err) {
        console.error("Telemetry update failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTelemetry();
  }, []);

 // Local Mock Checkout Handler (Bypasses Razorpay KYC / PAN requirement)
 const handleRazorpayPayment = async () => {
  setIsProcessingPayment(true);

  setTimeout(() => {
    alert("Mock Payment Successful! Unlimited Pro Credits Unlocked.");
    setData((prev) => ({ ...prev, creditsLeft: 999 }));
    setShowUpgradeModal(false);
    setIsProcessingPayment(false);
  }, 800);
};

  return (
    <AppShell>
      {/* Top Banner Bar */}
      <div className="-mt-6 -mx-6 lg:-mt-10 lg:-mx-10 border-b border-border bg-card px-6 py-3 mb-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          {/* Executive Telemetry Trigger */}
          <button
            onClick={() => setShowTelemetryModal(true)}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary hover:bg-accent text-secondary-foreground border border-border transition flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-primary" />
            Executive Telemetry
          </button>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Free Plan · {data.creditsLeft === 999 ? "UNLIMITED" : `${data.creditsLeft} Credits Left`}
          </span>
        </div>

        {/* Upgrade to Pro Trigger */}
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl shadow-2xs transition flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" /> Upgrade to Pro
        </button>
      </div>

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Telemetry Sidebar */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-6 sticky top-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div>
                <Link href="/profile" className="group block">
                  <h2 className="text-base font-heading font-bold text-foreground group-hover:text-primary transition truncate">
                    {data.targetRole}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Profile ATS & Readiness Score</p>
                </Link>

                <Link
                  href="/dashboard/resume"
                  className="mt-5 flex items-center gap-4 group p-2 -mx-2 rounded-xl hover:bg-accent/40 transition"
                >
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-50/50 group-hover:scale-105 transition-transform">
                    <span className="text-2xl font-bold text-emerald-700">{data.atsScore}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition">
                      {data.scoreDiff} vs last audit
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-1">
                      Your profile matches {data.matchedRolesCount} active openings.
                    </p>
                  </div>
                </Link>
              </div>

              <hr className="border-border" />

              {/* Core Metrics List */}
              <div className="space-y-3">
                <Link
                  href="/interview"
                  className="flex justify-between items-center p-3 bg-accent/40 hover:bg-accent/80 border border-border rounded-xl transition group"
                >
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition flex items-center gap-2">
                    <MessagesSquare className="w-3.5 h-3.5 text-primary" /> Interview Readiness
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{data.interviewReadiness} / 100</span>
                </Link>

                <Link
                  href="/jobs"
                  className="flex justify-between items-center p-3 bg-accent/40 hover:bg-accent/80 border border-border rounded-xl transition group"
                >
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-primary" /> Matched Roles
                  </span>
                  <span className="text-xs font-bold text-primary">{data.matchedRolesCount} Openings</span>
                </Link>

                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full flex justify-between items-center p-3 bg-accent/40 hover:bg-accent/80 border border-border rounded-xl transition group cursor-pointer"
                >
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition flex items-center gap-2">
                    <UserCircle className="w-3.5 h-3.5 text-primary" /> AI Credits Left
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {data.creditsLeft === 999 ? "∞" : `${data.creditsLeft} / 10`}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Canvas Area */}
        <div className="lg:col-span-8 space-y-6">
          <Link
            href="/interview"
            className="block bg-card hover:bg-secondary/30 border border-border hover:border-primary/40 rounded-2xl p-8 shadow-2xs min-h-[320px] flex flex-col justify-center items-center text-center space-y-3 transition group"
          >
            <Target className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition">
              Interview Readiness Trajectory
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              Complete a mock interview session to unlock real-time progress analytics, system design trade-off scores, and skill radar charts.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary mt-2 group-hover:underline">
              Start Practice Session <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Recommended Next Actions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/resume"
                className="p-4 bg-card hover:bg-secondary/60 border border-border hover:border-primary/40 rounded-2xl transition group flex flex-col justify-between h-32 shadow-2xs"
              >
                <div>
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" /> Run ATS Audit
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Audit formatting & keyword density</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition self-end" />
              </Link>

              <Link
                href="/interview"
                className="p-4 bg-card hover:bg-secondary/60 border border-border hover:border-primary/40 rounded-2xl transition group flex flex-col justify-between h-32 shadow-2xs"
              >
                <div>
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition flex items-center gap-1.5">
                    <MessagesSquare className="w-3.5 h-3.5 text-primary" /> Mock Interview
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Practice system design & coding</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition self-end" />
              </Link>

              <Link
                href="/jobs"
                className="p-4 bg-card hover:bg-secondary/60 border border-border hover:border-primary/40 rounded-2xl transition group flex flex-col justify-between h-32 shadow-2xs"
              >
                <div>
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-primary" /> Explore Jobs
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {data.matchedRolesCount} matched live positions
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition self-end" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Telemetry Modal */}
      {showTelemetryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h3 className="font-heading font-bold text-base text-foreground">
                  Executive Telemetry Report
                </h3>
              </div>
              <button
                onClick={() => setShowTelemetryModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-accent/40 border border-border rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Target Role Index</span>
                  <span className="text-emerald-700">{data.targetRole}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time synchronization active. Keyword density checks for C++, React, and System Design are active.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-card border border-border rounded-xl space-y-1">
                  <span className="text-muted-foreground font-medium">System Health</span>
                  <p className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Operational
                  </p>
                </div>
                <div className="p-3 bg-card border border-border rounded-xl space-y-1">
                  <span className="text-muted-foreground font-medium">ATS Benchmark</span>
                  <p className="text-sm font-bold text-foreground flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-primary" /> Top 8% of Candidates
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTelemetryModal(false)}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
            >
              Close Telemetry Report
            </button>
          </div>
        </div>
      )}

      {/* Upgrade to Pro Razorpay Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-heading font-bold text-base text-foreground">
                  Upgrade to Pathfinder Pro
                </h3>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <span className="text-3xl font-bold text-foreground">₹999</span>
              <span className="text-xs text-muted-foreground"> / month</span>
              <p className="text-xs text-muted-foreground">
                Unlock full platform capabilities and automated AI career optimization.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Unlimited ATS Resume Audits & Optimizations
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Unlimited AI Mock Interview Sessions
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Direct Application Links for High-Paying Matches
              </div>
            </div>

            <button
              onClick={handleRazorpayPayment}
              disabled={isProcessingPayment}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {isProcessingPayment ? "Connecting to Razorpay..." : "Pay ₹999 with Razorpay"}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}