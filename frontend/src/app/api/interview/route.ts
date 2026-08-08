import { NextRequest, NextResponse } from "next/server";
import { generateInterview } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      );
    }

    const aiResponse = await generateInterview(role);

    const questions = JSON.parse(aiResponse);
    console.log(questions);
    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}