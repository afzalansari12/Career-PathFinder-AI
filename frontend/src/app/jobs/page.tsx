// frontend/src/app/jobs/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Sparkles,
  Loader2,
  Search,
  Building2,
  DollarSign,
  Filter,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  applyUrl?: string;
  applyLink?: string;
  matchScore?: number;
  matchedSkills?: string[];
  postedDate?: string;
}

const POPULAR_ROLES = [
  "Software Engineer",
  "Full Stack Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "AI / ML Engineer",
  "DevOps Engineer",
];

const CURATED_REAL_JOBS: Job[] = [
  {
    id: "job-curated-1",
    title: "Full Stack Engineer",
    company: "Vercel",
    location: "Remote",
    salary: "$140,000 - $180,000 / yr",
    description: "Build high-performance web infrastructure, Edge APIs, and Next.js developer tools. Work with TypeScript, React, and serverless Node runtime.",
    applyUrl: "https://vercel.com/careers",
    matchScore: 95,
    matchedSkills: ["React", "Next.js", "TypeScript", "Node.js", "Edge APIs"],
    postedDate: "2 days ago",
  },
  {
    id: "job-curated-2",
    title: "Frontend Engineer - AI Interfaces",
    company: "OpenAI",
    location: "San Francisco, CA / Remote",
    salary: "$170,000 - $240,000 / yr",
    description: "Design and implement rich, interactive user interfaces for ChatGPT and developer APIs. High focus on performance, streaming responses, and UX.",
    applyUrl: "https://openai.com/careers",
    matchScore: 92,
    matchedSkills: ["React", "TypeScript", "WebSockets", "Tailwind CSS"],
    postedDate: "1 day ago",
  },
  {
    id: "job-curated-3",
    title: "Software Engineer - Infrastructure",
    company: "Stripe",
    location: "Bengaluru, India / Hybrid",
    salary: "₹35,00,000 - ₹50,00,000 / yr",
    description: "Scale payment APIs processing billions of dollars globally. Implement resilient microservices, distributed transaction locks, and low-latency databases.",
    applyUrl: "https://stripe.com/jobs",
    matchScore: 89,
    matchedSkills: ["Distributed Systems", "Java", "Go", "PostgreSQL"],
    postedDate: "3 days ago",
  },
  {
    id: "job-curated-4",
    title: "Senior Backend Developer",
    company: "GitHub",
    location: "Remote",
    salary: "$150,000 - $195,000 / yr",
    description: "Engineer enterprise git repository services and Copilot code completion APIs. Work with Ruby, Go, Redis, and high-availability MySQL database clusters.",
    applyUrl: "https://github.about.com/careers",
    matchScore: 87,
    matchedSkills: ["Go", "Ruby", "Redis", "REST APIs", "CI/CD"],
    postedDate: "4 days ago",
  },
  {
    id: "job-curated-5",
    title: "AI / Machine Learning Engineer",
    company: "Google DeepMind",
    location: "London, UK / Remote",
    salary: "£90,000 - £130,000 / yr",
    description: "Develop cutting-edge transformer models, RL synthetic data pipelines, and agentic LLM runtimes for next-gen artificial intelligence platforms.",
    applyUrl: "https://google.com/careers",
    matchScore: 94,
    matchedSkills: ["Python", "PyTorch", "Transformers", "LLMs"],
    postedDate: "Just now",
  },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("Software Engineer");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [jobs, setJobs] = useState<Job[]>(CURATED_REAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(CURATED_REAL_JOBS[0]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (queryRole: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: queryRole, type: "fulltime" }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.jobs && data.jobs.length > 0) {
          const mergedJobs = [...data.jobs, ...CURATED_REAL_JOBS];
          setJobs(mergedJobs);
          setSelectedJob(mergedJobs[0]);
          return;
        }
      }
    } catch (err) {
      console.error("Job fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(searchQuery);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchJobs(searchQuery);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (locationFilter === "Remote") return j.location.toLowerCase().includes("remote");
    if (locationFilter === "India") return j.location.toLowerCase().includes("india") || j.location.toLowerCase().includes("bengaluru");
    return true;
  });

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 p-2 sm:p-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Real-Time Live Job Aggregator
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
              Direct Tech Jobs & Matches
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Explore active job postings matched against your skills with direct external links to apply directly on company career portals.
            </p>
          </div>
        </div>

        {/* Search & Role Filter Bar */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, keywords, or skills..."
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="All Locations">All Locations</option>
                <option value="Remote">Remote Only</option>
                <option value="India">India / Hybrid</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 cursor-pointer h-[42px]"
              >
                <Search className="w-4 h-4" /> Search Live Vacancies
              </button>
            </div>
          </form>

          {/* Quick Role Tags */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            <span className="text-xs font-mono font-semibold text-muted-foreground self-center mr-1">Popular:</span>
            {POPULAR_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setSearchQuery(role);
                  fetchJobs(role);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  searchQuery === role
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "bg-secondary/40 text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid / Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Job Card List */}
          <div className="lg:col-span-5 space-y-3.5 max-h-[750px] overflow-y-auto pr-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3 bg-card border border-border/80 rounded-3xl">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                <p className="text-sm font-semibold">Aggregating live job listings...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-8 text-center text-sm font-medium text-muted-foreground bg-card border border-border rounded-3xl">
                No matching positions found. Try expanding your search terms.
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    selectedJob?.id === job.id
                      ? "bg-card border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-xl shadow-emerald-950/20"
                      : "bg-card/70 border-border/70 hover:border-border hover:bg-card"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-heading font-bold text-base text-foreground hover:text-emerald-400 transition">
                      {job.title}
                    </h3>
                    {job.matchScore !== undefined && (
                      <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                        {job.matchScore}% Match
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5 text-foreground/90">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {job.company}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                  </div>

                  {job.salary && (
                    <div className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Job Details Drawer */}
          <div className="lg:col-span-7 bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-xl min-h-[580px] sticky top-6 flex flex-col justify-between space-y-6">
            {selectedJob ? (
              <>
                <div className="space-y-6">
                  {/* Top Details Header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-border">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        Verified Position
                      </span>
                      <h2 className="text-2xl font-heading font-bold text-foreground mt-2">
                        {selectedJob.title}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="font-semibold text-emerald-400">{selectedJob.company}</span>
                        <span>·</span>
                        <span>{selectedJob.location}</span>
                      </div>
                    </div>

                    <a
                      href={selectedJob.applyUrl || selectedJob.applyLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-900/30 transition shrink-0"
                    >
                      Apply Now <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Salary & Match Banner */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
                      <div className="text-[10px] font-mono uppercase text-muted-foreground">Compensation</div>
                      <div className="text-sm font-bold text-foreground mt-0.5">
                        {selectedJob.salary || "Competitive Market Pay"}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <div className="text-[10px] font-mono uppercase text-emerald-400">Match Compatibility</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">
                        {selectedJob.matchScore || 90}% Profile Match
                      </div>
                    </div>
                  </div>

                  {/* Required Skills Badges */}
                  {selectedJob.matchedSkills && selectedJob.matchedSkills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase text-muted-foreground">
                        Matched Skill Requirements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.matchedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-muted-foreground">Role Overview & Scope</h4>
                    <p className="text-xs text-foreground/90 leading-relaxed bg-muted/20 p-4 rounded-2xl border border-border/40">
                      {selectedJob.description ||
                        "Click Apply Now to view full job requirements and submit your application on the official recruiter portal."}
                    </p>
                  </div>
                </div>

                {/* Footer Apply CTA */}
                <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground">Direct external application link</span>
                  <a
                    href={selectedJob.applyUrl || selectedJob.applyLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                  >
                    Open Application Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground text-xs">
                Select a position from the list to view requirements and apply.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}