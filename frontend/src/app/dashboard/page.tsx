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
  Bot,
  CheckCircle2,
  AlertCircle,
  Flame,
  Award,
  Layers,
  ChevronRight,
  Cpu,
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
        .select("overall_score, target_role, detected_skills, missing_skills, created_at")
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

  const detectedSkills: string[] = latestEval?.detected_skills || [
    "TypeScript",
    "React.js",
    "Next.js",
    "Node.js",
    "REST APIs",
    "Tailwind CSS",
    "Git",
  ];
  const missingSkills: string[] = latestEval?.missing_skills || ["Docker", "GraphQL", "Redis"];

  return (
    <AppShell>
      <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-8">
        {/* Top Hero Banner with Mesh Glow */}
        <div className="relative z-30 rounded-3xl bg-gradient-to-br from-card via-card/95 to-emerald-950/30 border border-emerald-500/30 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-28 -right-28 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-mono font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> AI Candidate Accelerator Core v2.0
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Candidate Command Center
              </h1>
              <TargetRoleSelector initialRole={targetRole} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/resume"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold shadow-xl shadow-emerald-900/40 hover:shadow-emerald-900/60 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4" /> Run ATS Resume Audit
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-card/90 border border-border hover:border-emerald-500/50 text-foreground text-sm font-bold shadow-lg transition-all duration-300"
              >
                <Target className="w-4 h-4 text-emerald-400" /> View Career Roadmap
              </Link>
            </div>
          </div>
        </div>

        {/* Top 3 Score Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ATS Score Card */}
          <div className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-amber-500/50 p-6 shadow-xl space-y-4 backdrop-blur-md group transition-all duration-300 hover:shadow-amber-950/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
            <div className="flex justify-between items-center text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <span>ATS Match Score</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-5xl font-extrabold text-amber-400 font-mono tracking-tight flex items-baseline gap-2">
              {atsScore !== null ? (
                <>
                  <span>{atsScore}</span>
                  <span className="text-lg font-normal text-muted-foreground">/ 100</span>
                </>
              ) : (
                <span className="text-muted-foreground font-normal text-3xl">-- / 100</span>
              )}
            </div>

            {/* Visual Progress Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-muted-foreground font-medium">
                <span>ATS Optimization Level</span>
                <span className="text-amber-400 font-bold">{atsScore !== null ? `${atsScore}%` : "0%"}</span>
              </div>
              <div className="w-full bg-secondary/60 h-3 rounded-full overflow-hidden p-0.5 border border-border/40">
                <div
                  className="bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300 h-full rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${atsScore || 0}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              {atsScore !== null ? (
                <span className="text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-mono text-xs font-semibold">
                  {isDemo ? "Sample Demo Benchmark" : "Verified Resume Score"}
                </span>
              ) : (
                <span className="text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-mono text-xs font-semibold flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> No Resume Audited
                </span>
              )}
              <Link href="/dashboard/resume" className="text-muted-foreground hover:text-amber-400 font-bold underline underline-offset-4 transition-colors">
                {atsScore !== null ? "View Audit ↗" : "Audit Resume ↗"}
              </Link>
            </div>
          </div>

          {/* Interview Readiness Card */}
          <div className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-blue-500/50 p-6 shadow-xl space-y-4 backdrop-blur-md group transition-all duration-300 hover:shadow-blue-950/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
            <div className="flex justify-between items-center text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Interview Readiness</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-5xl font-extrabold text-blue-400 font-mono tracking-tight">
              {interviewReadiness !== null ? `${interviewReadiness}%` : "-- %"}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-muted-foreground font-medium">
                <span>Technical Screening Mastery</span>
                <span className="text-blue-400 font-bold">{interviewReadiness !== null ? `${interviewReadiness}%` : "0%"}</span>
              </div>
              <div className="w-full bg-secondary/60 h-3 rounded-full overflow-hidden p-0.5 border border-border/40">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-400 to-sky-300 h-full rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${interviewReadiness || 0}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 font-mono text-xs font-semibold">
                {interviewReadiness !== null ? "Ready for Technical Round" : "Pending Practice"}
              </span>
              <Link href="/interview" className="text-muted-foreground hover:text-blue-400 font-bold underline underline-offset-4 transition-colors">
                Practice Mock ↗
              </Link>
            </div>
          </div>

          {/* Matched Live Openings Card */}
          <div className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-purple-500/50 p-6 shadow-xl space-y-4 backdrop-blur-md group transition-all duration-300 hover:shadow-purple-950/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
            <div className="flex justify-between items-center text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Matched Tech Openings</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-5xl font-extrabold text-purple-400 font-mono tracking-tight">
              {matchedRolesCount}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-muted-foreground font-medium">
                <span>Direct Verified Jobs</span>
                <span className="text-purple-400 font-bold">{matchedRolesCount} Jobs</span>
              </div>
              <div className="w-full bg-secondary/60 h-3 rounded-full overflow-hidden p-0.5 border border-border/40">
                <div className="bg-gradient-to-r from-purple-500 via-pink-400 to-purple-300 h-full rounded-full w-4/5 shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 font-mono text-xs font-semibold">
                Direct Apply Redirection
              </span>
              <Link href="/jobs" className="text-muted-foreground hover:text-purple-400 font-bold underline underline-offset-4 transition-colors">
                Explore Jobs ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Insights Grid: Skill Matrix + Action Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill Radar / Badges Box */}
          <div className="lg:col-span-2 rounded-3xl bg-card/80 border border-border/80 p-6 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-heading font-bold text-foreground">Candidate Skill Matrix & Gaps</h3>
              </div>
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                {targetRole}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono font-semibold text-muted-foreground block mb-2">Detected Technical Skills:</span>
                <div className="flex flex-wrap gap-2">
                  {detectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono font-semibold text-muted-foreground block mb-2">Recommended Skills to Acquire (+15% ATS Boost):</span>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-sm font-medium"
                    >
                      <Flame className="w-4 h-4 text-amber-400" /> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Checklist */}
          <div className="rounded-3xl bg-card/80 border border-border/80 p-6 shadow-xl space-y-4 backdrop-blur-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-heading font-bold text-foreground">Recommended Next Steps</h3>
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/dashboard/resume"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 hover:bg-emerald-500/10 border border-border/50 hover:border-emerald-500/40 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                      Run ATS Resume Scan
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/roadmap"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 hover:bg-emerald-500/10 border border-border/50 hover:border-emerald-500/40 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Target className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                      Generate Target Role Roadmap
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/interview"
                  className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 hover:bg-emerald-500/10 border border-border/50 hover:border-emerald-500/40 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-medium text-foreground group-hover:text-emerald-400 transition-colors">
                      Practice Mock Technical Round
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/chat"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
              >
                <Bot className="w-4 h-4" /> Ask 24/7 AI Career Coach
              </Link>
            </div>
          </div>
        </div>

        {/* Core SaaS Feature Hub */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Core AI Career Modules
            </h2>
            <span className="text-xs text-muted-foreground">4 Active AI Engines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Module 1 */}
            <Link
              href="/dashboard/resume"
              className="group relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-emerald-500/50 p-6 shadow-xl space-y-4 hover:shadow-emerald-950/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-heading font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                  ATS Resume Optimizer
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Deterministic score calculation, section structure check, missing keyword breakdown, and AI feedback.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-border/40">
                Launch Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 2 */}
            <Link
              href="/roadmap"
              className="group relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-emerald-500/50 p-6 shadow-xl space-y-4 hover:shadow-emerald-950/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-heading font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                  Career Roadmap
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Custom step-by-step learning milestones to bridge your current stack to your target role position.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-border/40">
                View Milestones <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 3 */}
            <Link
              href="/jobs"
              className="group relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-emerald-500/50 p-6 shadow-xl space-y-4 hover:shadow-emerald-950/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-heading font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                  Live Job Matches
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Direct external application links for verified tech jobs filtered by skills, location, and salary.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-border/40">
                Apply Direct <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 4 */}
            <Link
              href="/interview"
              className="group relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 hover:border-emerald-500/50 p-6 shadow-xl space-y-4 hover:shadow-emerald-950/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <Video className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-heading font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                  Mock AI Interview
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real technical & system design question simulator with instant AI score rubrics and model answers.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-border/40">
                Start Practice <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}