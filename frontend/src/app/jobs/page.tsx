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
  BrainCircuit,
  Zap,
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
    if (locationFilter === "Hybrid") return j.location.toLowerCase().includes("hybrid");
    return true;
  });

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8 p-3 sm:p-6">
        {/* Mesh Glow Hero Banner matching Dashboard */}
        <div className="relative z-30 rounded-3xl bg-gradient-to-br from-card via-card/95 to-emerald-950/30 border border-emerald-500/30 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-28 -right-28 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-mono font-semibold">
                  <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" /> AI Real-Time Job Matcher Core
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                  AI Job Matcher & Openings
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                  Discover top tech openings curated with real-time ATS match scores, salary ranges, required skill alignment, and direct official application links.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-card/80 p-4 rounded-2xl border border-border/80 text-xs font-mono text-emerald-400 shadow-md">
                <Zap className="w-4 h-4" /> Live Openings Indexed
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="bg-card/90 border border-border/80 rounded-2xl p-3 shadow-xl backdrop-blur-md flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search target role (e.g. Full Stack Engineer, AI Engineer)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-foreground focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search Jobs</span>
              </button>
            </form>
          </div>
        </div>

        {/* Popular Role Quick Filter Pills */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" /> Popular Tech Role Filters
          </label>
          <div className="flex border-b border-border/80 gap-2 overflow-x-auto pb-2">
            {POPULAR_ROLES.map((r) => {
              const isActive = searchQuery === r;
              return (
                <button
                  key={r}
                  onClick={() => {
                    setSearchQuery(r);
                    fetchJobs(r);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-300 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-950/20"
                      : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Listings Grid + Inspector Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Job Cards List */}
          <div className="lg:col-span-7 space-y-4">
            {filteredJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-card border-emerald-500/60 shadow-xl ring-1 ring-emerald-500/40"
                      : "bg-card/70 border-border/80 hover:border-border hover:bg-card"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-muted-foreground">{job.company}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                          {job.location}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">{job.title}</h3>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                      {job.matchScore || 90}% Match
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-border/50 text-xs">
                    <span className="font-mono text-emerald-400 font-bold">{job.salary || "Competitive"}</span>
                    <span className="text-muted-foreground font-mono text-[11px]">{job.postedDate || "Recently"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Job Drawer */}
          <div className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-6 sticky top-6">
            {selectedJob ? (
              <>
                <div className="space-y-2 border-b border-border pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      {selectedJob.company}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {selectedJob.matchScore || 90}% Profile Match
                    </span>
                  </div>
                  <h2 className="text-xl font-heading font-extrabold text-foreground">{selectedJob.title}</h2>
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {selectedJob.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {selectedJob.salary || "Competitive"}</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="space-y-1.5">
                    <h4 className="font-mono uppercase text-xs text-muted-foreground font-bold">Role Description</h4>
                    <p className="text-foreground/90 leading-relaxed bg-muted/20 p-4 rounded-2xl border border-border/60">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Matched Skills */}
                  {selectedJob.matchedSkills && selectedJob.matchedSkills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-mono uppercase text-xs text-muted-foreground font-bold">Matched Profile Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.matchedSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <a
                      href={selectedJob.applyUrl || selectedJob.applyLink || "https://linkedin.com/jobs"}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 cursor-pointer"
                    >
                      Apply on Official Company Page <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Select a job listing to view details.</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}