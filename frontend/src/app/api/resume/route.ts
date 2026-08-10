// frontend/src/app/api/resume/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xbyossuhwotuzqgzbykb.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_key";
  return createClient(url, key);
}

/**
 * Returns the most recent saved ATS evaluation for the logged-in user.
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("ats_evaluations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Fetch resume analysis error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({
        success: false,
        message: "No resume analysis found yet. Upload a resume to get started.",
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Get Resume Route Error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch resume" }, { status: 500 });
  }
}
