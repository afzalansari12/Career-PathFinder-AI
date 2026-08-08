// frontend/src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  TrendingUp, 
  FileCheck, 
  Briefcase, 
  Sparkles, 
  CreditCard,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import InterviewAnalytics from "@/components/InterviewAnalytics";
import { useUser } from "@clerk/nextjs";

export default function DashboardOverviewPage() {
  const { user } = useUser();
  const [loadingPayment, setLoadingPayment] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoadingPayment(true);
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade trigger failed:", err);
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              Executive Telemetry
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Tier: Free Plan (10 Credits Left)
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.firstName || "Engineer"}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time metric telemetry tracking ATS optimization velocity and mock interview performance.
          </p>
        </div>

        <Button
          onClick={handleUpgrade}
          disabled={loadingPayment}
          className="bg-white text-black hover:bg-neutral-200 text-xs font-semibold h-10 px-4 flex items-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          {loadingPayment ? "Redirecting..." : "Upgrade to Pro ($19/mo)"}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-neutral-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono text-neutral-400">LATEST ATS SCORE</CardDescription>
            <CardTitle className="text-3xl font-bold text-white flex items-baseline justify-between">
              88 <span className="text-xs font-mono text-emerald-400 font-normal">+12% vs last audit</span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono text-neutral-400">INTERVIEW READINESS</CardDescription>
            <CardTitle className="text-3xl font-bold text-white flex items-baseline justify-between">
              82/100 <span className="text-xs font-mono text-purple-400 font-normal">Top 15%</span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono text-neutral-400">MATCHED ROLES</CardDescription>
            <CardTitle className="text-3xl font-bold text-white flex items-baseline justify-between">
              24 <span className="text-xs font-mono text-neutral-400 font-normal">Active Openings</span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono text-neutral-400">AI CREDITS REMAINING</CardDescription>
            <CardTitle className="text-3xl font-bold text-white flex items-baseline justify-between">
              10/10 <span className="text-xs font-mono text-amber-400 font-normal">Free Monthly</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Analytics & System Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <InterviewAnalytics userId={user?.id} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-neutral-900/50 border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Recommended Actions</h3>
            
            <a href="/dashboard/resume" className="block">
              <div className="p-3 bg-black/40 border border-white/5 rounded-lg hover:border-purple-500/40 transition-all flex justify-between items-center">
                <div>
                  <span className="text-xs font-medium text-white block">Run Deterministic ATS Audit</span>
                  <span className="text-[10px] text-neutral-400">Check formatting and keyword density</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </div>
            </a>

            <a href="/interview" className="block">
              <div className="p-3 bg-black/40 border border-white/5 rounded-lg hover:border-purple-500/40 transition-all flex justify-between items-center">
                <div>
                  <span className="text-xs font-medium text-white block">Start Mock Interview</span>
                  <span className="text-[10px] text-neutral-400">Practice system design & coding scenarios</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </div>
            </a>

            <a href="/jobs" className="block">
              <div className="p-3 bg-black/40 border border-white/5 rounded-lg hover:border-purple-500/40 transition-all flex justify-between items-center">
                <div>
                  <span className="text-xs font-medium text-white block">Explore Matched Remote Jobs</span>
                  <span className="text-[10px] text-neutral-400">24 openings matching your resume skills</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </div>
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}