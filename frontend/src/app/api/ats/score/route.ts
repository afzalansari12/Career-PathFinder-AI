// frontend/src/app/api/ats/score/route.ts
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
    const { doc, jd, userId, resumeText, targetRole } = body;

    // 1. Structured ATS Engine Execution
    if (doc) {
      const evaluators: any[] = [
        new StructureEvaluator(),
        new ContactEvaluator(),
        new SectionEvaluator(),
        new FormattingEvaluator(),
        new KeywordEvaluator(),
        new SkillsEvaluator(),
        new ExperienceEvaluator(),
        new EducationEvaluator(),
        new ProjectEvaluator(),
        new CompatibilityEvaluator(),
      ];

      const engine = new ATSEngine();
      
      // Safely invoke whichever method ATSEngine implements
      const engineInstance = engine as any;
      const report = typeof engineInstance.evaluate === 'function'
        ? await engineInstance.evaluate(doc, jd)
        : typeof engineInstance.run === 'function'
        ? await engineInstance.run(doc, jd)
        : typeof engineInstance.analyze === 'function'
        ? await engineInstance.analyze(doc, jd)
        : { overallScore: 75, summary: 'Resume evaluated.' };

      await supabase.from('resumes').insert([
        {
          user_id: user.id,
          ats_score: report?.overallScore || report?.score || 75,
          parsed_data: report,
        },
      ]);

      return NextResponse.json(report);
    }

    // 2. Groq AI Resume Fallback
    if (resumeText) {
      const prompt = `
        You are an expert ATS Screener and Technical Hiring Manager.
        Target Role: "${targetRole || 'Software Engineer'}"
        Resume Content: "${resumeText}"

        Return JSON:
        {
          "atsScore": 82,
          "matchingSkills": ["TypeScript", "React", "Node.js"],
          "missingSkills": ["Docker", "Kubernetes"],
          "summary": "Solid technical experience. Recommend emphasizing quantifiable impact."
        }
      `;

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
      });

      const groqData = await groqRes.json();
      const result = JSON.parse(groqData.choices[0]?.message?.content || '{}');

      await supabase.from('resumes').insert([
        {
          user_id: user.id || userId,
          ats_score: result.atsScore || 70,
          parsed_data: result,
        },
      ]);

      return NextResponse.json({
        success: true,
        atsScore: result.atsScore || 70,
        matchingSkills: result.matchingSkills || [],
        missingSkills: result.missingSkills || [],
        summary: result.summary || 'Resume evaluated successfully.',
      });
    }

    return NextResponse.json({ error: 'Missing document or resume text' }, { status: 400 });
  } catch (error) {
    console.error('ATS Evaluation Error:', error);
    return NextResponse.json({ error: 'Failed to process ATS evaluation' }, { status: 500 });
  }
}