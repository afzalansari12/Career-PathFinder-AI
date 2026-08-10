// frontend/src/app/api/roadmap/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { targetRole, currentSkills } = await req.json();

    const prompt = `You are a Principal Software Architect and Senior Tech Career Advisor. 
Perform a comprehensive technical gap analysis for a candidate targeting the role "${targetRole || "Full Stack Developer"}" given their known stack "${currentSkills || "React, C++, Node.js"}".

Return strictly valid JSON with this exact schema:
{
  "role": "${targetRole}",
  "estimatedTime": "10 Weeks",
  "overallAnalysis": "A 2-sentence breakdown of the candidate's core architectural strengths and missing critical production skills.",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase Title",
      "duration": "2 Weeks",
      "skillGapSummary": "Why this phase is necessary based on their known stack.",
      "topics": ["Deep technical topic 1", "Deep technical topic 2", "Deep technical topic 3"],
      "projectIdea": "Production-grade portfolio project title and description."
    }
  ]
}`;

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
    const result = JSON.parse(groqData.choices[0]?.message?.content || "{}");

    // Optional: Save generated roadmap to Supabase
    if (user?.id) {
      await supabase.from("roadmaps").insert([
        {
          user_id: user.id,
          target_role: targetRole,
          roadmap_data: result,
        },
      ]);
    }

    return NextResponse.json({ success: true, roadmap: result });
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}