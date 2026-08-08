// frontend/src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export interface RealJob {
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

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role = "Software Engineer", userSkills = [] } = await req.json();

    const rapidApiKey = process.env.RAPIDAPI_KEY;

    // Fallback search if RAPIDAPI_KEY is not configured
    if (!rapidApiKey) {
      console.warn("RAPIDAPI_KEY not configured. Querying direct RemoteOK API fallback.");
      const remoteOkRes = await fetch(`https://remoteok.com/api?tag=${encodeURIComponent(role.toLowerCase())}`);
      const rawJobs = await remoteOkRes.json();

      // Clean array and drop metadata
      const cleanJobs = (Array.isArray(rawJobs) ? rawJobs.slice(1, 10) : []).map((job: any) => {
        const jobTags: string[] = job.tags || [];
        const matched = userSkills.filter((s: string) =>
          jobTags.some((t) => t.toLowerCase() === s.toLowerCase())
        );
        const missing = jobTags.filter(
          (t) => !userSkills.some((s: string) => s.toLowerCase() === t.toLowerCase())
        );

        const baseMatch = jobTags.length > 0 ? Math.round((matched.length / jobTags.length) * 100) : 75;

        return {
          id: String(job.id || Math.random()),
          title: job.position || role,
          company: job.company || "Tech Company",
          location: job.location || "Remote",
          applyLink: job.url || "https://remoteok.com",
          matchScore: Math.max(50, Math.min(98, baseMatch)),
          matchedSkills: matched,
          missingSkills: missing.slice(0, 5),
          description: job.description
            ? job.description.replace(/<[^>]*>?/gm, "").slice(0, 200) + "..."
            : "No description available.",
        };
      });

      return NextResponse.json({ success: true, jobs: cleanJobs });
    }

    // Primary Execution via JSearch
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
        role
      )}&page=1&num_pages=1&remote_jobs_only=true`,
      {
        headers: {
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      }
    );

    const apiData = await response.json();
    const rawListings = apiData.data || [];

    const processedJobs: RealJob[] = rawListings.map((item: any, idx: number) => {
      const description = item.job_description || "";
      
      // Calculate Skill Matrix
      const matched = userSkills.filter((skill: string) =>
        new RegExp(`\\b${skill}\\b`, "i").test(description)
      );

      const matchScore =
        userSkills.length > 0
          ? Math.round((matched.length / userSkills.length) * 100)
          : 80;

      return {
        id: item.job_id || `job-${idx}`,
        title: item.job_title || role,
        company: item.employer_name || "Unknown",
        location: item.job_city ? `${item.job_city}, ${item.job_country}` : "Remote",
        applyLink: item.job_apply_link || "https://google.com/jobs",
        matchScore: Math.min(98, Math.max(45, matchScore)),
        matchedSkills: matched,
        missingSkills: [],
        description: description.slice(0, 220) + "...",
      };
    });

    return NextResponse.json({ success: true, jobs: processedJobs });
  } catch (error: any) {
    console.error("Job Aggregation Error:", error);
    return NextResponse.json({ error: "Failed to fetch live job postings" }, { status: 500 });
  }
}