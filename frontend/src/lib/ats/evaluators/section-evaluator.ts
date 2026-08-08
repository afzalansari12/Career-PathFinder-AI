import { BaseEvaluator } from './base-evaluator';
import { CategoryResult, CategoryIssue, ParsedResumeDocument } from '@/types/ats';
import { SECTION_HEADERS } from '../dictionaries/headers';

export class SectionEvaluator extends BaseEvaluator {
  category = 'sections' as const;
  weight = 0.07;

  async evaluate(doc: ParsedResumeDocument): Promise<CategoryResult> {
    const textLower = doc.cleanedText.toLowerCase();
    const issues: CategoryIssue[] = [];
    let score = 100;

    const coreSections = ['experience', 'education', 'skills'];
    for (const sec of coreSections) {
      const aliases = SECTION_HEADERS[sec];
      const found = aliases.some((alias) => textLower.includes(alias));
      if (!found) {
        score -= 25;
        issues.push({
          code: `MISSING_${sec.toUpperCase()}_SECTION`,
          severity: 'critical',
          message: `Missing core section: ${sec.toUpperCase()}`,
          suggestion: `Add a dedicated section header titled '${sec.toUpperCase()}'.`,
        });
      }
    }

    const finalScore = Math.max(0, score);
    return {
      category: this.category,
      score: finalScore,
      weight: this.weight,
      weightedScore: this.calculateWeightedScore(finalScore),
      issues,
      metadata: {},
    };
  }
}