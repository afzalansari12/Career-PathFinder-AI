// frontend/src/app/upload/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, UploadCloud, X, Loader2, CheckCircle2, BrainCircuit, Sparkles, FileCode, Zap } from "lucide-react";
import AppShell from "@/components/layout/AppShell";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState(
    "Full Stack Software Engineer position requiring TypeScript, React, Next.js, System Design, PostgreSQL performance tuning, and Docker containerization."
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    setError(null);
    if (rejected.length > 0) {
      const reason = rejected[0]?.errors?.[0]?.code;
      if (reason === "file-too-large") setError("File is larger than 5MB.");
      else if (reason === "file-invalid-type") setError("Only PDF files are supported.");
      else setError("That file couldn't be accepted.");
      return;
    }
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/upload", { method: "POST", body: formData });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `Server error: ${res.status}` }));
        throw new Error(errorData.error || "Failed to upload file");
      }

      setSucceeded(true);
      setTimeout(() => router.push("/dashboard/resume"), 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 p-3 sm:p-6">
        {/* Mesh Glow Hero Banner matching Dashboard */}
        <div className="relative z-30 rounded-3xl bg-gradient-to-br from-card via-card/95 to-emerald-950/30 border border-emerald-500/30 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-28 -right-28 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-mono font-semibold">
                <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" /> Job Description ATS Alignment Engine
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                ATS Resume & Job Match Audit
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Paste the target Job Description and upload your resume to calculate your exact ATS match score, missing skills, and tailoring recommendations for that job opening.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-card/80 p-4 rounded-2xl border border-border/80 text-xs font-mono text-emerald-400 shadow-md">
              <Zap className="w-4 h-4" /> JD Keyword Evaluator Active
            </div>
          </div>
        </div>

        {/* Target Job Description Textarea Section */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-3">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-foreground">
              <FileCode className="w-4 h-4 text-emerald-400" /> Target Job Description (JD)
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              Paste the full job requirements, qualifications, and responsibilities
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

        {/* Dropzone Container */}
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                {...getRootProps()}
                className={`rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 shadow-xl ${
                  isDragActive
                    ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
                    : "border-border/80 bg-card hover:border-emerald-500/50 hover:bg-card/90"
                }`}
              >
                <input {...getInputProps()} />
                <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-foreground">
                  {isDragActive ? "Drop your resume here" : "Drag and drop your PDF resume, or click to browse"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">PDF format only, maximum 5MB</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{formatBytes(file.size)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

              <div className="pt-2">
                <button
                  onClick={handleUpload}
                  disabled={loading || succeeded || !jobDescription.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Resume Against Job Description...
                    </>
                  ) : succeeded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Audit Complete! Redirecting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Calculate ATS Score for Target Job Description
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
