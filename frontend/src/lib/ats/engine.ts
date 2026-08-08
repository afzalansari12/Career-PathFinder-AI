import {
    ParsedResumeDocument,
    JobDescriptionCriteria,
    ATSAnalysisReport,
    ScoringCategory,
    CategoryResult,
    IEvaluator,
  } from '@/types/ats';
  import { extractResumeWithGroq } from './ai/groq-client';
  
  export class ATSEngine {
    private evaluators: Map<ScoringCategory, IEvaluator> = new Map();
  
    public registerEvaluator(evaluator: IEvaluator): void {
      this.evaluators.set(evaluator.category, evaluator);
    }
  
    public async process(
      doc: ParsedResumeDocument,
      jd?: JobDescriptionCriteria
    ): Promise<ATSAnalysisReport> {
      const extractedData = await extractResumeWithGroq(doc.cleanedText);
  
      const categories: ScoringCategory[] = [
        'structure',
        'contactInfo',
        'sections',
        'formatting',
        'keywordMatch',
        'skills',
        'experienceQuality',
        'educationQuality',
        'projectQuality',
        'atsCompatibility',
      ];
  
      const evaluationPromises = categories.map(async (cat) => {
        const evaluator = this.evaluators.get(cat);
        if (!evaluator) throw new Error(`Missing registered evaluator for category: ${cat}`);
        return evaluator.evaluate(doc, jd);
      });
  
      const results = await Promise.all(evaluationPromises);
  
      const categoryBreakdown = {} as Record<ScoringCategory, CategoryResult>;
      let totalWeightedScore = 0;
  
      for (const res of results) {
        categoryBreakdown[res.category] = res;
        totalWeightedScore += res.weightedScore;
      }
  
      const matchedKeywords: string[] = [];
      const missingKeywords: string[] = [];
  
      if (jd?.requiredKeywords) {
        const lowerText = doc.cleanedText.toLowerCase();
        jd.requiredKeywords.forEach((kw) => {
          if (lowerText.includes(kw.toLowerCase())) matchedKeywords.push(kw);
          else missingKeywords.push(kw);
        });
      }
  
      const matchPercentage = jd?.requiredKeywords.length
        ? Math.round((matchedKeywords.length / jd.requiredKeywords.length) * 100)
        : 0;
  
      return {
        id: crypto.randomUUID(),
        candidateName: extractedData.candidateName,
        overallScore: Math.round(totalWeightedScore),
        parsedData: {
          contactInfo: extractedData.contactInfo,
          sections: [],
          workExperience: extractedData.workExperience,
          education: extractedData.education,
          projects: extractedData.projects,
          skills: extractedData.skills,
        },
        categoryBreakdown,
        keywordAnalysis: {
          matchedKeywords,
          missingKeywords,
          matchPercentage,
        },
        createdAt: new Date().toISOString(),
      };
    }
  }