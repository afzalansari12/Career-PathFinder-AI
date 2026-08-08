// frontend/src/app/api/interview/evaluate/route.ts
import { NextResponse } from "next/server";
import { evaluateInterview } from "@/lib/groq";

export let latestInterviewScore: number | null = null;

export async function GET() {
  return NextResponse.json({
    success: true,
    score: latestInterviewScore ?? 0,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    const evaluation = await evaluateInterview(question, answer);

    const score = typeof evaluation?.score === "number" ? evaluation.score : 75;
    const feedback = evaluation?.feedback || "Answer evaluated successfully.";

    latestInterviewScore = score;

    return NextResponse.json({
      success: true,
      score,
      feedback,
    });
  } catch (error) {
    console.error("Evaluation Route Error:", error);
    return NextResponse.json({ error: "Failed to evaluate answer" }, { status: 500 });
  }
}