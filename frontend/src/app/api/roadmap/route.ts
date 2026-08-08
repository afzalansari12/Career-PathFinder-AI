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

    const prompt = `
      You are an elite Tech Career Coach and Engineering Director.
      Target Role: "${targetRole || "Full Stack Developer"}"
      Current Candidate Skills: "${currentSkills || "JavaScript, HTML, CSS"}"

      Generate a structured 4-phase learning roadmap to bridge the candidate's skill gap.

      Return strictly valid JSON with this exact structure:
      {
        "role": "${targetRole}",
        "estimatedTime": "12 Weeks",
        "phases": [
          {
            "phaseNumber": 1,
            "title": "Core Foundation & Deep Dive",
            "duration": "Weeks 1-3",
            "topics": ["Advanced TypeScript", "State Management", "Next.js App Router"],
            "projectIdea": "Build a real-time collaborative dashboard."
          },
          {
            "phaseNumber": 2,
            "title": "Backend Architecture & APIs",
            "duration": "Weeks 4-6",
            "topics": ["PostgreSQL & Supabase", "REST & GraphQL", "Authentication & Middleware"],
            "projectIdea": "Implement full auth with RBAC and database row-level security."
          }
        ]
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