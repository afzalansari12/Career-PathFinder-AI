import { ScoringCategory, CategoryResult, IEvaluator, ParsedResumeDocument, JobDescriptionCriteria } from '@/types/ats';

export abstract class BaseEvaluator implements IEvaluator {
  abstract category: ScoringCategory;
  abstract weight: number;

  abstract evaluate(
    doc: ParsedResumeDocument,
    jd?: JobDescriptionCriteria
  ): Promise<CategoryResult>;

  protected calculateWeightedScore(rawScore: number): number {
    return Number((rawScore * this.weight).toFixed(2));
  }
}