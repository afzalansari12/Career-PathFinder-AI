import { BaseEvaluator } from './base-evaluator';
import { CategoryResult, CategoryIssue, ParsedResumeDocument } from '@/types/ats';

export class FormattingEvaluator extends BaseEvaluator {
  category = 'formatting' as const;
  weight = 0.10;

  async evaluate(doc: ParsedResumeDocument): Promise<CategoryResult> {
    let score = 100;
    const issues: CategoryIssue[] = [];

    if (doc.hasTables) {
      score -= 30;
      issues.push({
        code: 'TABLES_DETECTED',
        severity: 'warning',
        message: 'Table elements found.',
        suggestion: 'Avoid using tables; use linear text formatting for ATS compliance.',
      });
    }

    const finalScore = Math.max(0, score);
    return {
      category: this.category,
      score: finalScore,
      weight: this.weight,
      weightedScore: this.calculateWeightedScore(finalScore),
      issues,
      metadata: { hasTables: doc.hasTables },
    };
  }
}