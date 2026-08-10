// frontend/src/app/api/ats/evaluate/route.ts
//
// Used by the "paste raw text and audit" tool on /dashboard/resume. This is
// a manual/testing entry point into the same DeterministicATSEngine that
// /api/upload uses for real PDF uploads — same scoring, same code path.
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { DeterministicATSEngine } from "@/lib/ats/engine";
import { z } from "zod";

const requestSchema = z.object({
  rawText: z.string().min(100, "Resume content must be at least 100 characters."),
  targetRole: z.string().optional().default("Software Engineer"),
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { rawText, targetRole } = validation.data;

    // Deterministic evaluation only — this endpoint intentionally skips the
    // Groq feedback step (kept fast for iterative "paste and test" use).
    const evaluation = DeterministicATSEngine.evaluate(rawText, targetRole);

    const { data: saved, error: dbError } = await supabaseAdmin
      .from("ats_evaluations")
      .insert({
        user_id: userId,
        resume_url: null,
        target_role: targetRole,
        overall_score: evaluation.overallScore,
        breakdown: evaluation.breakdown,
        deductions: evaluation.deductions,
        detected_skills: evaluation.detectedSkills,
        missing_skills: evaluation.missingSkills,
        metrics: evaluation.metrics,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase ATS Persistence Error:", dbError);
      return NextResponse.json({ error: "Failed to record evaluation" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      evaluationId: saved.id,
      ...evaluation,
    });
  } catch (error: unknown) {
    console.error("ATS API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
