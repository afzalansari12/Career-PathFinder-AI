// frontend/src/app/jobs/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  skillsRequired: string[];
  description: string;
}

export default function JobsPage() {
  const [selectedRole, setSelectedRole] = useState("Full Stack Engineer");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (role: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
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
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Job Matcher</h1>
          <p className="text-muted-foreground mt-1">
            Real-time tech opportunities scored against your candidate profile.
          </p>
        </div>

        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            fetchJobs(e.target.value);
          }}
          className="p-2 border rounded-md bg-background text-sm font-medium focus:ring-2 focus:ring-purple-500"
        >
          <option value="Full Stack Engineer">Full Stack Engineer</option>
          <option value="Data Scientist">Data Scientist</option>
          <option value="AI / ML Engineer">AI / ML Engineer</option>
          <option value="DevOps & Cloud Engineer">DevOps Lead</option>
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground">
          Finding top opportunities matching your skill profile...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      job.matchScore >= 85
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                    }`}
                  >
                    {job.matchScore}% Match
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{job.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {job.skillsRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-muted px-2 py-0.5 rounded border font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t">
                <Button className="w-full" size="sm" variant="outline">
                  Apply via One-Click ATS
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}