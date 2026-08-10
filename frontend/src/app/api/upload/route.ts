// frontend/src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { extractPdfText } from "@/lib/pdf";
import { DeterministicATSEngine } from "@/lib/ats/engine";
import { generateResumeFeedback } from "@/lib/groq";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xbyossuhwotuzqgzbykb.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_key";
  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const targetRole = (formData.get("targetRole") as string) || "Software Engineer";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extract raw text from the PDF (no AI)
    const resumeText = await extractPdfText(buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Ensure the file is not scanned/image-only." },
        { status: 400 }
      );
    }

    // 2. Deterministic ATS scoring (no AI) — this is the score of record.
    const evaluation = DeterministicATSEngine.evaluate(resumeText, targetRole);

    // 3. Groq only narrates the finished result — it cannot change the score.
    const feedback = await generateResumeFeedback(evaluation, targetRole);

    const supabaseAdmin = getSupabaseAdmin();

    // 4. Upload the original PDF to Supabase Storage
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    const { error: storageError } = await supabaseAdmin.storage
      .from("resumes")
      .upload(fileName, buffer, { upsert: true, contentType: "application/pdf" });

    if (storageError) {
      console.error("Storage error:", storageError);
    }

    // 5. Persist the full analysis
    const { data: saved, error: dbError } = await supabaseAdmin
      .from("ats_evaluations")
      .insert({
        user_id: userId,
        resume_url: storageError ? null : fileName,
        target_role: targetRole,
        overall_score: evaluation.overallScore,
        breakdown: evaluation.breakdown,
        deductions: evaluation.deductions,
        detected_skills: evaluation.detectedSkills,
        missing_skills: evaluation.missingSkills,
        metrics: evaluation.metrics,
        ai_summary: feedback.summary,
        ai_strengths: feedback.strengths,
        ai_improvements: feedback.improvements,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
    }

    return NextResponse.json({
      success: true,
      evaluationId: saved?.id || "demo-eval-id",
      ...evaluation,
      aiFeedback: feedback,
    });
  } catch (error: unknown) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
