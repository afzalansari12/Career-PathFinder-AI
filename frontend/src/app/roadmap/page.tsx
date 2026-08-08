// frontend/src/app/roadmap/page.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Phase {
  phaseNumber: number;
  title: string;
  duration: string;
  topics: string[];
  projectIdea: string;
}

interface RoadmapData {
  role: string;
  estimatedTime: string;
  phases: Phase[];
}

export default function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [currentSkills, setCurrentSkills] = useState("React, JavaScript, HTML, CSS, Git");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  const handleGenerateRoadmap = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, currentSkills }),
      });

      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
      }
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Career Pathfinder</h1>
        <p className="text-muted-foreground mt-1">
          Generate an action-oriented, milestone-driven learning path tailored to your target engineering track.
        </p>
      </div>

      {/* Input Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configure Your Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Target Role</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-md bg-background text-sm"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. AI Engineer, DevOps Lead"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Known Skills / Stack</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-md bg-background text-sm"
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="e.g. C++, Python, SQL"
              />
            </div>
          </div>
          <Button onClick={handleGenerateRoadmap} disabled={loading} className="w-full">
            {loading ? "Analyzing Skill Gaps & Building Roadmap..." : "Generate Personalized Roadmap"}
          </Button>
        </CardContent>
      </Card>

      {/* Roadmap Visualization */}
      {roadmap && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold">{roadmap.role} Pathway</h2>
            <span className="text-sm px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium dark:bg-purple-900/40 dark:text-purple-300">
              Estimated Timeline: {roadmap.estimatedTime}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {roadmap.phases?.map((phase) => (
              <Card key={phase.phaseNumber} className="border-l-4 border-l-purple-600 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">
                      Phase {phase.phaseNumber}: {phase.title}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {phase.duration}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Competencies to Master</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.topics?.map((topic, i) => (
                        <span key={i} className="text-xs bg-muted/80 text-foreground px-2.5 py-1 rounded-md border">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-lg text-xs">
                    <span className="font-semibold text-foreground">Capstone Milestone: </span>
                    <span className="text-muted-foreground">{phase.projectIdea}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}