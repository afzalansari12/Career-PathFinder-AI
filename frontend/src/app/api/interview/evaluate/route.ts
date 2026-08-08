// frontend/src/app/api/interview/evaluate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const requestSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10, "Response must be at least 10 characters long."),
  targetRole: z.string().optional().default("Software Engineer"),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { question, answer, targetRole } = validation.data;

    const prompt = `
      You are an engineering leader evaluating a candidate's response in an interview.
      Target Role: "${targetRole}"
      Question: "${question}"
      Candidate Answer: "${answer}"

      Evaluate the answer based on:
      1. Technical accuracy and domain proficiency
      2. Clarity and communication structure
      3. Problem-solving approach (STAR format for behavioral questions)

      Return strictly valid JSON with no extra commentary:
      {
        "overallScore": 82,
        "technicalAccuracyScore": 85,
        "communicationScore": 80,
        "strengths": [
          "Identified core performance bottlenecks correctly.",
          "Clear explanation of state management lifecycle."
        ],
        "areasToImprove": [
          "Could mention edge cases like network timeouts or retry mechanics."
        ],
        "modelAnswer": "An ideal response should highlight..."
      }
    `;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    const groqData = await groqRes.json();
    const evaluation = JSON.parse(groqData.choices[0]?.message?.content || "{}");

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    console.error("Interview Evaluation Error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate candidate response" },
      { status: 500 }
    );
  }
}