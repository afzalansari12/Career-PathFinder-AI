import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateRoadmap } from "@/lib/groq";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get latest resume analysis
    const { data: resume, error } = await supabase
      .from("resume_analysis")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!resume) {
      return NextResponse.json(
        { error: "Resume analysis not found" },
        { status: 404 }
      );
    }

    // Generate roadmap with AI
    const aiResponse = await generateRoadmap(resume.analysis);

    let roadmap;

    try {
      roadmap = JSON.parse(aiResponse);
    } catch {
      roadmap = {
        roadmap: aiResponse,
      };
    }

    // Save roadmap
    const { error: dbError } = await supabase
      .from("roadmaps")
      .insert({
        user_id: userId,
        roadmap,
      });

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      roadmap,
    });

  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}