// frontend/src/app/api/resume/audit/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });

export async function POST(req: NextRequest) {
  try {
    const { resumeText, targetRole } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      // Fallback response if key is missing
      return NextResponse.json({
        atsScore: 87,
        suggestions: [
          {
            id: "1",
            title: "Add Measurable Results",
            description: "Quantify impact using metrics like percentage latency reduction or throughput increase.",
            completed: false,
          },
          {
            id: "2",
            title: "Quantify Open Source Impact",
            description: "Include specific PR numbers, commit metrics, or flight-controller parameters.",
            completed: false,
          },
          {
            id: "3",
            title: "Improve Active Phrasing",
            description: "Replace passive verbs with power verbs like 'Engineered', 'Orchestrated', and 'Optimized'.",
            completed: false,
          },
        ],
        coverLetter: `Dear Hiring Manager,\n\nI am writing to express my strong enthusiasm for the ${targetRole || "Software Engineer"} position. With my background in C++, Data Structures, and scalable system engineering, I am confident in delivering high impact to your development team.\n\nSincerely,\nAfzal Ansari`,
      });
    }

    const prompt = `Analyze the following resume for the target role "${targetRole || "Software Engineer"}".
Return ONLY valid JSON matching this structure:
{
  "atsScore": number (0-100),
  "suggestions": [
    { "id": "1", "title": "Short Title", "description": "Specific improvement advice", "completed": false }
  ],
  "coverLetter": "A tailored professional 3-paragraph cover letter string."
}

Resume Text:
${resumeText}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Groq Analysis Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
