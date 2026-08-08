"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = { "application/pdf": [".pdf"] };

type UploadStatus = "idle" | "uploading" | "success" | "error";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function UploadPage() {
  const { user, isLoaded } = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleRemoveFile = () => {
    setFile(null);
    setStatus("idle");
    setError(null);
    setProgress(0);
    setAnalysis(null);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      setError(null);
      setStatus("idle");
      setProgress(0);
      setAnalysis(null);

      if (rejections.length > 0) {
        const rejection = rejections[0];
        const code = rejection.errors[0]?.code;
        if (code === "file-too-large") {
          setError("File is too large. Maximum size is 5MB.");
        } else if (code === "file-invalid-type") {
          setError("Only PDF files are accepted.");
        } else {
          setError("This file could not be accepted.");
        }
        setFile(null);
        return;
      }

      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxSize: MAX_SIZE_BYTES,
      multiple: false,
      disabled: status === "uploading",
    });

  const handleUpload = async () => {
    if (!file || !user) return;

    setStatus("uploading");
    setError(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + 10));
    }, 150);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      // Fetch latest analysis data after successful upload
      const analysisRes = await fetch(`/api/resume?userId=${user.id}`);
      const analysisData = await analysisRes.json();

      if (analysisData.success) {
        setAnalysis(analysisData.data);
      } else {
        setAnalysis(result.analysis);
      }

      clearInterval(interval);
      setProgress(100);
      setStatus("success");
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const isUploadDisabled =
    !file || !isLoaded || !user || status === "uploading" || status === "success";

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Safe accessor for analysis payload structure
  const resultData = analysis?.analysis ?? analysis;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-muted/50 to-background px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Upload your resume
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Upload a PDF file, up to 5MB, and we&apos;ll take it from there.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "group relative flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
              isDragActive && !isDragReject && "border-primary bg-primary/5",
              isDragReject && "border-destructive bg-destructive/5",
              !isDragActive &&
                "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40",
              status === "uploading" && "pointer-events-none opacity-60"
            )}
          >
            <input {...getInputProps()} />

            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-colors",
                isDragActive && !isDragReject && "bg-primary/10",
                "group-hover:bg-primary/10"
              )}
            >
              <UploadCloud
                className={cn(
                  "h-8 w-8 text-muted-foreground transition-colors",
                  "group-hover:text-primary",
                  isDragActive && !isDragReject && "text-primary"
                )}
              />
            </div>

            <div>
              <p className="text-sm font-medium sm:text-base">
                {isDragActive
                  ? "Drop your resume here"
                  : "Drag & drop your resume here"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                or click to browse from your device
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              PDF only &middot; up to 5MB
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Selected file */}
          {file && (
            <div className="mt-4 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  {status === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                  </p>
                </div>

                {status !== "uploading" && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    aria-label="Remove file"
                    className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Progress bar */}
              {status === "uploading" && (
                <div className="mt-4 space-y-1.5">
                  <Progress value={progress} className="h-2" />
                  <p className="text-right text-xs text-muted-foreground">
                    {progress}%
                  </p>
                </div>
              )}

              {status === "success" && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Upload complete
                </p>
              )}
            </div>
          )}

          {/* Upload button */}
          <Button
            onClick={handleUpload}
            disabled={isUploadDisabled}
            className="mt-6 w-full"
            size="lg"
          >
            {status === "uploading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Uploaded
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload resume
              </>
            )}
          </Button>
        </div>

        {/* Resume Analysis Output */}
        {resultData && (
          <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Resume Analysis</h2>

            <div className="space-y-6">
              {resultData.ats_score !== undefined && (
                <div>
                  <h3 className="font-semibold text-muted-foreground">
                    ATS Score
                  </h3>
                  <p className="text-2xl font-bold">{resultData.ats_score}/100</p>
                </div>
              )}

              {resultData.summary && (
                <div>
                  <h3 className="font-semibold text-muted-foreground">
                    Summary
                  </h3>
                  <p className="mt-1 text-sm">{resultData.summary}</p>
                </div>
              )}

              {resultData.strengths?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-muted-foreground">
                    Strengths
                  </h3>
                  <ul className="mt-2 list-disc ml-5 space-y-1 text-sm">
                    {resultData.strengths.map(
                      (item: string, index: number) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {resultData.weaknesses?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-muted-foreground">
                    Weaknesses
                  </h3>
                  <ul className="mt-2 list-disc ml-5 space-y-1 text-sm">
                    {resultData.weaknesses.map(
                      (item: string, index: number) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {resultData.suggestions?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-muted-foreground">
                    Suggestions
                  </h3>
                  <ul className="mt-2 list-disc ml-5 space-y-1 text-sm">
                    {resultData.suggestions.map(
                      (item: string, index: number) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}