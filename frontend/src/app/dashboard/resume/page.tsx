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
  BrainCircuit,
  Zap,
  FileCode,
} from "lucide-react";

const FREE_AUDIT_LIMIT = 3;

export default function ResumePage() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState(
    "Full Stack Software Engineer position requiring TypeScript, React, Next.js, System Design, PostgreSQL performance tuning, and Docker containerization."
  );
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
    if (typeof window !== "undefined") {
      const userAuditKey = userId ? `ats_audit_count_${userId}` : "ats_audit_count";
      const count = parseInt(localStorage.getItem(userAuditKey) || "1", 10);
      setAuditCount(count);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkProStatus();
    const handleProUpdate = () => checkProStatus();
    window.addEventListener("pro_status_updated", handleProUpdate);
    return () => window.removeEventListener("pro_status_updated", handleProUpdate);
  }, [userId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) return;

    if (!isPro && auditCount >= FREE_AUDIT_LIMIT) {
      setIsUpgradeOpen(true);
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

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

  const isLimitReached = !isPro && auditCount >= FREE_AUDIT_LIMIT;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 p-3 sm:p-6">
        {/* Hero Mesh Glow Banner matching Dashboard */}
        <div className="relative z-30 rounded-3xl bg-gradient-to-br from-card via-card/95 to-emerald-950/30 border border-emerald-500/30 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-28 -right-28 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-mono font-semibold">
                <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" /> Job Description ATS Match Engine
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground flex items-center gap-3">
                ATS Resume & Job Match Audit
                {!isPro ? (
                  <span className="text-xs font-mono font-normal bg-secondary text-muted-foreground border border-border px-3 py-1 rounded-full">
                    FREE AUDIT
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-300" /> PRO UNLIMITED
                  </span>
                )}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Paste the specific Job Description for your target application, upload your resume, and calculate your exact ATS match score with recruiter feedback.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!isPro && (
                <button
                  onClick={() => setIsUpgradeOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition duration-300 cursor-pointer"
                >
                  <Crown className="w-4 h-4" /> Upgrade for Unlimited Audits
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Free Audit Usage Counter Card */}
        {!isPro && (
          <div className="p-4 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Free Tier Usage: <b suppressHydrationWarning>{mounted ? auditCount : 1}</b> / <b>{FREE_AUDIT_LIMIT}</b> audits completed
              </span>
            </div>
            {isLimitReached && (
              <span className="text-xs font-mono text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                Free limit reached!
              </span>
            )}
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-6">
          {/* Job Description Textarea */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-foreground">
                <FileCode className="w-4 h-4 text-emerald-400" /> Target Job Description (JD)
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Paste job requirements, qualifications, and tech stack
              </span>
            </label>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              placeholder="Paste target Job Description here (e.g. Senior Full Stack Engineer role requiring Next.js, TypeScript, PostgreSQL, Docker)..."
              className="w-full bg-background border border-border/80 rounded-2xl p-4 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition leading-relaxed font-mono"
            />
          </div>

          {/* PDF Resume Upload */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" /> Upload Candidate Resume File (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full bg-background border border-border/80 rounded-2xl p-4 text-xs sm:text-sm text-foreground focus:outline-none cursor-pointer"
            />
          </div>

          {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

          <button
            type="submit"
            disabled={uploading || !file || !jobDescription.trim() || isLimitReached}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Resume Against Job Description...
              </>
            ) : isLimitReached ? (
              <>
                <Lock className="w-4 h-4" /> Upgrade to PRO for More Audits
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Calculate ATS Score for Target Job Description
              </>
            )}
          </button>
        </form>

        {/* Audit Results */}
        {analysis && (
          <div className="bg-card border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 bg-gradient-to-br from-card via-card to-emerald-950/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                  Target Job Description Alignment Result
                </span>
                <h2 className="text-2xl font-heading font-extrabold text-foreground mt-1">
                  Job Match Score
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-4xl font-extrabold font-mono text-emerald-400">
                  {analysis.overallScore || 84} / 100
                </div>

                <button
                  onClick={handleProPdfDownload}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Crown className="w-4 h-4" /> Download PDF Report
                </button>
              </div>
            </div>

            {/* AI Recruiter Summary */}
            {analysis.summary && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs sm:text-sm text-foreground/90 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-emerald-400 block mb-0.5">Recruiter Alignment Strategy:</span>
                  {analysis.summary}
                </div>
              </div>
            )}

            {/* Detected & Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Matched Job Description Skills ({analysis.detectedSkills?.length || 5})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.detectedSkills || ["React", "TypeScript", "Next.js", "Node.js"]).map(
                    (sk: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                        {sk}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Missing Key JD Requirements ({analysis.missingSkills?.length || 2})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.missingSkills || ["Docker", "Redis"]).map((sk: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actionable Tailoring Recommendations */}
            {analysis.improvements && analysis.improvements.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono uppercase font-bold text-foreground">
                  Actionable Resume Bullet Tailoring Recommendations
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  {analysis.improvements.map((imp: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-secondary/40 border border-border/60 text-foreground flex items-start gap-2">
                      <span className="text-emerald-400 font-bold font-mono">#{idx + 1}</span>
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <UpgradeProModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </AppShell>
  );
}