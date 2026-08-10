// frontend/src/app/dashboard/jobs/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import { Briefcase, MapPin, DollarSign, ExternalLink, Sparkles, Loader2, GraduationCap } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  applyUrl: string;
  matchScore: number;
  postedDate: string;
}

export default function JobsPage() {
  const [targetRole, setTargetRole] = useState("Frontend Engineer");
  const [jobType, setJobType] = useState<"fulltime" | "internship">("fulltime");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    "Frontend Engineer",
    "Full Stack Engineer",
    "Software Engineer",
    "Backend Engineer",
    "C++ Developer",
  ];

  const fetchJobs = useCallback(async (role: string, type: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/jobs?role=${encodeURIComponent(role)}&type=${type}`);
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
          setSelectedJob(data.jobs[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load positions:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(targetRole, jobType);
  }, [targetRole, jobType, fetchJobs]);

  return (
    <AppShell>
      {/* Header Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Real-Time Opportunities Aggregator
        </div>

        <div className="flex items-center gap-3">
          {/* Job / Internship Type Switcher */}
          <div className="flex items-center bg-secondary/60 p-1 rounded-xl border border-border">
            <button
              onClick={() => setJobType("fulltime")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                jobType === "fulltime"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Full-Time
            </button>
            <button
              onClick={() => setJobType("internship")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                jobType === "internship"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Internship
            </button>
          </div>

          {/* Role Dropdown */}
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="p-2.5 bg-card border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer shadow-2xs"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Positions List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {jobType === "internship" ? "INTERNSHIP OPENINGS" : "FULL-TIME POSITIONS"} ({jobs.length})
            </span>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
          </div>

          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`p-4 border rounded-2xl transition cursor-pointer space-y-2 ${
                selectedJob?.id === job.id
                  ? "bg-card border-emerald-500 shadow-xs"
                  : "bg-card border-border hover:border-accent"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-foreground line-clamp-1">{job.title}</h3>
                  <p className="text-[11px] font-semibold text-muted-foreground">{job.company}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  {job.matchScore}% Match
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {job.location}
                </span>
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <DollarSign className="w-3 h-3 text-emerald-600" /> {job.salary}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Detail Inspection View */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-2xs sticky top-6 min-h-[500px]">
          {selectedJob ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-border">
                <div>
                  <h2 className="text-base font-heading font-bold text-foreground">{selectedJob.title}</h2>
                  <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                    {selectedJob.company} · {selectedJob.location}
                  </p>
                </div>
                    <button
                    type="button"
                    onClick={() => {
                        if (selectedJob?.applyUrl) {
                        window.open(selectedJob.applyUrl, "_blank", "noopener,noreferrer");
                        }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer shrink-0"
                    >
                    Apply Directly <ExternalLink className="w-3.5 h-3.5" />
                    </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-accent/40 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Comp / Stipend</span>
                  <p className="font-bold text-emerald-700">{selectedJob.salary}</p>
                </div>
                <div className="p-3 bg-accent/40 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Posted</span>
                  <p className="font-bold text-foreground">{selectedJob.postedDate}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h3 className="font-bold uppercase text-muted-foreground tracking-wider">Role Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              Select an opening to view details and apply.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}