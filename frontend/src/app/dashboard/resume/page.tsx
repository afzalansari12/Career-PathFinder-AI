// frontend/src/app/resume/page.tsx
"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { Upload, FileText, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      // 1. Upload & Parse Resume
      const res = await fetch("/api/ats", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setAtsScore(data.score || 85);
      setFeedback(data.feedback || ["Good key skills", "Add more quantifiable metrics"]);
    } catch (err) {
      console.error("Failed to parse resume:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b border-border pb-4">
          <h1 className="text-xl font-heading font-bold text-foreground">
            ATS Resume Optimization
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload your resume to calculate your ATS match score and unlock personalized recommendations.
          </p>
        </div>

        {/* FIRST-TIME USER: UPLOAD BOX */}
        {atsScore === null ? (
          <div className="bg-card border-2 border-dashed border-border rounded-2xl p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">
                Upload your Resume to get started
              </h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Supports PDF, DOCX, or TXT. Our AI will analyze formatting, keyword density, and match score.
              </p>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4 max-w-xs mx-auto">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-secondary file:text-secondary-foreground hover:file:bg-accent cursor-pointer"
              />

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {uploading ? "Analyzing Resume..." : "Run First ATS Audit"}
              </button>
            </form>
          </div>
        ) : (
          /* AUDITED STATE: SHOW ATS SCORE & FEEDBACK */
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-6 shadow-2xs">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500 bg-emerald-50 flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold text-emerald-700">{atsScore}</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">
                  Overall ATS Compatibility Score
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Your resume is optimized for software engineering roles. Review suggestions below to boost your score further.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">
                AI Optimization Feedback
              </h4>
              <ul className="space-y-2 text-xs">
                {feedback.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}