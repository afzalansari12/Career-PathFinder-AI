// frontend/src/app/api/interview/route.ts
import { NextResponse } from "next/server";
import { generateInterview } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { role } = await req.json();
    const question = await generateInterview(role || "Full Stack Software Engineer");

    return NextResponse.json({
      success: true,
      question: question || "Explain how Next.js App Router handles server vs client component rendering.",
    });
  } catch (error) {
    console.error("Interview API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate interview question" },
      { status: 500 }
    );
  }
}