// frontend/src/app/api/roadmap/route.ts
import { NextResponse } from "next/server";
import { generateRoadmap } from "@/lib/groq";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    return NextResponse.json({
      success: true,
      roadmap: {
        careerGoal: "Full Stack Software Engineer",
        estimatedTime: "3-6 months",
        steps: [
          "Master TypeScript & Next.js App Router",
          "Implement Supabase Auth & Database",
          "Deploy & Optimize Performance",
        ],
      },
    });
  } catch (error) {
    console.error("Roadmap GET error:", error);
    return NextResponse.json({ error: "Failed to fetch roadmap" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawResult = await generateRoadmap(body.skills || body.analysis, body.targetRole);

    let parsedData: any = {};
    try {
      parsedData = typeof rawResult === "string" ? JSON.parse(rawResult) : rawResult;
    } catch {
      parsedData = {};
    }

    return NextResponse.json({
      success: true,
      roadmap: {
        careerGoal: parsedData.careerGoal || "Software Engineer",
        estimatedTime: parsedData.estimatedTime || "3-6 months",
        steps: parsedData.steps || [],
      },
    });
  } catch (error) {
    console.error("Roadmap POST error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}