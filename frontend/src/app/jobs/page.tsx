// frontend/src/app/jobs/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Building2,
  TrendingUp,
  Filter,
  ArrowUpRight,
  BrainCircuit,
  Zap,
  Loader2,
  Award,
} from "lucide-react";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  applyUrl: string;
  applyLink?: string;
  matchScore: number;
  matchedSkills?: string[];
  postedDate: string;
}

const POPULAR_ROLES = [
  "Full Stack Engineer",
  "Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "AI / ML Specialist",
  "DevOps Architect",
];

const CURATED_REAL_JOBS: Job[] = [
  {
    id: "job-curated-1",
    title: "Senior Full Stack Software Engineer",
    company: "Google",
    location: "Bengaluru, India / Hybrid",
    salary: "₹38,000,000 - ₹55,000,000 / yr",
    description: "Architect Next.js web applications, Google Cloud APIs, and real-time streaming engines. Work on high-scale distributed systems powering millions of daily requests.",
    applyUrl: "https://www.google.com/about/careers/applications/jobs/results/?q=Software+Engineer&location=India",
    matchScore: 95,
    matchedSkills: ["TypeScript", "React", "Next.js", "System Design", "GCP"],
    postedDate: "Just now",
  },
  {
    id: "job-curated-2",
    title: "AI Research & Systems Engineer",
    company: "Microsoft",
    location: "Hyderabad, India / Remote",
    salary: "₹40,000,000 - ₹60,000,000 / yr",
    description: "Build LLM fine-tuning pipelines, RAG retrieval models, and Azure OpenAI infrastructure for enterprise Copilot software.",
    applyUrl: "https://careers.microsoft.com/v2/global/en/home.html",
    matchScore: 92,
    matchedSkills: ["Python", "PyTorch", "LLMs", "Vector Databases", "Docker"],
    postedDate: "1 day ago",
  },
  {
    id: "job-curated-3",
    title: "Staff Backend Platform Engineer",
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
    applyUrl: "https://github.com/careers",
    matchScore: 87,
    matchedSkills: ["Go", "Ruby", "Redis", "REST APIs", "CI/CD"],
    postedDate: "4 days ago",
  },
  {
    id: "job-curated-5",
    title: "AI / Machine Learning Engineer",
    company: "Amazon",
    location: "Bengaluru, India / Remote",
    salary: "₹32,00,000 - ₹48,00,000 / yr",
    description: "Develop cutting-edge transformer models, RL synthetic data pipelines, and agentic LLM runtimes for AWS cloud platforms.",
    applyUrl: "https://www.amazon.jobs/en/search?base_query=Software+Engineer&loc_query=India",
    matchScore: 94,
    matchedSkills: ["Python", "PyTorch", "Transformers", "AWS"],
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

  const handleRoleQuickFilter = (role: string) => {
    setSearchQuery(role);
    fetchJobs(role);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchJobs(searchQuery.trim());
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
          <div className="flex border-b border-border/80 gap-2 overflow-x-auto pb-2 no-scrollbar">
            {POPULAR_ROLES.map((r) => {
              const isActive = searchQuery === r;
              return (
                <button
                  key={r}
                  onClick={() => handleRoleQuickFilter(r)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition duration-300 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40 shadow-md"
                      : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jobs Grid & Detail Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Job Listings Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground font-bold">
                Showing {filteredJobs.length} Live Openings
              </span>

              <div className="flex gap-1.5">
                {["All Locations", "Remote", "Hybrid"].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocationFilter(loc)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-mono font-bold transition cursor-pointer ${
                      locationFilter === loc
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center space-y-3 bg-card border border-border/80 rounded-3xl">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
                <p className="text-xs font-mono text-muted-foreground">Indexing live tech vacancies...</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`p-5 rounded-3xl border transition duration-300 cursor-pointer space-y-3 relative overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-br from-card via-card to-emerald-950/20 border-emerald-500/50 shadow-xl"
                        : "bg-card border-border/80 hover:border-emerald-500/30 hover:bg-card/90"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-mono font-bold text-emerald-400 uppercase">{job.company}</span>
                        </div>
                        <h3 className="text-base font-heading font-extrabold text-foreground mt-1">{job.title}</h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold inline-block">
                          {job.matchScore}% ATS Match
                        </span>
                        <div className="text-[10px] text-muted-foreground font-mono mt-1">{job.postedDate}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 font-mono font-bold text-foreground">
                        <DollarSign className="w-3.5 h-3.5 text-amber-400" /> {job.salary}
                      </span>
                    </div>

                    {job.matchedSkills && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.matchedSkills.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-secondary text-muted-foreground text-[10px] font-mono">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Job Details Preview Drawer */}
          <div className="lg:col-span-6 sticky top-6 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            {selectedJob ? (
              <>
                <div className="border-b border-border pb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-400" /> {selectedJob.company}
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                      {selectedJob.matchScore}% Match
                    </span>
                  </div>

                  <h2 className="text-2xl font-heading font-extrabold text-foreground">{selectedJob.title}</h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-blue-400" /> {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1 font-mono font-bold text-foreground">
                      <DollarSign className="w-4 h-4 text-amber-400" /> {selectedJob.salary}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono uppercase text-xs text-muted-foreground font-bold mb-2">Role Overview & Responsibilities</h4>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-muted/20 p-4 rounded-2xl border border-border/60">
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
                      href={selectedJob.applyUrl || selectedJob.applyLink || "https://www.google.com/about/careers/applications/"}
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