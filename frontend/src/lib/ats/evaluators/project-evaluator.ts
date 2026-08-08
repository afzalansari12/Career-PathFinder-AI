import { BaseEvaluator } from './base-evaluator';
import { CategoryResult, ParsedResumeDocument } from '@/types/ats';

export class ProjectEvaluator extends BaseEvaluator {
  category = 'projectQuality' as const;
  weight = 0.05;

  async evaluate(doc: ParsedResumeDocument): Promise<CategoryResult> {
    const textLower = doc.cleanedText.toLowerCase();
    const hasProjects = textLower.includes('project');
    const hasLinks = /github\.com|vercel\.app|netlify\.app/i.test(doc.cleanedText);

    let score = 50;
    if (hasProjects) score += 30;
    if (hasLinks) score += 20;

    return {
      category: this.category,
      score,
      weight: this.weight,
      weightedScore: this.calculateWeightedScore(score),
      issues: [],
      metadata: { hasProjects, hasLinks },
    };
  }
}