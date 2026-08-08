import { BaseEvaluator } from './base-evaluator';
import { CategoryResult, CategoryIssue, ParsedResumeDocument } from '@/types/ats';

export class StructureEvaluator extends BaseEvaluator {
  category = 'structure' as const;
  weight = 0.08;

  async evaluate(doc: ParsedResumeDocument): Promise<CategoryResult> {
    let score = 100;
    const issues: CategoryIssue[] = [];

    if (doc.pageCount > 2) {
      score -= 20;
      issues.push({
        code: 'EXCESSIVE_PAGES',
        severity: 'warning',
        message: `Resume length is ${doc.pageCount} pages.`,
        suggestion: 'Keep your resume length to 1-2 pages maximum.',
      });
    }

    return {
      category: this.category,
      score: Math.max(0, score),
      weight: this.weight,
      weightedScore: this.calculateWeightedScore(Math.max(0, score)),
      issues,
      metadata: { pageCount: doc.pageCount },
    };
  }
}