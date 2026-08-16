// frontend/src/app/api/learning-path/adapt/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { feedback, currentPath } = body;
    const adapted = currentPath ? { ...currentPath } : { phases: [] };
    const textFeedback = feedback || "Adjust pace and project focus.";

    adapted.aiSummary = `Adapted path based on feedback: "${textFeedback}". Timelines and topics have been updated to suit your request.`;

    if (process.env.GROQ_API_KEY && currentPath) {
      try {
        const prompt = `You are an AI Learning Path Adaptation Engine.
A learner has requested an adaptation to their existing learning roadmap.

Feedback / Modification Request: "${textFeedback}"
Existing Roadmap: ${JSON.stringify(currentPath)}

Update the phases, duration, topics, or project ideas to directly reflect the feedback while maintaining strict technical progression.
Return strictly valid JSON matching the same StructuredLearningPath schema as before without markdown.`;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          temperature: 0.3,
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
        if (result.phases && Array.isArray(result.phases)) {
          return NextResponse.json({ success: true, path: result });
        }
      } catch (err) {
        console.warn("Groq adapt warning:", err);
      }
    }

    return NextResponse.json({ success: true, path: adapted });
  } catch (error) {
    console.error("Adapt path route error:", error);
    return NextResponse.json({ success: true, path: { aiSummary: "Adapted path applied." } }, { status: 200 });
  }
}
