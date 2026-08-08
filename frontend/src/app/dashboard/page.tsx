// frontend/src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ResumeData {
  score?: number;
  summary?: string;
  skills?: string[];
}

interface RoadmapData {
  careerGoal?: string;
  estimatedTime?: string;
  steps?: string[];
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [jobs, setJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [interviewScore, setInterviewScore] = useState<number | string>("--");

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Resume Analysis
        const resumeRes = await fetch(`/api/resume?userId=${user.id}`);
        if (resumeRes.ok) {
          const resumeData = await resumeRes.json();
          if (resumeData.success) {
            setResume(resumeData.data || resumeData);
          }
        }

        // 2. Fetch Career Roadmap
        const roadmapRes = await fetch(`/api/roadmap?userId=${user.id}`);
        if (roadmapRes.ok) {
          const roadmapData = await roadmapRes.json();
          if (roadmapData.success) {
            setRoadmap(roadmapData.roadmap || roadmapData);
          }
        }

        // 3. Fetch Job Recommendations
        const jobsRes = await fetch(`/api/jobs?userId=${user.id}`);
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();

          if (jobsData.success) {
            setJobs(jobsData.recommendedJobs || []);
          } 
        }
        // 4. Fetch Interview Readiness Score
        const interviewRes = await fetch(`/api/interview/evaluate?userId=${user.id}`);
        if (interviewRes.ok) {
          const interviewData = await interviewRes.json();
          if (interviewData.score) {
            setInterviewScore(interviewData.score);
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome Back {user?.firstName ? `, ${user.firstName}` : ""} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Let's build your dream career with AI.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resume Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {resume?.score ?? "--"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recommended Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {jobs.length > 0 ? jobs.length : "--"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Roadmap Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {roadmap?.careerGoal ? "Generated" : "--"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Interview Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">--</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Resume Summary */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Resume Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              {resume?.summary || "No resume uploaded yet. Upload your resume to see your analysis."}
            </p>
            {!resume?.summary && (
              <Button className="mt-2">
                <Link href="/upload">Upload Resume</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Career Roadmap */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Career Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-semibold text-sm">Career Goal: </span>
              <span className="text-sm text-muted-foreground">
                {roadmap?.careerGoal || "--"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-sm">Estimated Time: </span>
              <span className="text-sm text-muted-foreground">
                {roadmap?.estimatedTime || "--"}
              </span>
            </div>
            {roadmap?.steps && roadmap.steps.length > 0 && (
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                {roadmap.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}