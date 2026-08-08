"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function RoadmapPage() {
  const { user } = useUser();

  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`/api/roadmap?userId=${user.id}`);
        const data = await res.json();

        if (data.success) {
          setRoadmap(data.roadmap);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchRoadmap();
  }, [user]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading Roadmap...
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="p-10 text-center">
        No roadmap found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div className="border rounded-xl p-6">
        <h1 className="text-4xl font-bold">
          {roadmap.title}
        </h1>

        <p className="mt-4 text-lg">
          <b>Career Goal:</b> {roadmap.career_goal}
        </p>

        <p className="mt-2 text-lg">
          <b>Estimated Time:</b> {roadmap.estimated_time}
        </p>
      </div>

      {roadmap.weeks?.map((week: any) => (
        <div
          key={week.week}
          className="border rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold mb-4">
            Week {week.week}
          </h2>

          <h3 className="font-semibold mb-2">
            Topics
          </h3>

          <ul className="list-disc ml-6 mb-5">
            {week.topics?.map((topic: string) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>

          <h3 className="font-semibold mb-2">
            Project
          </h3>

          <div className="bg-blue-50 rounded-lg p-4">
            {week.project}
          </div>
        </div>
      ))}
    </div>
  );
}