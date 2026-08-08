// frontend/src/app/api/jobs/route.ts
import { NextResponse } from "next/server";
import { generateJobs } from "@/lib/groq";
import { latestResumeAnalysis } from "@/app/api/resume/route";

export async function GET(req: Request) {
  try {
    const skills = latestResumeAnalysis?.skills?.technical || ["Next.js", "TypeScript", "React"];
    const rawResult = await generateJobs(skills);
    
    let parsed: any = {};
    try {
      parsed = typeof rawResult === "string" ? JSON.parse(rawResult) : rawResult;
    } catch {
      parsed = {};
    }

    return NextResponse.json({
      success: true,
      recommendedJobs: parsed.recommendedJobs || ["Full Stack Developer", "Frontend Engineer", "Node.js Developer"],
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
  }
}