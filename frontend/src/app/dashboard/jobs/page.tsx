// frontend/src/app/dashboard/jobs/page.tsx
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase/server";
import AppShell from "@/components/layout/AppShell";
import { ExternalLink, Building2, MapPin, Sparkles } from "lucide-react";

export default async function JobsPage() {
  const { userId } = await auth();
  const supabase = await createSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("analysis_data, target_role")
    .eq("clerk_id", userId)
    .maybeSingle();

  const analysis = profile?.analysis_data || {};
  const jobs = analysis.recommendedJobs || [];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold">Target Openings</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Live job postings tailored for {profile?.target_role || "your role"}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job: any, index: number) => (
            <div key={index} className="bg-card border rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm">{job.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Building2 className="w-3.5 h-3.5" /> {job.company}
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  {job.matchScore}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                </span>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                >
                  Apply Now <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}