// frontend/src/app/api/learning-path/recommend/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { LearnerProfile } from "@/types/learningPath";
import { FALLBACK_COURSES, FALLBACK_PROJECTS, FALLBACK_RESOURCES } from "@/lib/learningPathEngine";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const profile: LearnerProfile = body.profile;

    if (process.env.GROQ_API_KEY && profile) {
      try {
        const prompt = `You are an AI Recommendation Engine for Online Learning & Career Acceleration.
Analyze this learner profile and produce curated recommendations:

Target Goal: "${profile.targetGoal}"
Experience Level: "${profile.experienceLevel}"
Known Skills: ${profile.knownSkills?.map((s) => `${s.name}`).join(", ") || "Basics"}
Target Skills: ${profile.targetSkills?.map((s) => s.name).join(", ") || "Advanced Engineering"}
Learning Style: ${profile.preferences?.style || "Project-Based"}
Hours/Week: ${profile.preferences?.hoursPerWeek || 10}

Return ONLY valid JSON matching this exact schema without markdown:
{
  "courses": [
    {
      "id": "rec-c1",
      "title": "Course Title",
      "provider": "Platform/Provider",
      "duration": "15 Hours",
      "level": "Intermediate",
      "matchScore": 95,
      "prerequisites": ["Prerequisite 1"],
      "skillsCovered": ["Skill A", "Skill B"],
      "whyRecommended": "Detailed sentence explaining why this course targets the candidate's exact profile skill gap.",
      "category": "Core Foundation"
    }
  ],
  "projects": [
    {
      "id": "rec-p1",
      "title": "Portfolio Project Title",
      "description": "Specific project build prompt",
      "difficulty": "Intermediate",
      "estimatedHours": 20,
      "techStack": ["Next.js", "TypeScript", "PostgreSQL"],
      "learningOutcomes": ["Outcome 1", "Outcome 2"],
      "whyRecommended": "Why this project reinforces target skills and matches learning preference.",
      "matchScore": 97
    }
  ],
  "resources": [
    {
      "id": "rec-r1",
      "title": "Resource / Certification Title",
      "type": "Documentation",
      "provider": "Provider",
      "whyRecommended": "Why this resource is essential for target goal.",
      "matchScore": 92
    }
  ]
}`;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          temperature: 0.3,
        });

        const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
        if (parsed.courses && Array.isArray(parsed.courses)) {
          return NextResponse.json({
            success: true,
            courses: parsed.courses,
            projects: parsed.projects || FALLBACK_PROJECTS,
            resources: parsed.resources || FALLBACK_RESOURCES,
          });
        }
      } catch (err) {
        console.warn("Groq recommend warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      courses: FALLBACK_COURSES,
      projects: FALLBACK_PROJECTS,
      resources: FALLBACK_RESOURCES,
    });
  } catch (error) {
    console.error("Recommendations API error:", error);
    return NextResponse.json({
      success: true,
      courses: FALLBACK_COURSES,
      projects: FALLBACK_PROJECTS,
      resources: FALLBACK_RESOURCES,
    });
  }
}
