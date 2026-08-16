// frontend/src/app/api/learning-path/explain/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });

export async function POST(req: NextRequest) {
  try {
    const { recommendationItem, userProfile, userQuery } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        success: true,
        explanation: `This resource ("${recommendationItem?.title || "Recommended Topic"}") was selected because it addresses your target goal of ${userProfile?.targetGoal || "tech advancement"}. It bridges key missing skills like ${userProfile?.targetSkills?.[0]?.name || "advanced software engineering"} and aligns with your ${userProfile?.preferences?.style || "hands-on"} learning style.`,
        suggestedStudyPlan: "Spend 2-3 hours per session focussing on the hands-on project milestones before attempting the phase quiz.",
      });
    }

    const prompt = `You are an AI Learning Assistant and Academic Advisor.
Explain to the learner why the following recommendation was made for them, and answer their specific question if provided.

Recommendation Item: ${JSON.stringify(recommendationItem)}
Learner Profile: ${JSON.stringify(userProfile)}
User Question: "${userQuery || "Why was this specifically recommended for my profile and how should I approach it?"}"

Return strictly JSON matching this structure:
{
  "explanation": "Clear, encouraging, detailed explanation breaking down why this item fits their exact skill gap, goal, and learning style.",
  "prerequisiteAdvice": "How to verify you are ready for this item or get up to speed quickly.",
  "suggestedStudyPlan": "Actionable step-by-step approach to complete this item efficiently."
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return NextResponse.json({
      success: true,
      explanation: result.explanation || "Selected based on your skill gap analysis and target career aspirations.",
      prerequisiteAdvice: result.prerequisiteAdvice || "Review core concepts before diving in.",
      suggestedStudyPlan: result.suggestedStudyPlan || "Commit 2 hours daily to project building.",
    });
  } catch (error) {
    console.error("Explain route error:", error);
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
  }
}
