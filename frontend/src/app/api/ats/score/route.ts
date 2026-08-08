// frontend/src/app/api/ats/score/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DeterministicATSEngine } from '@/lib/ats/engine';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { rawText, targetRole } = body;

    if (!rawText) {
      return NextResponse.json({ error: 'Missing rawText field' }, { status: 400 });
    }

    const evaluation = DeterministicATSEngine.evaluate(rawText, targetRole || 'Software Engineer');

    await supabase.from('resumes').insert([
      {
        user_id: user.id,
        ats_score: evaluation.overallScore,
        parsed_data: evaluation,
      },
    ]);

    return NextResponse.json({
      success: true,
      ...evaluation,
    });
  } catch (error) {
    console.error('ATS Score API Error:', error);
    return NextResponse.json({ error: 'Failed to evaluate ATS score' }, { status: 500 });
  }
}