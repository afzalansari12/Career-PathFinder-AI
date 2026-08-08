"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function JobsPage() {
  const { user, isLoaded } = useUser();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchJobs = async () => {
      try {
        const res = await fetch(`/api/jobs?userId=${user.id}`);
        const data = await res.json();

        if (data.success) {
          setJobs(data.jobs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isLoaded, user]);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading Jobs...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Recommended Jobs
      </h1>

      <div className="grid gap-6">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="rounded-xl border p-6 shadow-sm"
          >
            <h2 className="text-2xl font-bold">
              {job.title}
            </h2>

            <p className="mt-2">
              <strong>Company Type:</strong> {job.company_type}
            </p>

            <p className="mt-2">
              <strong>Salary:</strong> {job.salary}
            </p>

            <p className="mt-4 text-gray-600">
              {job.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}