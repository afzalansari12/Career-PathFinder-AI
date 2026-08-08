import { BaseEvaluator } from './base-evaluator';
import { CategoryResult, CategoryIssue, ParsedResumeDocument } from '@/types/ats';

export class ExperienceEvaluator extends BaseEvaluator {
  category = 'experienceQuality' as const;
  weight = 0.20;

  async evaluate(doc: ParsedResumeDocument): Promise<CategoryResult> {
    const issues: CategoryIssue[] = [];
    const text = doc.cleanedText;

    // Detect metric presence (numbers, percentages, dollar signs)
    const metricsMatches = text.match(/\d+%/g) || [];
    const score = Math.min(100, Math.max(40, metricsMatches.length * 20));

    if (metricsMatches.length < 3) {
      issues.push({
        code: 'LOW_QUANTIFIED_IMPACT',
        severity: 'warning',
        message: 'Few metrics or percentages detected in bullet points.',
        suggestion: 'Quantify impact using the Google X-Y-Z formula (e.g. Improved performance by 30%).',
      });
    }

    return {
      category: this.category,
      score,
      weight: this.weight,
      weightedScore: this.calculateWeightedScore(score),
      issues,
      metadata: { metricsCount: metricsMatches.length },
    };
  }
}