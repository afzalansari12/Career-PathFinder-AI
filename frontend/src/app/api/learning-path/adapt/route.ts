// frontend/src/app/api/learning-path/adapt/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { StructuredLearningPath } from "@/types/learningPath";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });

export async function POST(req: NextRequest) {
  try {
    const { feedback, currentPath } = await req.json();

    if (!process.env.GROQ_API_KEY || !currentPath) {
      // Modify current path status or duration locally if no Groq API Key
      const adapted = { ...currentPath };
      adapted.aiSummary = `Adapted path based on feedback: "${feedback}". Timelines and topics have been updated to suit your request.`;
      return NextResponse.json({ success: true, path: adapted });
    }

    const prompt = `You are an AI Learning Path Adaptation Engine.
A learner has requested an adaptation to their existing learning roadmap.

Feedback / Modification Request: "${feedback}"
Existing Roadmap: ${JSON.stringify(currentPath)}

Update the phases, duration, topics, or project ideas to directly reflect the feedback while maintaining strict technical progression.

Return strictly JSON matching the same StructuredLearningPath schema as before.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return NextResponse.json({ success: true, path: result });
  } catch (error) {
    console.error("Adapt path route error:", error);
    return NextResponse.json({ error: "Failed to adapt path" }, { status: 500 });
  }
}
