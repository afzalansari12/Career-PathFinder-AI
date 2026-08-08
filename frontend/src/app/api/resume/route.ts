// frontend/src/app/api/resume/route.ts
import { NextResponse } from "next/server";

// Simple in-memory fallback store for development (replace with Supabase query in production)
export let latestResumeAnalysis: any = null;

export function setLatestAnalysis(data: any) {
  latestResumeAnalysis = data;
}

export async function GET(req: Request) {
  if (!latestResumeAnalysis) {
    return NextResponse.json({
      success: false,
      message: "No resume analysis found",
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      score: latestResumeAnalysis.score || 85,
      summary: latestResumeAnalysis.summary || "Strong Software Engineer candidate.",
      skills: latestResumeAnalysis.skills?.technical || [],
    },
  });
}