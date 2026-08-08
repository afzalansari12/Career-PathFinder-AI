// frontend/src/app/api/ats/evaluate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { DeterministicATSEngine } from '@/lib/ats/engine';
import { z } from 'zod';

const requestSchema = z.object({
  rawText: z.string().min(100, 'Resume content must be at least 100 characters.'),
  targetRole: z.string().optional().default('Software Engineer'),
  resumeId: z.string().uuid().optional()
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { rawText, targetRole, resumeId } = validation.data;

    // 1. RUN DETERMINISTIC ATS EVALUATION
    const evaluation = DeterministicATSEngine.evaluate(rawText, targetRole);

    // 2. QUERY USER PROFILE FROM SUPABASE
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    // 3. PERSIST EVALUATION IN SUPABASE
    const { data: savedEvaluation, error: dbError } = await supabaseAdmin
      .from('ats_evaluations')
      .insert([
        {
          user_id: profile.id,
          resume_id: resumeId || null,
          overall_score: evaluation.overallScore,
          structure_score: evaluation.breakdown.structureScore,
          keyword_score: evaluation.breakdown.keywordScore,
          formatting_score: evaluation.breakdown.formattingScore,
          impact_score: evaluation.breakdown.impactScore,
          breakdown: evaluation.breakdown,
          deductions: evaluation.deductions,
          detected_skills: evaluation.detectedSkills,
          missing_critical_skills: evaluation.missingSkills
        }
      ])
      .select('*')
      .single();

    if (dbError) {
      console.error('Supabase ATS Persistence Error:', dbError);
      return NextResponse.json({ error: 'Failed to record evaluation record' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      evaluationId: savedEvaluation.id,
      ...evaluation
    });
  } catch (error: any) {
    console.error('ATS API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}