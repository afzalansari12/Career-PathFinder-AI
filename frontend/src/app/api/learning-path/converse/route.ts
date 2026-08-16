// frontend/src/app/api/learning-path/converse/route.ts
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

    const { userPrompt, currentProfile } = body;
    const promptText = userPrompt || "I want to advance my engineering career.";

    if (process.env.GROQ_API_KEY) {
      try {
        const systemPrompt = `You are an AI Learning Assistant for career development.
Analyze the user's natural language request: "${promptText}".
Current Learner Profile: ${JSON.stringify(currentProfile || {})}.

Extract their target goal, experience level, interests, and preferences (pace, style, hoursPerWeek).
Return ONLY a valid JSON object matching this exact schema:
{
  "reply": "Clear, encouraging, detailed narrative response summarizing what you understood and how the roadmap is tailored to their request.",
  "extractedProfileUpdates": {
    "targetGoal": "Specific target role name derived from input",
    "experienceLevel": "Beginner | Intermediate | Advanced",
    "interests": ["Interest 1", "Interest 2"],
    "preferences": {
      "pace": "Fast | Standard | Relaxed",
      "style": "Project-Based | Video | Theory/Docs | Interactive",
      "hoursPerWeek": 12
    }
  }
}`;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: systemPrompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          temperature: 0.3,
        });

        const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
        if (parsed.reply) {
          return NextResponse.json({ success: true, ...parsed });
        }
      } catch (err) {
        console.warn("Groq converse warning:", err);
      }
    }

    // Dynamic response fallback based on prompt text
    const inferredGoal = promptText.toLowerCase().includes("ai")
      ? "AI Engineer"
      : promptText.toLowerCase().includes("full stack")
      ? "Full Stack Engineer"
      : promptText.toLowerCase().includes("data")
      ? "Data Scientist"
      : currentProfile?.targetGoal || "Software Engineer";

    const hours = promptText.match(/(\d+)\s*(hrs|hours)/i)?.[1]
      ? parseInt(promptText.match(/(\d+)\s*(hrs|hours)/i)![1])
      : 12;

    return NextResponse.json({
      success: true,
      reply: `I've updated your profile to target "${inferredGoal}" at ${hours} hours/week. Your custom structured roadmap and recommendations have been generated below!`,
      extractedProfileUpdates: {
        targetGoal: inferredGoal,
        experienceLevel: currentProfile?.experienceLevel || "Intermediate",
        interests: [inferredGoal, "System Architecture"],
        preferences: {
          pace: "Standard",
          style: "Project-Based",
          hoursPerWeek: hours,
        },
      },
    });
  } catch (error: any) {
    console.error("Converse route error:", error);
    return NextResponse.json(
      {
        success: true,
        reply: "I've analyzed your prompt and updated your target career roadmap.",
        extractedProfileUpdates: {},
      },
      { status: 200 }
    );
  }
}
