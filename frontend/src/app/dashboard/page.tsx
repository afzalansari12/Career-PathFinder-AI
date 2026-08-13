// frontend/src/app/dashboard/page.tsx
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase/server";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import TargetRoleSelector from "@/components/dashboard/TargetRoleSelector";
import {
  FileText,
  ArrowRight,
  Sparkles,
  Target,
  Briefcase,
  Video,
  TrendingUp,
  Zap,
  Upload,
} from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ demo?: string }>;
}) {
  const resolvedParams = await searchParams;
  const isDemo = resolvedParams?.demo === "true";

  let userId: string | null = null;
  let profile: any = null;
  let latestEval: any = null;

  try {
    const authResult = await auth();
    userId = authResult.userId;
    if (userId) {
      const supabase = await createSupabaseClient();
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("clerk_id", userId)
        .maybeSingle();
      profile = profileData;

      const { data: evalData } = await supabase
        .from("ats_evaluations")
        .select("overall_score, target_role, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      latestEval = evalData;
    }
  } catch (err) {
    console.warn("Dashboard Auth/Supabase warning:", err);
  }

  // Determine actual ATS score vs new user vs demo
  const userScore = profile?.ats_score || latestEval?.overall_score || null;
  const atsScore = userScore !== null ? userScore : isDemo ? 84 : null;
  const interviewReadiness = profile?.interview_readiness || (isDemo ? 88 : null);
  const matchedRolesCount = profile?.matched_roles_count || 14;
  const targetRole = latestEval?.target_role || profile?.target_role || "Full Stack Engineer";

  return (
    <AppShell>
      <div className="p-2 sm:p-4 max-w-6xl mx-auto space-y-8">
        {/* Top Executive Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Candidate Analytics Command Center
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
              Candidate Command Center
            </h1>
            <TargetRoleSelector initialRole={targetRole} />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/resume"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-lg shadow-emerald-900/20 transition"
            >
              <FileText className="w-4 h-4" /> Run ATS Resume Audit
            </Link>
          </div>
        </div>

        {/* Top 3 Score Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ATS Score Card */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition">
            <div className="flex justify-between items-center text-xs font-mono uppercase text-muted-foreground">
              <span>ATS Match Score</span>
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
              {atsScore !== null ? (
                <>
                  {atsScore} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
                </>
              ) : (
                <span className="text-muted-foreground font-normal text-3xl">-- / 100</span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              {atsScore !== null ? (
                <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono text-[10px]">
                  {isDemo ? "Sample Demo Benchmark" : "Verified Resume Score"}
                </span>
              ) : (
                <span className="text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-mono text-[10px] flex items-center gap-1">
                  <Upload className="w-3 h-3" /> No Resume Audited
                </span>
              )}
              <Link href="/dashboard/resume" className="text-muted-foreground hover:text-foreground underline underline-offset-4">
                {atsScore !== null ? "View Audit ↗" : "Audit Resume ↗"}
              </Link>
            </div>
          </div>

          {/* Interview Readiness Card */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group hover:border-blue-500/40 transition">
            <div className="flex justify-between items-center text-xs font-mono uppercase text-muted-foreground">
              <span>Interview Readiness</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-4xl font-extrabold text-blue-400 font-mono tracking-tight">
              {interviewReadiness !== null ? `${interviewReadiness}%` : "-- %"}
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-mono text-[10px]">
                {interviewReadiness !== null ? "Ready for Screening" : "Pending AI Practice"}
              </span>
              <Link href="/interview" className="text-muted-foreground hover:text-foreground underline underline-offset-4">
                Practice Mock ↗
              </Link>
            </div>
          </div>

          {/* Matched Live Openings Card */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden group hover:border-purple-500/40 transition">
            <div className="flex justify-between items-center text-xs font-mono uppercase text-muted-foreground">
              <span>Matched Live Jobs</span>
              <Briefcase className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-4xl font-extrabold text-purple-400 font-mono tracking-tight">
              {matchedRolesCount}
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-mono text-[10px]">
                Active verified openings
              </span>
              <Link href="/jobs" className="text-muted-foreground hover:text-foreground underline underline-offset-4">
                Explore Jobs ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Core SaaS Feature Hub */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" /> Quick Access Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/dashboard/resume"
              className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/50 hover:bg-card/90 transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-foreground">ATS Resume Optimizer</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Deterministic score calculation, section structure check, missing keyword breakdown, and AI feedback.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 pt-1">
                Launch Audit <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/roadmap"
              className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/50 hover:bg-card/90 transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-foreground">Career Roadmap</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Custom step-by-step learning milestones to bridge your current stack to your target role position.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 pt-1">
                View Milestones <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/jobs"
              className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/50 hover:bg-card/90 transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-foreground">Live Job Matches</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct external application links for verified tech jobs filtered by skills, location, and salary.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 pt-1">
                Apply Direct <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/interview"
              className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/50 hover:bg-card/90 transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-foreground">Mock AI Interview</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Real technical & system design question simulator with instant AI score rubrics and model answers.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 pt-1">
                Start Practice <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}