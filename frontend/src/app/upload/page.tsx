// frontend/src/app/upload/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, UploadCloud, X, Loader2, CheckCircle2 } from "lucide-react";
// import AppShell from "@/components/layout/AppShell";
import AppShell from "../../components/layout/AppShell"; // Adjust the path as necessary
import { Button } from "@/components/ui/button";

const TARGET_ROLES = [
  "Software Engineer",
  "Full Stack Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Senior Full Stack Engineer",
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);
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
      formData.append("targetRole", targetRole);

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
      <div className="p-8 max-w-3xl mx-auto space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Upload your resume
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            A PDF, up to 5MB. We'll run a deterministic ATS audit and score it against your target role.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Target role
          </label>
          <div className="flex flex-wrap gap-2">
            {TARGET_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setTargetRole(role)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  targetRole === role
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                {...getRootProps()}
                className={`rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-accent/40"
                    : "border-border bg-secondary/20 hover:border-primary/40 hover:bg-accent/20"
                }`}
              >
                <input {...getInputProps()} />
                <div className="mx-auto w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
                  <UploadCloud className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {isDragActive ? "Drop your resume here" : "Drag and drop your resume, or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">PDF only, up to 5MB</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                </div>

                {!loading && !succeeded && (
                  <button
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {succeeded && <CheckCircle2 className="w-5 h-5 text-score-good shrink-0" />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="p-3 bg-score-bad/10 border border-score-bad/20 text-score-bad text-sm rounded-lg">
            {error}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || loading || succeeded}
          className="w-full h-11 text-sm font-medium flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {succeeded ? "Analysis ready — redirecting..." : loading ? "Analyzing resume..." : "Upload and analyze"}
        </Button>
      </div>
    </AppShell>
  );
}
