// frontend/src/app/api/interview/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateInterview } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();
    const question = await generateInterview(role || "Software Engineer");

    return NextResponse.json({
      success: true,
      question,
      role: role || "Software Engineer",
    });
  } catch (err: any) {
    console.error("Generate Interview Question Error:", err);
    return NextResponse.json({
      success: true,
      question: "How do you optimize server-side rendering performance and client bundle size in Next.js?",
      role: "Software Engineer",
    });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "Software Engineer";
  const question = await generateInterview(role);
  return NextResponse.json({
    success: true,
    question,
    role,
  });
}