// frontend/src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "Software Engineer";
  const type = searchParams.get("type") || "fulltime";

  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  const searchQuery = `${role} ${type === "internship" ? "intern" : ""}`;

  if (appId && appKey) {
    try {
      const res = await fetch(
        `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=15&what=${encodeURIComponent(
          searchQuery
        )}&content-type=application/json`
      );

      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const seenCompanies = new Set();

          const realJobs = data.results
            .map((j: any) => {
              const companyName = j.company?.display_name || "Company";
              const jobTitle = j.title ? j.title.replace(/<\/?[^>]+(>|$)/g, "") : role;
              const locationName = j.location?.display_name || "India";

              // Construct direct Google Careers / Jobs search link for the specific position & company
              const directApplyUrl = `https://www.google.com/search?q=${encodeURIComponent(
                `${companyName} ${jobTitle} ${locationName} apply`
              )}`;

              return {
                id: String(j.id),
                title: jobTitle,
                company: companyName,
                location: locationName,
                salary: j.salary_min
                  ? `₹${Math.round(j.salary_min / 100000)}L - ₹${Math.round(j.salary_max / 100000)}L/yr`
                  : "Competitive",
                description: j.description
                  ? j.description.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 250) + "..."
                  : "Click Apply Directly to view the job application.",
                applyUrl: directApplyUrl,
                matchScore: 88 + Math.floor(Math.random() * 10),
                postedDate: "Live Vacancy",
              };
            })
            // Filter out duplicate companies so one company doesn't flood the list
            .filter((job: any) => {
              if (seenCompanies.has(job.company)) return false;
              seenCompanies.add(job.company);
              return true;
            });

          return NextResponse.json({ jobs: realJobs });
        }
      }
    } catch (err) {
      console.error("Adzuna API Error:", err);
    }
  }

  // Direct aggregator fallbacks
  const encodedQuery = encodeURIComponent(`${role}${type === "internship" ? " intern" : ""}`);
  return NextResponse.json({
    jobs: [
      {
        id: "live-ln-1",
        title: `${role} Openings`,
        company: "LinkedIn Jobs Aggregator",
        location: "India / Remote",
        salary: "Market Standard",
        description: "Direct real-time job listings aggregated on LinkedIn.",
        applyUrl: `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=India`,
        matchScore: 96,
        postedDate: "Live Search",
      },
      {
        id: "live-gg-2",
        title: `${role} Vacancies`,
        company: "Google Careers",
        location: "Bengaluru, India",
        salary: "Competitive",
        description: "Official career postings from company portals.",
        applyUrl: `https://www.google.com/about/careers/applications/jobs/results/?q=${encodedQuery}&location=India`,
        matchScore: 92,
        postedDate: "Live Search",
      },
    ],
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}