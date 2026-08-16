// frontend/src/app/api/learning-path/recommend/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { LearnerProfile } from "@/types/learningPath";
import { FALLBACK_COURSES, FALLBACK_PROJECTS, FALLBACK_RESOURCES } from "@/lib/learningPathEngine";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });

export async function POST(req: NextRequest) {
  try {
    const { profile }: { profile: LearnerProfile } = await req.json();

    if (!process.env.GROQ_API_KEY || !profile) {
      return NextResponse.json({
        success: true,
        courses: FALLBACK_COURSES,
        projects: FALLBACK_PROJECTS,
        resources: FALLBACK_RESOURCES,
      });
    }

    const prompt = `You are an AI Recommendation Engine for Online Learning & Career Acceleration.
Analyze this learner profile and produce curated recommendations:

Target Goal: "${profile.targetGoal}"
Experience Level: "${profile.experienceLevel}"
Known Skills: ${profile.knownSkills.map((s) => `${s.name} (Level ${s.level}/5)`).join(", ")}
Target Skills: ${profile.targetSkills.map((s) => `${s.name}`).join(", ")}
Interests: ${profile.interests.join(", ")}
Learning Style: ${profile.preferences.style}
Hours/Week: ${profile.preferences.hoursPerWeek}

Return ONLY valid JSON matching this schema:
{
  "courses": [
    {
      "id": "rec-c1",
      "title": "Exact Course Name",
      "provider": "Platform/University (e.g. Coursera, Udemy, MIT OCW, Vercel Academy)",
      "duration": "e.g. 15 Hours",
      "level": "Intermediate",
      "matchScore": 95,
      "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
      "skillsCovered": ["Skill A", "Skill B"],
      "whyRecommended": "Clear sentence explaining why this course targets the candidate's exact profile skill gap.",
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
      "title": "Book / Certification / Doc Title",
      "type": "Documentation",
      "provider": "Author/Provider",
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

    return NextResponse.json({
      success: true,
      courses: parsed.courses || FALLBACK_COURSES,
      projects: parsed.projects || FALLBACK_PROJECTS,
      resources: parsed.resources || FALLBACK_RESOURCES,
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
