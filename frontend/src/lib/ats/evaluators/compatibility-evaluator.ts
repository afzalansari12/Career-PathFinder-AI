import { BaseEvaluator } from './base-evaluator';
import { CategoryResult, ParsedResumeDocument } from '@/types/ats';

export class CompatibilityEvaluator extends BaseEvaluator {
  category = 'atsCompatibility' as const;
  weight = 0.05;

  async evaluate(doc: ParsedResumeDocument): Promise<CategoryResult> {
    const rawLen = doc.rawText.length || 1;
    const nonAscii = (doc.rawText.match(/[^\x00-\x7F]/g) || []).length;
    const corruptionRatio = nonAscii / rawLen;

    const score = Math.max(0, Math.round(100 - corruptionRatio * 500));

    return {
      category: this.category,
      score,
      weight: this.weight,
      weightedScore: this.calculateWeightedScore(score),
      issues: score < 80 ? [{ code: 'ENCODING_ISSUES', severity: 'warning', message: 'Unusual character encoding observed.', suggestion: 'Re-export your resume from Word/Google Docs using standard PDF defaults.' }] : [],
      metadata: { corruptionRatio },
    };
  }
}