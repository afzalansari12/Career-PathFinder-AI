// frontend/src/app/api/ats/evaluate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createSupabaseClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = (formData.get("file") as File) || (formData.get("resume") as File);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const textDecoder = new TextDecoder("utf-8");
    const resumeText = textDecoder.decode(arrayBuffer);

    // Initialized with valid Gemini API model identifier
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      You are an expert ATS optimization engine. Analyze the resume text and return raw JSON matching this schema:
      {
        "targetRole": "Primary technical role inferred from resume",
        "atsScore": 78,
        "scoreDiff": "+8%",
        "interviewReadiness": 75,
        "matchedRolesCount": 12,
        "skills": ["Skill1", "Skill2", "Skill3"],
        "missingKeywords": ["MissingSkill1", "MissingSkill2"],
        "strengths": ["Strength 1", "Strength 2"],
        "improvements": ["Improvement 1", "Improvement 2"],
        "recommendedRoadmap": [
          { "step": 1, "title": "Master Core Frameworks", "status": "In Progress" },
          { "step": 2, "title": "Build Real-time Projects", "status": "Pending" }
        ],
        "recommendedJobs": [
          { "title": "Software Engineer", "company": "Tech Corp", "location": "Remote", "matchScore": "88%" }
        ]
      }

      Resume Text:
      ${resumeText}
    `;

    const aiResult = await model.generateContent(prompt);
    const cleanResponse = aiResult.response.text().trim();
    const analysis = JSON.parse(cleanResponse);

    const supabase = await createSupabaseClient();
    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .upsert(
        {
          clerk_id: userId,
          target_role: analysis.targetRole,
          ats_score: analysis.atsScore,
          score_diff: analysis.scoreDiff || "+5%",
          interview_readiness: analysis.interviewReadiness,
          matched_roles_count: analysis.matchedRolesCount || 10,
          skills: analysis.skills,
          resume_text: resumeText,
          analysis_data: analysis,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "clerk_id" }
      )
      .select()
      .single();

    if (dbError) {
      console.error("Supabase Save Error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: analysis,
      profile,
    });
  } catch (error: any) {
    console.error("Gemini Evaluation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
}