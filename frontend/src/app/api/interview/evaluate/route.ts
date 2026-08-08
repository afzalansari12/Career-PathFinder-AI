import { NextRequest, NextResponse } from "next/server";
import { evaluateInterview } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { role, questions, answers } = await req.json();

    if (!role || !questions || !answers) {
      return NextResponse.json(
        {
          error: "Role, questions and answers are required",
        },
        {
          status: 400,
        }
      );
    }

    const aiResponse = await evaluateInterview(
      role,
      questions,
      answers
    );

    const evaluation = JSON.parse(aiResponse);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}