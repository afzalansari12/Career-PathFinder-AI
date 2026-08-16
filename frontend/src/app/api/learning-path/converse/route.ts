// frontend/src/app/api/learning-path/converse/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { LearnerProfile } from "@/types/learningPath";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });

export async function POST(req: NextRequest) {
  try {
    const { userPrompt, currentProfile } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        success: true,
        reply: `I have updated your learner profile based on your request: "${userPrompt}". I set your goal to "${userPrompt.includes("AI") ? "AI Engineer" : "Full Stack Software Engineer"}" with a project-based learning focus. Your personalized roadmap has been generated!`,
        extractedProfileUpdates: {
          targetGoal: userPrompt.includes("AI") ? "AI Engineer" : "Full Stack Software Engineer",
          preferences: { pace: "Standard", style: "Project-Based", hoursPerWeek: 12 },
        },
      });
    }

    const prompt = `You are the Conversational AI Engine for an Intelligent Learning Path Assistant.
The user is describing their learning goals, background, interests, or preferences in natural language:

User Prompt: "${userPrompt}"
Current Learner Profile: ${JSON.stringify(currentProfile || {})}

Your tasks:
1. Parse user intent and extract updated profile fields (targetGoal, experienceLevel, knownSkills, targetSkills, interests, preferences).
2. Formulate a friendly, empowering assistant reply summarizing what you understood and how the roadmap has been tailored.

Return strictly valid JSON:
{
  "reply": "Conversational assistant reply explaining how the learning path was personalized.",
  "extractedProfileUpdates": {
    "targetGoal": "Extracted target role or career objective",
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
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return NextResponse.json({
      success: true,
      reply: parsed.reply || "I've analyzed your goal and tailored your learning path!",
      extractedProfileUpdates: parsed.extractedProfileUpdates || {},
    });
  } catch (error) {
    console.error("Converse route error:", error);
    return NextResponse.json({ error: "Failed to process prompt" }, { status: 500 });
  }
}
