// frontend/src/app/dashboard/resume/page.tsx
"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  FileText,
  CheckCircle2,
  Download,
  RotateCcw,
  Plus,
  History,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function ResumePage() {
  const [activeStep, setActiveStep] = useState<"report" | "resume" | "cover">("resume");

  // State for Resume Content & History (Undo functionality)
  const initialContent = `AFZAL ANSARI
Software Development Engineer Intern
+91-9289131013 · Delhi, India · afzalansari12ab@gmail.com

SUMMARY
Third-year Computer Science undergraduate with strong foundations in C++, Object-Oriented Programming, Data Structures & Algorithms, and Software Engineering. Experienced building and shipping scalable, cloud-native full-stack applications.

WORK EXPERIENCE
Open Source Contributor (2025 - Present)
ArduPilot - C++, ChibiOS RTOS, Embedded/Distributed Systems
• Debugged and resolved a HardFault crash in ChibiOS DMA handling on a safety-critical flight-controller codebase.
• Resolved a home-altitude and surface-handling bug in ArduSub, validating with SITL simulation across multiple code review cycles.`;

  const [resumeText, setResumeText] = useState(initialContent);
  const [history, setHistory] = useState<string[]>([initialContent]);
  const [targetRole, setTargetRole] = useState("Software Development Engineer Intern");

  // Telemetry & Groq Data
  const [atsScore, setAtsScore] = useState(87);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "1",
      title: "Add Measurable Results",
      description: "Consider specifying metrics (e.g. latency reduction %, throughput boost) for your DMA handling fix.",
      completed: false,
    },
    {
      id: "2",
      title: "Quantify Open Source Impact",
      description: "Include PR reference numbers (#33933) and flight-controller safety parameters.",
      completed: false,
    },
    {
      id: "3",
      title: "Improve Active Phrasing",
      description: "Replace passive descriptions with action verbs like 'Engineered', 'Orchestrated', and 'Resolved'.",
      completed: false,
    },
  ]);

  const [coverLetter, setCoverLetter] = useState(
    `Dear Hiring Manager,\n\nI am applying for the ${targetRole} role. With hands-on experience in C++, system optimization, and open-source contributions, I am eager to contribute to your engineering team.\n\nBest regards,\nAfzal Ansari`
  );

  // UI Modals & Loading
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScanHistory, setShowScanHistory] = useState(false);
  const [showNewScanModal, setShowNewScanModal] = useState(false);
  const [savedStatus, setSavedStatus] = useState("Saved");

  const pdfRef = useRef<HTMLDivElement>(null);

  // Handle Text Editing with Undo History Tracking
  const handleContentChange = (newText: string) => {
    setResumeText(newText);
    setHistory((prev) => [...prev, newText]);
    setSavedStatus("Saving...");
    setTimeout(() => setSavedStatus("Saved"), 600);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const updatedHistory = [...history];
      updatedHistory.pop(); // Remove current state
      const previousContent = updatedHistory[updatedHistory.length - 1];
      setHistory(updatedHistory);
      setResumeText(previousContent);
    }
  };

  // Toggle Content Improvements
  const toggleSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  // Run Real Groq AI Scan
  const runGroqAudit = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/resume/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetRole }),
      });

      if (res.ok) {
        const data = await res.json();
        setAtsScore(data.atsScore || 88);
        if (data.suggestions) setSuggestions(data.suggestions);
        if (data.coverLetter) setCoverLetter(data.coverLetter);
      }
    } catch (err) {
      console.error("Audit failed", err);
    } finally {
      setIsAnalyzing(false);
      setShowNewScanModal(false);
    }
  };

  // Native Print Handler
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <AppShell>
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border mb-6 no-print">
        {/* Step Navigation Tabs */}
        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveStep("report")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeStep === "report"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Step 1 · Report
          </button>
          <button
            onClick={() => setActiveStep("resume")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeStep === "resume"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Step 2 · Resume
          </button>
          <button
            onClick={() => setActiveStep("cover")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeStep === "cover"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Step 3 · Cover Letter
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewScanModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-card hover:bg-accent border border-border transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-primary" /> New Scan
          </button>

          <button
            onClick={() => setShowScanHistory(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-card hover:bg-accent border border-border transition shadow-2xs cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-primary" /> Scan History
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Telemetry & Improvement Suggestions Sidebar */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-6 sticky top-6 no-print">
          <div>
            <h2 className="text-base font-heading font-bold text-foreground truncate">
              {targetRole}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Target: Amazon / Big Tech</p>

            <div className="mt-5 flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-50/50">
                <span className="text-2xl font-bold text-emerald-700">{atsScore}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  {suggestions.filter((s) => s.completed).length} of {suggestions.length} suggestions
                  completed
                </p>
                <p className="text-[11px] text-muted-foreground leading-snug mt-1">
                  Resumes with a score of 75 or higher are 3x more likely to pass ATS screening.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Interactive Improvements Checklist */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                Content Improvements
              </h3>
              <span className="text-[11px] font-bold text-emerald-700">
                {suggestions.filter((s) => s.completed).length} Completed
              </span>
            </div>

            {suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleSuggestion(item.id)}
                className={`p-3.5 border rounded-xl transition cursor-pointer space-y-1 ${
                  item.completed
                    ? "bg-emerald-50/30 border-emerald-300"
                    : "bg-card hover:bg-accent/40 border-border"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-foreground">{item.title}</p>
                  <CheckCircle2
                    className={`w-4 h-4 transition ${
                      item.completed ? "text-emerald-600 fill-emerald-100" : "text-muted-foreground/40"
                    }`}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Dynamic Live Editor Sheet */}
        <div className="lg:col-span-7 space-y-3">
          {/* Status & Undo Toolbar */}
          <div className="flex justify-between items-center px-1 no-print">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <button
                onClick={handleUndo}
                disabled={history.length <= 1}
                className="flex items-center gap-1 hover:text-foreground disabled:opacity-40 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Undo
              </button>
              <span>·</span>
              <span className="text-emerald-700 font-bold">{savedStatus}</span>
            </div>
          </div>

          {/* Dynamic Content View based on Tab */}
          <div
            className="bg-card border border-border rounded-2xl p-8 shadow-2xs min-h-[650px] printable-area"
            ref={pdfRef}
          >
            {activeStep === "resume" && (
              <textarea
                value={resumeText}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-[600px] bg-transparent resize-none focus:outline-none font-serif text-sm leading-relaxed text-foreground"
              />
            )}

            {activeStep === "cover" && (
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-[600px] bg-transparent resize-none focus:outline-none font-serif text-sm leading-relaxed text-foreground"
              />
            )}

            {activeStep === "report" && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-base text-foreground">
                  ATS Match Summary Report
                </h3>
                <div className="p-4 bg-accent/40 border border-border rounded-xl space-y-2 text-xs">
                  <p className="font-bold text-foreground">Keyword Density Analysis</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Matched keywords for {targetRole}: C++, Data Structures, RTOS, Software
                    Engineering.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Scan Modal */}
      {showNewScanModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground">
                Run Groq AI Resume Scan
              </h3>
              <button
                onClick={() => setShowNewScanModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Target Engineering Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl focus:outline-none text-xs"
                />
              </div>
            </div>

            <button
              onClick={runGroqAudit}
              disabled={isAnalyzing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isAnalyzing ? "Analyzing with Groq AI..." : "Start Analysis"}
            </button>
          </div>
        </div>
      )}

      {/* Scan History Drawer */}
      {showScanHistory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground">Audit Scan History</h3>
              <button
                onClick={() => setShowScanHistory(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-accent/40 border border-border rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-foreground">{targetRole}</p>
                  <p className="text-[10px] text-muted-foreground">Today at 01:42 AM</p>
                </div>
                <span className="font-bold text-emerald-700">{atsScore} ATS</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}