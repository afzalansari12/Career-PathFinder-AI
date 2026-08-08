import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ATSEngine } from '@/lib/ats/engine';
import { ParsedResumeDocument, JobDescriptionCriteria } from '@/types/ats';

import { StructureEvaluator } from '@/lib/ats/evaluators/structure-evaluator';
import { ContactEvaluator } from '@/lib/ats/evaluators/contact-evaluator';
import { SectionEvaluator } from '@/lib/ats/evaluators/section-evaluator';
import { FormattingEvaluator } from '@/lib/ats/evaluators/formatting-evaluator';
import { KeywordEvaluator } from '@/lib/ats/evaluators/keyword-evaluator';
import { SkillsEvaluator } from '@/lib/ats/evaluators/skills-evaluator';
import { ExperienceEvaluator } from '@/lib/ats/evaluators/experience-evaluator';
import { EducationEvaluator } from '@/lib/ats/evaluators/education-evaluator';
import { ProjectEvaluator } from '@/lib/ats/evaluators/project-evaluator';
import { CompatibilityEvaluator } from '@/lib/ats/evaluators/compatibility-evaluator';

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
    const { doc, jd }: { doc: ParsedResumeDocument; jd?: JobDescriptionCriteria } = body;

    if (!doc || !doc.cleanedText) {
      return NextResponse.json({ error: 'Invalid document payload' }, { status: 400 });
    }

    const engine = new ATSEngine();
    engine.registerEvaluator(new StructureEvaluator());
    engine.registerEvaluator(new ContactEvaluator());
    engine.registerEvaluator(new SectionEvaluator());
    engine.registerEvaluator(new FormattingEvaluator());
    engine.registerEvaluator(new KeywordEvaluator());
    engine.registerEvaluator(new SkillsEvaluator());
    engine.registerEvaluator(new ExperienceEvaluator());
    engine.registerEvaluator(new EducationEvaluator());
    engine.registerEvaluator(new ProjectEvaluator());
    engine.registerEvaluator(new CompatibilityEvaluator());

    const report = await engine.process(doc, jd);

    const { data, error: dbError } = await supabase
      .from('ats_reports')
      .insert({
        user_id: user.id,
        overall_score: report.overallScore,
        report_data: report,
        created_at: report.createdAt,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Failed to store ATS report' }, { status: 500 });
    }

    return NextResponse.json({ reportId: data.id, report }, { status: 200 });
  } catch (err) {
    console.error('ATS Route Failure:', err);
    return NextResponse.json({ error: 'Internal Engine Error' }, { status: 500 });
  }
}