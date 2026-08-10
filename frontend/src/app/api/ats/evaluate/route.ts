// frontend/src/app/api/ats/evaluate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { extractPdfText } from "@/lib/pdf";
import { DeterministicATSEngine } from "@/lib/ats/engine";
import { generateResumeFeedback } from "@/lib/groq";
import { createSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch {
      // Allow unauthenticated demo mode if auth fails or during local testing
    }

    const formData = await req.formData();
    const file = (formData.get("file") as File) || (formData.get("resume") as File);
    const targetRole = (formData.get("targetRole") as string) || "Software Engineer";

    if (!file) {
      return NextResponse.json({ error: "No resume file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText = "";
    if (file.name.toLowerCase().endsWith(".pdf")) {
      try {
        resumeText = await extractPdfText(buffer);
      } catch (pdfErr) {
        console.error("PDF Extraction error:", pdfErr);
        const decoder = new TextDecoder("utf-8");
        resumeText = decoder.decode(arrayBuffer);
      }
    } else {
      const decoder = new TextDecoder("utf-8");
      resumeText = decoder.decode(arrayBuffer);
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from file. Please ensure it is a valid text or un-scanned PDF file." },
        { status: 400 }
      );
    }

    // 1. Deterministic ATS Scoring
    const evaluation = DeterministicATSEngine.evaluate(resumeText, targetRole);

    // 2. AI Executive Feedback & Actionable Recommendations
    const aiFeedback = await generateResumeFeedback(evaluation, targetRole);

    const interviewReadiness = Math.min(95, Math.max(40, Math.round(evaluation.overallScore * 0.92)));
    const matchedRolesCount = Math.max(6, evaluation.detectedSkills.length * 3 + 4);

    const fullResult = {
      targetRole,
      overallScore: evaluation.overallScore,
      scoreDiff: "+6%",
      interviewReadiness,
      matchedRolesCount,
      breakdown: evaluation.breakdown,
      detectedSkills: evaluation.detectedSkills,
      missingSkills: evaluation.missingSkills,
      deductions: evaluation.deductions,
      metrics: evaluation.metrics,
      summary: aiFeedback.summary,
      strengths: aiFeedback.strengths,
      improvements: aiFeedback.improvements,
    };

    // Save to Supabase if user and DB connection available
    if (userId) {
      try {
        const supabase = await createSupabaseClient();
        await supabase.from("profiles").upsert(
          {
            clerk_id: userId,
            target_role: targetRole,
            ats_score: evaluation.overallScore,
            score_diff: "+6%",
            interview_readiness: interviewReadiness,
            matched_roles_count: matchedRolesCount,
            skills: evaluation.detectedSkills,
            resume_text: resumeText,
            analysis_data: fullResult,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "clerk_id" }
        );
      } catch (dbErr) {
        console.warn("Supabase profile update warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: fullResult,
    });
  } catch (error: unknown) {
    console.error("ATS Evaluate Route Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze resume" },
      { status: 500 }
    );
  }
}