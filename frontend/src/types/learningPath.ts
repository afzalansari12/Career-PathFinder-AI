// frontend/src/types/learningPath.ts

export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";
export type LearningPace = "Fast" | "Standard" | "Relaxed";
export type LearningStyle = "Project-Based" | "Video" | "Theory/Docs" | "Interactive";
export type MilestoneStatus = "completed" | "in_progress" | "pending";

export interface SkillItem {
  name: string;
  level: number; // 1 to 5
  verified?: boolean;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gapSeverity: "Critical" | "Moderate" | "Minor";
  description: string;
}

export interface CompletedCourse {
  id: string;
  title: string;
  platform: string;
  dateCompleted: string;
  rating?: number;
  certificateUrl?: string;
  keySkillsLearned: string[];
}

export interface LearnerProfile {
  targetGoal: string;
  experienceLevel: ExperienceLevel;
  knownSkills: SkillItem[];
  targetSkills: SkillItem[];
  interests: string[];
  completedCourses: CompletedCourse[];
  preferences: {
    pace: LearningPace;
    style: LearningStyle;
    hoursPerWeek: number;
  };
  skillGaps: SkillGap[];
  lastUpdated: string;
}

export interface CourseRecommendation {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: ExperienceLevel;
  matchScore: number; // 0 to 100
  prerequisites: string[];
  skillsCovered: string[];
  url?: string;
  whyRecommended: string;
  category: "Core Foundation" | "Specialization" | "Advanced Mastery";
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  difficulty: ExperienceLevel;
  estimatedHours: number;
  techStack: string[];
  learningOutcomes: string[];
  whyRecommended: string;
  matchScore: number;
}

export interface ResourceRecommendation {
  id: string;
  title: string;
  type: "Documentation" | "Book" | "Interactive Tutorial" | "Certification";
  provider: string;
  url?: string;
  whyRecommended: string;
  matchScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MilestoneQuiz {
  quizTitle: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface LearningPhase {
  step: number;
  title: string;
  description: string;
  duration: string;
  status: MilestoneStatus;
  prerequisites: string[];
  topics: string[];
  projectIdea: string;
  recommendedCourseId?: string;
  quiz?: MilestoneQuiz;
}

export interface StructuredLearningPath {
  id: string;
  targetRole: string;
  overallDuration: string;
  weeklyCommitment: string;
  learningPace: LearningPace;
  matchScore: number;
  prerequisiteFlow: string[];
  phases: LearningPhase[];
  aiSummary: string;
  createdAt: string;
}

export interface LearningStats {
  completedMilestones: number;
  totalMilestones: number;
  progressPercent: number;
  hoursLogged: number;
  streakDays: number;
  skillsMasteredCount: number;
  nextRecommendedAction: {
    title: string;
    description: string;
    actionUrl: string;
    type: "course" | "project" | "quiz" | "milestone";
  };
}
