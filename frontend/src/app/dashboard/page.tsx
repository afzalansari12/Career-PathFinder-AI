// frontend/src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InterviewAnalytics from "@/components/InterviewAnalytics";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  const [interviewScore, setInterviewScore] = useState<number | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function loadDashboardMetrics() {
      setLoading(true);
      const supabase = createClient();

      // Fetch Latest Interview Score
      const { data: interviewData } = await supabase
        .from("interviews")
        .select("score")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (interviewData) setInterviewScore(interviewData.score);

      // Fetch Latest Resume ATS Score
      const { data: resumeData } = await supabase
        .from("resumes")
        .select("ats_score")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (resumeData) setAtsScore(resumeData.ats_score);

      setLoading(false);
    }

    loadDashboardMetrics();
  }, [user?.id]);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName || "Candidate"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your AI technical interview progress, ATS score, and tailored skill gap analysis.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mock Interview Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {interviewScore !== null ? `${interviewScore}/100` : "--"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on recent domain questions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resume ATS Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {atsScore !== null ? `${atsScore}/100` : "--"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Parsed from uploaded resume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-1">
            <Button className="w-full" size="sm" onClick={() => router.push("/interview")}>
              Start Practice Session
            </Button>
            <Button className="w-full" variant="outline" size="sm" onClick={() => router.push("/upload")}>
              Upload / Update Resume
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InterviewAnalytics userId={user?.id} />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recommended Focus Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
              <span className="font-semibold text-blue-900 dark:text-blue-300">System Architecture</span>
              <p className="text-xs text-blue-800 dark:text-blue-400 mt-1">
                Practice concurrency, Redis caching layers, and database sharding techniques.
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
              <span className="font-semibold text-amber-900 dark:text-amber-300">Data Structures</span>
              <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">
                Review Graph traversals, Dynamic Programming, and LRU Cache implementations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}