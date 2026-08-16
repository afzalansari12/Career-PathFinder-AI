// frontend/src/app/api/interview/evaluate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { evaluateInterview } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { question, answer, targetRole } = await req.json();

    if (!question || !answer || !answer.trim()) {
      return NextResponse.json(
        { error: "Question and answer fields are required for evaluation." },
        { status: 400 }
      );
    }

    const evaluation = await evaluateInterview(question, answer);

    return NextResponse.json({
      success: true,
      score: typeof evaluation.score === "number" ? evaluation.score : 15,
      feedback: evaluation.feedback || "Answer evaluated relative to technical prompt.",
      targetRole: targetRole || "Software Engineer",
    });
  } catch (error: any) {
    console.error("Interview Evaluation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}