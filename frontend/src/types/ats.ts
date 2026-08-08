export type ScoringCategory =
  | 'structure'
  | 'contactInfo'
  | 'sections'
  | 'formatting'
  | 'keywordMatch'
  | 'skills'
  | 'experienceQuality'
  | 'educationQuality'
  | 'projectQuality'
  | 'atsCompatibility';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

export interface ParsedTextElement {
  text: string;
  bounds: BoundingBox;
  fontName: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
}

export interface ParsedResumeDocument {
  rawText: string;
  cleanedText: string;
  elements: ParsedTextElement[];
  pageCount: number;
  hasTables: boolean;
  hasImages: boolean;
  detectedFonts: string[];
  fileType: 'pdf' | 'docx';
}

export interface ContactInfo {
  email: string | null;
  phone: string | null;
  linkedInUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  location: {
    city: string | null;
    state: string | null;
    country: string | null;
    raw: string | null;
  };
}

export interface ResumeSection {
  type: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'custom';
  headerText: string;
  rawContent: string;
  startLine: number;
  endLine: number;
}

export interface WorkExperienceItem {
  company: string | null;
  roleTitle: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  bulletPoints: string[];
  quantifiedImpactScore: number;
  actionVerbsUsed: string[];
}

export interface EducationItem {
  institution: string | null;
  degree: string | null;
  fieldOfStudy: string | null;
  graduationYear: string | null;
  gpa: string | null;
}

export interface ProjectItem {
  title: string | null;
  description: string | null;
  technologiesUsed: string[];
  liveUrl: string | null;
}

export interface ExtractedSkills {
  hardSkills: string[];
  softSkills: string[];
  toolsAndFrameworks: string[];
  embeddedInExperience: string[];
}

export interface JobDescriptionCriteria {
  title: string;
  rawText: string;
  requiredKeywords: string[];
  preferredKeywords: string[];
  requiredSkills: string[];
  minimumEducationLevel: string | null;
  minYearsExperience: number | null;
}

export interface CategoryIssue {
  code: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  suggestion: string;
  affectedText?: string;
}

export interface CategoryResult {
  category: ScoringCategory;
  score: number;
  weight: number;
  weightedScore: number;
  issues: CategoryIssue[];
  metadata: Record<string, unknown>;
}

export interface ATSAnalysisReport {
  id: string;
  candidateName: string | null;
  overallScore: number;
  parsedData: {
    contactInfo: ContactInfo;
    sections: ResumeSection[];
    workExperience: WorkExperienceItem[];
    education: EducationItem[];
    projects: ProjectItem[];
    skills: ExtractedSkills;
  };
  categoryBreakdown: Record<ScoringCategory, CategoryResult>;
  keywordAnalysis: {
    matchedKeywords: string[];
    missingKeywords: string[];
    matchPercentage: number;
  };
  createdAt: string;
}

export interface IEvaluator {
  category: ScoringCategory;
  weight: number;
  evaluate(
    doc: ParsedResumeDocument,
    jd?: JobDescriptionCriteria
  ): Promise<CategoryResult>;
}