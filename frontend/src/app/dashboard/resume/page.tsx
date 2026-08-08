"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function ResumeDashboard() {
  const { user } = useUser();

  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchResume = async () => {
      const res = await fetch(
        `/api/resume?userId=${user.id}`
      );

      const data = await res.json();

      setResume(data.data.analysis);
      setLoading(false);
    };

    fetchResume();
  }, [user]);

  if (loading) {
    return (
      <div className="p-10 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-8">

      <h1 className="text-4xl font-bold">
        Resume Analysis
      </h1>

      <div className="border rounded-xl p-6">

        <h2 className="text-2xl font-semibold">
          {resume.name}
        </h2>

        <p>{resume.email}</p>

        <p>{resume.phone}</p>

      </div>

      <div className="border rounded-xl p-6">

        <h2 className="text-xl font-bold mb-3">
          Skills
        </h2>

        <div className="flex flex-wrap gap-2">

          {resume.skills.map((skill: string) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}

        </div>

      </div>

      <div className="border rounded-xl p-6">

        <h2 className="text-xl font-bold mb-3">
          Summary
        </h2>

        <p>{resume.summary}</p>

      </div>

      <div className="border rounded-xl p-6">
  <h2 className="text-xl font-bold mb-3">
    Resume Score
  </h2>

  <div className="flex items-center gap-4">
    <div className="text-5xl font-bold text-green-600">
      {resume.resume_score}/100
    </div>

    <div className="text-gray-600">
      AI Overall Evaluation
    </div>
  </div>
</div>

      <div className="border rounded-xl p-6">

        <h2 className="text-xl font-bold mb-3">
          Strengths
        </h2>

        <ul className="list-disc ml-5">

          {resume.strengths.map((item: string) => (
            <li key={item}>{item}</li>
          ))}

        </ul>

      </div>

      <div className="border rounded-xl p-6">
  <h2 className="text-xl font-bold mb-3">
    AI Suggestions
  </h2>

  <ul className="list-disc ml-5 space-y-2">
    {resume.suggestions?.map((item: string, index: number) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
   </div>

    </div>
  );
}