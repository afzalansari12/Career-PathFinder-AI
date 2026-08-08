import { BaseEvaluator } from './base-evaluator';
import { CategoryResult, ParsedResumeDocument } from '@/types/ats';

export class EducationEvaluator extends BaseEvaluator {
  category = 'educationQuality' as const;
  weight = 0.05;

  async evaluate(doc: ParsedResumeDocument): Promise<CategoryResult> {
    const textLower = doc.cleanedText.toLowerCase();
    const degrees = ['bachelor', 'master', 'bs', 'ms', 'phd', 'associate'];
    const hasDegree = degrees.some((d) => textLower.includes(d));
    const score = hasDegree ? 100 : 50;

    return {
      category: this.category,
      score,
      weight: this.weight,
      weightedScore: this.calculateWeightedScore(score),
      issues: hasDegree ? [] : [{ code: 'NO_DEGREE_DETECTED', severity: 'info', message: 'No formal degree term recognized.', suggestion: 'Clarify degree status if applicable.' }],
      metadata: { hasDegree },
    };
  }
}