// frontend/src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { role } = await req.json();

    const prompt = `
      You are an automated job-matching engine for top tech talent.
      Target Domain: "${role || "Full Stack Engineer"}"

      Generate 4 realistic startup/tech company job openings tailored to this target domain.

      Return strictly valid JSON:
      {
        "jobs": [
          {
            "id": "job-1",
            "title": "Senior Full Stack Engineer",
            "company": "Vercel Labs",
            "location": "Remote / San Francisco",
            "matchScore": 92,
            "skillsRequired": ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
            "description": "Building high-performance serverless applications and component systems."
          },
          {
            "id": "job-2",
            "title": "Backend Systems Developer",
            "company": "Supabase Infra",
            "location": "Remote",
            "matchScore": 85,
            "skillsRequired": ["PostgreSQL", "Node.js", "Go", "Docker"],
            "description": "Scaling real-time database infrastructure and authentication pipelines."
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
        temperature: 0.3,
      }),
    });

    const groqData = await groqRes.json();
    const result = JSON.parse(groqData.choices[0]?.message?.content || "{}");

    return NextResponse.json({ success: true, jobs: result.jobs || [] });
  } catch (error) {
    console.error("Job Search API Error:", error);
    return NextResponse.json({ error: "Failed to fetch job matches" }, { status: 500 });
  }
}