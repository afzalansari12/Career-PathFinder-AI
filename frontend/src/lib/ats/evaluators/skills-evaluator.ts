import { BaseEvaluator } from './base-evaluator';
import { CategoryResult, CategoryIssue, ParsedResumeDocument } from '@/types/ats';
import { TECHNICAL_SKILLS_DB } from '../dictionaries/skills-db';

export class SkillsEvaluator extends BaseEvaluator {
  category = 'skills' as const;
  weight = 0.15;

  async evaluate(doc: ParsedResumeDocument): Promise<CategoryResult> {
    const textLower = doc.cleanedText.toLowerCase();
    const issues: CategoryIssue[] = [];

    let count = 0;
    TECHNICAL_SKILLS_DB.forEach((skill) => {
      if (textLower.includes(skill)) count++;
    });

    const score = Math.min(100, count * 10);
    if (score < 50) {
      issues.push({
        code: 'FEW_SKILLS_DETECTED',
        severity: 'warning',
        message: 'Low technical skill count detected.',
        suggestion: 'Explicitly list domain tools, languages, and frameworks.',
      });
    }

    return {
      category: this.category,
      score,
      weight: this.weight,
      weightedScore: this.calculateWeightedScore(score),
      issues,
      metadata: { detectedSkillsCount: count },
    };
  }
}