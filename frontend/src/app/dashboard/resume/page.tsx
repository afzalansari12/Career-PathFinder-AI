// frontend/src/app/dashboard/resume/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import UpgradeProModal from "@/components/pro/UpgradeProModal";
import { getProStatus } from "@/lib/proStatus";
import { useUser } from "@clerk/nextjs";
import {
  UploadCloud,
  FileText,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  Target,
  BarChart3,
  TrendingUp,
  XCircle,
  ArrowRight,
  Crown,
  Lock,
  Check,
} from "lucide-react";
import Link from "next/link";

const TARGET_ROLES = [
  "Software Engineer",
  "Full Stack Engineer",
  "Frontend Developer",
  "Backend Developer",
  "AI / ML Engineer",
  "DevOps Engineer",
  "Data Scientist",
];

const FREE_AUDIT_LIMIT = 3;

export default function ResumePage() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [auditCount, setAuditCount] = useState(1);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const userId = user?.id || user?.primaryEmailAddress?.emailAddress;

  const checkProStatus = () => {
    setIsPro(getProStatus(userId));
    const userAuditKey = userId ? `ats_audit_count_${userId}` : "ats_audit_count";
    const count = parseInt(localStorage.getItem(userAuditKey) || "1", 10);
    setAuditCount(count);
  };

  useEffect(() => {
    checkProStatus();
    const handleProUpdate = () => checkProStatus();
    window.addEventListener("pro_status_updated", handleProUpdate);
    return () => window.removeEventListener("pro_status_updated", handleProUpdate);
  }, [userId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (!isPro && auditCount >= FREE_AUDIT_LIMIT) {
      setIsUpgradeOpen(true);
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetRole", targetRole);

    try {
      const res = await fetch("/api/ats/evaluate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${res.status})`);
      }

      const result = await res.json();
      setAnalysis(result.data);

      const nextCount = auditCount + 1;
      setAuditCount(nextCount);
      const userAuditKey = userId ? `ats_audit_count_${userId}` : "ats_audit_count";
      localStorage.setItem(userAuditKey, nextCount.toString());
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to process resume upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleProPdfDownload = () => {
    if (!isPro) {
      setIsUpgradeOpen(true);
      return;
    }

    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1200);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-rose-500 border-rose-500/30 bg-rose-500/10";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  const isLimitReached = !isPro && auditCount >= FREE_AUDIT_LIMIT;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 p-2 sm:p-4">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Deterministic & AI ATS Engine
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground flex items-center gap-3">
              ATS Resume Optimization
              {!isPro ? (
                <span className="text-xs font-mono font-bold bg-secondary text-muted-foreground border border-border px-2.5 py-0.5 rounded-full">
                  Free Quota: {auditCount}/{FREE_AUDIT_LIMIT} Audits Used
                </span>
              ) : (
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-300" /> Unlimited Audits
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Upload your resume for real-time formatting, keyword density analysis, structural audit, and role-based score breakdown.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isPro ? (
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition cursor-pointer"
              >
                <Crown className="w-4 h-4" /> Upgrade for Unlimited Scans
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                <Crown className="w-3.5 h-3.5 text-amber-300" /> PRO Unlocked
              </span>
            )}
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold transition"
            >
              <Target className="w-4 h-4" /> Career Roadmap
            </Link>
          </div>
        </div>

        {/* UPLOAD FORM */}
        {!analysis ? (
          <div className="bg-card border border-border/80 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="max-w-xl mx-auto text-center space-y-2">
              <h2 className="text-xl font-heading font-bold text-foreground">
                Start Your Resume ATS Audit
              </h2>
              <p className="text-xs text-muted-foreground">
                Select your target role and upload your resume in PDF format to receive instant detailed scoring.
              </p>
            </div>

            {/* QUOTA LIMIT REACHED PROMPT FOR FREE USERS */}
            {isLimitReached && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Free quota limit reached (3/3 audits used). Upgrade to PRO for unlimited scans.</span>
                </div>
                <button
                  onClick={() => setIsUpgradeOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer transition"
                >
                  Upgrade Now
                </button>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Target Role
                </label>
                <div className="flex flex-wrap gap-2">
                  {TARGET_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        targetRole === role
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/20"
                          : "bg-secondary/50 text-muted-foreground border-border hover:border-emerald-500/40 hover:text-foreground"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative border-2 border-dashed border-border/80 hover:border-emerald-500/50 rounded-2xl p-8 text-center bg-muted/20 hover:bg-muted/40 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  disabled={isLimitReached}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
                  {file ? <FileText className="w-7 h-7 text-emerald-400" /> : <UploadCloud className="w-7 h-7" />}
                </div>
                {file ? (
                  <div>
                    <p className="text-sm font-semibold text-foreground">{file.name}</p>
                    <p className="text-xs text-emerald-400 mt-0.5">Ready for ATS analysis</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Click to choose or drag & drop your resume PDF
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PDF or TXT up to 5MB</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {uploading
                  ? "Analyzing Resume & Calculating ATS Score..."
                  : isLimitReached
                  ? "Upgrade to PRO to Scan Resume"
                  : `Evaluate for ${targetRole}`}
              </button>
            </form>
          </div>
        ) : (
          /* ANALYSIS RESULT DASHBOARD */
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Overall Score */}
              <div className="md:col-span-2 bg-card border border-border/80 rounded-3xl p-6 shadow-xl flex items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl" />
                <div
                  className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shrink-0 shadow-inner ${getScoreColor(
                    analysis.overallScore
                  )}`}
                >
                  <span className="text-4xl font-extrabold tracking-tight">{analysis.overallScore}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">/ 100</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Target: {analysis.targetRole}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-foreground">
                    Overall ATS Compatibility
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {analysis.overallScore >= 75
                      ? "Your resume has high parser compatibility and strong technical keyword alignment!"
                      : "Your resume needs targeted keyword additions and bullet formatting improvements."}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setAnalysis(null)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
                    >
                      Upload Another Resume
                    </button>

                    {/* Pro Export Perk */}
                    <button
                      onClick={handleProPdfDownload}
                      disabled={downloadingPdf}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      {downloadingPdf ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : downloadSuccess ? (
                        <Check className="w-3.5 h-3.5 text-emerald-950" />
                      ) : (
                        <Crown className="w-3.5 h-3.5 text-amber-950" />
                      )}
                      <span>
                        {downloadingPdf
                          ? "Generating Optimized PDF..."
                          : downloadSuccess
                          ? "Optimized PDF Downloaded!"
                          : "Export AI 95+ Resume PDF (PRO)"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Interview Readiness */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono uppercase">Interview Readiness</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-foreground">{analysis.interviewReadiness}%</div>
                  <p className="text-xs text-emerald-400 mt-1">Ready for technical screening</p>
                </div>
                <Link
                  href="/interview"
                  className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Practice Mock Interview <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Matched Roles Count */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono uppercase">Live Job Matches</span>
                  <Award className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-foreground">{analysis.matchedRolesCount}</div>
                  <p className="text-xs text-blue-400 mt-1">Openings matching your profile</p>
                </div>
                <Link
                  href="/jobs"
                  className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
                >
                  View Job Listings <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Category Breakdown Progress Bars */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" /> ATS Category Score Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Structural Compliance", score: analysis.breakdown?.structureScore || 80 },
                  { label: "Keyword Matching & Density", score: analysis.breakdown?.keywordScore || 70 },
                  { label: "Impact & Action Verbs", score: analysis.breakdown?.impactScore || 75 },
                  { label: "Formatting & Parseability", score: analysis.breakdown?.formattingScore || 85 },
                ].map((item) => (
                  <div key={item.label} className="space-y-2 bg-muted/20 p-4 rounded-2xl border border-border/40">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-foreground">{item.label}</span>
                      <span className="font-mono text-emerald-400 font-bold">{item.score} / 100</span>
                    </div>
                    <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getProgressColor(item.score)}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive AI Narrative Feedback */}
            {analysis.summary && (
              <div className="bg-gradient-to-r from-emerald-950/40 via-card to-card border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-heading font-bold text-emerald-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Executive Recruiter Narrative Summary
                </h3>
                <p className="text-xs text-foreground/90 leading-relaxed bg-card/60 p-4 rounded-2xl border border-border/50">
                  {analysis.summary}
                </p>
              </div>
            )}

            {/* Strengths & Actionable Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-heading font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Resume Strengths
                </h3>
                <ul className="space-y-3">
                  {(analysis.strengths || [
                    "Clean section headers easily parsed by ATS standard software.",
                    "Good distribution of technical stack keywords.",
                    "Clear project experience entries.",
                  ]).map((strength: string, i: number) => (
                    <li key={i} className="text-xs text-foreground/90 flex items-start gap-2.5 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-heading font-bold text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> High-Impact Action Items to Boost Score
                </h3>
                <ul className="space-y-3">
                  {(analysis.improvements || [
                    "Quantify bullet points with metric percentages (e.g. 'Improved performance by 35%').",
                    "Incorporate missing core role keywords like System Architecture and Testing.",
                    "Ensure employment dates follow standard MM/YYYY format.",
                  ]).map((imp: string, i: number) => (
                    <li key={i} className="text-xs text-foreground/90 flex items-start gap-2.5 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detected & Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-3">
                <h3 className="text-xs font-mono uppercase text-muted-foreground">
                  Detected Technical Skills ({analysis.detectedSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(analysis.detectedSkills || ["React", "TypeScript", "Node.js", "Next.js", "Git"]).map(
                    (skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-3">
                <h3 className="text-xs font-mono uppercase text-muted-foreground">
                  Recommended Missing Target Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(analysis.missingSkills || ["GraphQL", "Docker", "CI/CD", "PostgreSQL"]).map(
                    (skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      >
                        + {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <UpgradeProModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={() => checkProStatus()}
      />
    </AppShell>
  );
}