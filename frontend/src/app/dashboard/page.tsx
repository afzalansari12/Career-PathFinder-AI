"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();

  const [resume, setResume] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) return;
  
    console.log("User:", user.id);
  
    const fetchData = async () => {
      try {
        console.log("Fetching dashboard...");
  
        const resumeRes = await fetch(`/api/resume?userId=${user.id}`);
        const resumeData = await resumeRes.json();
  
        console.log("Resume:", resumeData);
  
        if (resumeData.success) {
          setResume(resumeData.data);
        }
  
        const roadmapRes = await fetch(`/api/roadmap?userId=${user.id}`);
        const roadmapData = await roadmapRes.json();
  
        console.log("Roadmap:", roadmapData);
  
        if (roadmapData.success) {
          setRoadmap(roadmapData.roadmap);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [isLoaded, user]);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-muted-foreground mt-2">
          Let's build your dream career with AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Resume Score */}
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="font-semibold text-gray-600">
            Resume Score
          </h2>

          <p className="text-4xl mt-4 font-bold text-green-600">
            {resume?.analysis?.ats_score ?? "--"}
          </p>
        </div>

        {/* Recommended Jobs */}
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="font-semibold text-gray-600">
            Recommended Jobs
          </h2>

          <p className="text-4xl mt-4 font-bold">
            --
          </p>
        </div>

        {/* Roadmap */}
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="font-semibold text-gray-600">
            Roadmap
          </h2>

          <p className="text-4xl mt-4 font-bold text-blue-600">
            {roadmap ? "Generated" : "Pending"}
          </p>
        </div>

        {/* Interview */}
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="font-semibold text-gray-600">
            Interview Score
          </h2>

          <p className="text-4xl mt-4 font-bold text-purple-600">
            --
          </p>
        </div>

      </div>

      {resume?.analysis && (
        <div className="mt-10 rounded-xl border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">
            Resume Summary
          </h2>

          <p>{resume.analysis.summary}</p>
        </div>
      )}

      {roadmap && (
        <div className="mt-10 rounded-xl border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">
            Career Roadmap
          </h2>

          <h3 className="text-xl font-semibold">
            {roadmap.title}
          </h3>

          <p className="mt-2">
            <strong>Career Goal:</strong> {roadmap.career_goal}
          </p>

          <p>
            <strong>Estimated Time:</strong> {roadmap.estimated_time}
          </p>
        </div>
      )}
    </div>
  );
}