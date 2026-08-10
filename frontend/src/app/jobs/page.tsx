"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { Briefcase, MapPin, ExternalLink, Sparkles, Loader2 } from "lucide-react";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  applyUrl?: string;
  applyLink?: string;
  matchScore?: number;
  matchedSkills?: string[];
}

const TARGET_ROLES = [
  "Software Engineer",
  "Full Stack Engineer",
  "Frontend Engineer",
  "Backend Engineer",
];

export default function JobsPage() {
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0]);
  const [roleInitialized, setRoleInitialized] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>(["React", "TypeScript", "Next.js", "C++"]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile?.skills?.length) {
            setUserSkills(data.profile.skills);
          }
          const target = data.profile?.targetRole;
          if (target) {
            const match = TARGET_ROLES.find(
              (r) => r.toLowerCase().includes(target.toLowerCase()) || target.toLowerCase().includes(r.toLowerCase())
            );
            setSelectedRole(match || target);
          }
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setRoleInitialized(true);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    if (!roleInitialized) return;

    async function loadJobs() {
      setLoading(true);
      try {
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: selectedRole, userSkills }),
        });

        if (!res.ok) throw new Error("Failed to load jobs");

        const data = await res.json();
        const liveJobs: Job[] = data.jobs || [];

        setJobs(liveJobs);
        setSelectedJob(liveJobs[0] || null);
      } catch (err) {
        console.error("Job retrieval error:", err);
        setJobs([]);
        setSelectedJob(null);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [selectedRole, userSkills, roleInitialized]);

  return (
    <AppShell>
      <div className="-mt-6 -mx-6 lg:-mt-10 lg:-mx-10 border-b border-border bg-card px-6 py-3 mb-6 flex items-center justify-between shadow-2xs">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" /> Real-Time Aggregator
        </span>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-card border border-border text-foreground text-xs font-bold rounded-xl px-4 py-1.5 shadow-2xs focus:outline-none cursor-pointer"
        >
          {TARGET_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-3 max-h-[780px] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs font-medium">Fetching live listings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground bg-card border border-border rounded-2xl">
              No positions found. Try selecting another target role.
            </div>
          ) : (
            jobs.map((job) => (
              <JobCardItem
                key={job.id}
                job={job}
                isActive={selectedJob?.id === job.id}
                onSelect={() => setSelectedJob(job)}
              />
            ))
          )}
        </div>

        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-8 shadow-2xs min-h-[600px] sticky top-6 flex flex-col justify-between">
          <JobDetailsPanel job={selectedJob} />
        </div>
      </div>
    </AppShell>
  );
}

function JobCardItem({
  job,
  isActive,
  onSelect,
}: {
  job: Job;
  isActive: boolean;
  onSelect: () => void;
}) {
  const destinationUrl = job.applyUrl || job.applyLink || "#";

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
        isActive
          ? "bg-card border-primary ring-1 ring-primary shadow-xs"
          : "bg-card border-border hover:border-border/80"
      }`}
    >
      <div className="flex justify-between items-start">
        <a
          href={destinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-bold text-sm text-foreground hover:text-primary hover:underline underline-offset-2"
        >
          {job.title}
        </a>
        {job.matchScore !== undefined && (
          <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
            {job.matchScore}% Match
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Briefcase className="w-3 h-3 text-primary" />
          {job.company}
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {job.location}
        </span>
      </div>
    </div>
  );
}

function JobDetailsPanel({ job }: { job: Job | null }) {
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-xs">
        Select a position from the left panel to inspect match parameters and apply.
      </div>
    );
  }

  const destinationUrl = job.applyUrl || job.applyLink || "#";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">{job.title}</h2>
          <p className="text-xs font-semibold text-primary mt-1">
            {job.company} · {job.location}
          </p>
        </div>

        <a
          href={destinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-2xs shrink-0"
        >
          Apply Directly <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Role Description
        </h4>
        <p className="text-xs text-foreground/90 leading-relaxed">
          {job.description || "Click Apply Directly to inspect full job requirements on the recruiter portal."}
        </p>
      </div>

      {job.matchedSkills && job.matchedSkills.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Skill Matches
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {job.matchedSkills.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-accent text-accent-foreground font-semibold px-2.5 py-1 rounded-md border border-border"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}