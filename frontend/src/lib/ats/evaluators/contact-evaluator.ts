import { BaseEvaluator } from './base-evaluator';
import { CategoryResult, CategoryIssue, ParsedResumeDocument } from '@/types/ats';

export class ContactEvaluator extends BaseEvaluator {
  category = 'contactInfo' as const;
  weight = 0.05;

  async evaluate(doc: ParsedResumeDocument): Promise<CategoryResult> {
    const text = doc.cleanedText;
    const issues: CategoryIssue[] = [];
    let score = 100;

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;

    if (!emailRegex.test(text)) {
      score -= 30;
      issues.push({
        code: 'MISSING_EMAIL',
        severity: 'critical',
        message: 'Missing contact email.',
        suggestion: 'Add an email address near top of the resume.',
      });
    }

    if (!phoneRegex.test(text)) {
      score -= 25;
      issues.push({
        code: 'MISSING_PHONE',
        severity: 'critical',
        message: 'Missing phone number.',
        suggestion: 'Include a contact phone number.',
      });
    }

    if (!linkedinRegex.test(text)) {
      score -= 20;
      issues.push({
        code: 'MISSING_LINKEDIN',
        severity: 'warning',
        message: 'LinkedIn URL missing.',
        suggestion: 'Add your LinkedIn profile link.',
      });
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