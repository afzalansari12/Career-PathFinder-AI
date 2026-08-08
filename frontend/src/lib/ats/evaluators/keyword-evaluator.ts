import { BaseEvaluator } from './base-evaluator';
import { CategoryResult, CategoryIssue, ParsedResumeDocument, JobDescriptionCriteria } from '@/types/ats';

export class KeywordEvaluator extends BaseEvaluator {
  category = 'keywordMatch' as const;
  weight = 0.20;

  async evaluate(doc: ParsedResumeDocument, jd?: JobDescriptionCriteria): Promise<CategoryResult> {
    const issues: CategoryIssue[] = [];

    if (!jd || !jd.requiredKeywords.length) {
      return {
        category: this.category,
        score: 100,
        weight: this.weight,
        weightedScore: this.calculateWeightedScore(100),
        issues: [{ code: 'NO_JD', severity: 'info', message: 'No target JD provided.', suggestion: 'Upload JD for analysis.' }],
        metadata: {},
      };
    }

    const textLower = doc.cleanedText.toLowerCase();
    const matched = jd.requiredKeywords.filter((kw) => textLower.includes(kw.toLowerCase()));
    const score = Math.round((matched.length / jd.requiredKeywords.length) * 100);

    if (score < 70) {
      issues.push({
        code: 'LOW_KEYWORD_MATCH',
        severity: 'warning',
        message: `Matched ${matched.length} of ${jd.requiredKeywords.length} required keywords.`,
        suggestion: 'Incorporate missing job-description keywords.',
      });
    }

    return {
      category: this.category,
      score,
      weight: this.weight,
      weightedScore: this.calculateWeightedScore(score),
      issues,
      metadata: { matchedCount: matched.length, total: jd.requiredKeywords.length },
    };
  }
}