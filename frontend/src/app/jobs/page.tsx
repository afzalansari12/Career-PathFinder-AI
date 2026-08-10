// frontend/src/app/jobs/page.tsx
"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { RealJob } from "@/app/api/jobs/route";
import { Briefcase, MapPin, ExternalLink, Sparkles, Loader2 } from "lucide-react";

const TARGET_ROLES = [
  "Software Engineer",
  "Full Stack Engineer",
  "Frontend Engineer",
  "Backend Engineer",
];

export default function JobsPage() {
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0]);
  const [jobs, setJobs] = useState<RealJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<RealJob | null>(null);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        let userSkills = ["React", "TypeScript", "Next.js", "C++"];

        // Safely attempt profile fetch
        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.profile?.skills?.length) {
            userSkills = profileData.profile.skills;
          }
        }

        // Query live jobs endpoint
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: selectedRole, userSkills }),
        });

        if (!res.ok) {
          throw new Error(`Jobs API returned status ${res.status}`);
        }

        const data = await res.json();
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
          setSelectedJob(data.jobs[0]);
        } else {
          setJobs([]);
          setSelectedJob(null);
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
        setJobs([]);
        setSelectedJob(null);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [selectedRole]);

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
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                  selectedJob?.id === job.id
                    ? "bg-card border-primary ring-1 ring-primary shadow-xs"
                    : "bg-card border-border hover:border-border/80"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-foreground">{job.title}</h3>
                  <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                    {job.matchScore}% Match
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-primary" />{job.company}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-8 shadow-2xs min-h-[600px] sticky top-6 flex flex-col justify-between">
          {selectedJob ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-border">
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground">{selectedJob.title}</h2>
                  <p className="text-xs font-semibold text-primary mt-1">{selectedJob.company} · {selectedJob.location}</p>
                </div>
                <a
                  href={selectedJob.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-2xs"
                >
                  Apply Directly <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Role Description</h4>
                <p className="text-xs text-foreground/90 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Skill Matches</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.matchedSkills?.map((skill) => (
                    <span key={skill} className="text-xs bg-accent text-accent-foreground font-semibold px-2.5 py-1 rounded-md border border-border">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-xs">
              Select a position from the left panel to inspect match parameters and apply.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}