// frontend/src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseClient();

    // Query profiles table using Clerk user ID
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Supabase profile fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!profile || !profile.resume_text) {
      return NextResponse.json({ hasResume: false });
    }

    return NextResponse.json({
      hasResume: true,
      targetRole: profile.target_role || "Software Development Engineer",
      atsScore: profile.ats_score || 0,
      scoreDiff: profile.score_diff || "0%",
      interviewReadiness: profile.interview_readiness || 0,
      matchedRolesCount: profile.matched_roles_count || 0,
      creditsLeft: profile.credits_left ?? 10,
      skills: profile.skills || [],
    });
  } catch (err) {
    console.error("API Profile Error:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}