// frontend/src/app/jobs/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Briefcase, MapPin, Sparkles } from "lucide-react";

interface RealJob {
  id: string;
  title: string;
  company: string;
  location: string;
  applyLink: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
}

export default function JobsPage() {
  const [selectedRole, setSelectedRole] = useState("Full Stack Engineer");
  const [jobs, setJobs] = useState<RealJob[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (role: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          userSkills: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
        }),
      });

      const data = await res.json();
      if (data.jobs) setJobs(data.jobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(selectedRole);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-2">
            Real-Time Aggregator
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white">Live Job Matcher</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Active roles aggregated and matched against your technical profile.
          </p>
        </div>

        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            fetchJobs(e.target.value);
          }}
          className="p-2.5 bg-neutral-900 border border-white/10 rounded-lg text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="Full Stack Engineer">Full Stack Engineer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="DevOps Engineer">DevOps Engineer</option>
        </select>
      </div>

      {loading ? (
        <div className="p-16 text-center text-neutral-500 font-mono text-xs animate-pulse">
          Querying remote job providers and computing compatibility score...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="bg-neutral-900/50 border-white/10 flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-base font-semibold text-white">{job.title}</CardTitle>
                    <p className="text-xs text-neutral-400 flex items-center gap-2 mt-1">
                      <Briefcase className="w-3 h-3 text-purple-400" /> {job.company}
                      <span className="text-neutral-600">•</span>
                      <MapPin className="w-3 h-3 text-neutral-400" /> {job.location}
                    </p>
                  </div>
                  <Badge
                    className={`${
                      job.matchScore >= 80
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    } text-xs font-bold px-2.5 py-1 shrink-0`}
                  >
                    {job.matchScore}% Match
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-neutral-400 leading-relaxed">{job.description}</p>
                {job.matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.matchedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-purple-950/40 text-purple-300 border border-purple-800/30 px-2 py-0.5 rounded font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-4 border-t border-white/10">
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs h-9 flex items-center justify-center gap-2">
                    Apply Directly <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}