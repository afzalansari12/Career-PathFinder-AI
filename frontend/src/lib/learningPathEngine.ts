// frontend/src/lib/learningPathEngine.ts

import {
  LearnerProfile,
  StructuredLearningPath,
  SkillGap,
  CourseRecommendation,
  ProjectRecommendation,
  ResourceRecommendation,
  LearningStats,
} from "@/types/learningPath";

const PROFILE_STORAGE_KEY = "pathfinder_learner_profile";
const PATH_STORAGE_KEY = "pathfinder_active_learning_path";
const COMPLETED_COURSES_KEY = "pathfinder_completed_courses";

export const DEFAULT_PROFILE: LearnerProfile = {
  targetGoal: "Full Stack AI Engineer",
  experienceLevel: "Intermediate",
  knownSkills: [
    { name: "JavaScript", level: 4, verified: true },
    { name: "React", level: 3, verified: true },
    { name: "HTML/CSS", level: 4, verified: true },
    { name: "Python", level: 2, verified: false },
    { name: "Node.js", level: 2, verified: false },
  ],
  targetSkills: [
    { name: "TypeScript", level: 4 },
    { name: "Next.js", level: 4 },
    { name: "LLMs & RAG Architectures", level: 4 },
    { name: "Vector Databases & Embeddings", level: 4 },
    { name: "PostgreSQL & Prisma", level: 4 },
    { name: "System Design & Microservices", level: 4 },
  ],
  interests: ["Generative AI", "Full Stack Development", "Vector Search", "Cloud Architecture"],
  completedCourses: [
    {
      id: "course-c1",
      title: "Complete Web Development Bootcamp",
      platform: "Udemy",
      dateCompleted: "2025-11-15",
      rating: 5,
      keySkillsLearned: ["HTML", "CSS", "JavaScript", "React Basics"],
    },
    {
      id: "course-c2",
      title: "Python for Data Science & AI",
      platform: "Coursera / IBM",
      dateCompleted: "2026-01-20",
      rating: 4,
      keySkillsLearned: ["Python Basics", "Pandas", "NumPy"],
    },
  ],
  preferences: {
    pace: "Standard",
    style: "Project-Based",
    hoursPerWeek: 10,
  },
  skillGaps: [],
  lastUpdated: new Date().toISOString(),
};

export function calculateSkillGaps(profile: LearnerProfile): SkillGap[] {
  const gaps: SkillGap[] = [];

  profile.targetSkills.forEach((target) => {
    const known = profile.knownSkills.find(
      (k) => k.name.toLowerCase() === target.name.toLowerCase()
    );

    const currentLevel = known ? known.level : 0;
    const diff = target.level - currentLevel;

    if (diff > 0) {
      let severity: "Critical" | "Moderate" | "Minor" = "Minor";
      if (diff >= 3) severity = "Critical";
      else if (diff === 2) severity = "Moderate";

      gaps.push({
        skill: target.name,
        currentLevel,
        requiredLevel: target.level,
        gapSeverity: severity,
        description: `Current proficiency is level ${currentLevel}/5, target role requires level ${target.level}/5.`,
      });
    }
  });

  return gaps;
}

export function loadStoredProfile(): LearnerProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!data) return DEFAULT_PROFILE;
    const parsed = JSON.parse(data);
    parsed.skillGaps = calculateSkillGaps(parsed);
    return parsed;
  } catch (e) {
    console.error("Failed to parse stored profile:", e);
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: LearnerProfile): void {
  if (typeof window === "undefined") return;
  profile.skillGaps = calculateSkillGaps(profile);
  profile.lastUpdated = new Date().toISOString();
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function loadStoredLearningPath(): StructuredLearningPath | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(PATH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredLearningPath(path: StructuredLearningPath): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PATH_STORAGE_KEY, JSON.stringify(path));
}

export function calculateStats(path: StructuredLearningPath | null): LearningStats {
  if (!path || !path.phases || path.phases.length === 0) {
    return {
      completedMilestones: 1,
      totalMilestones: 4,
      progressPercent: 25,
      hoursLogged: 14,
      streakDays: 4,
      skillsMasteredCount: 5,
      nextRecommendedAction: {
        title: "Complete Phase 2: Next.js & Server Actions",
        description: "Build high-throughput SSR endpoints with Next.js App Router.",
        actionUrl: "/roadmap",
        type: "milestone",
      },
    };
  }

  const completed = path.phases.filter((p) => p.status === "completed").length;
  const total = path.phases.length;
  const progressPercent = Math.round((completed / total) * 100);

  const inProgressPhase = path.phases.find((p) => p.status === "in_progress") || path.phases[completed];

  return {
    completedMilestones: completed,
    totalMilestones: total,
    progressPercent,
    hoursLogged: completed * 15 + (inProgressPhase ? 6 : 0),
    streakDays: 5,
    skillsMasteredCount: completed * 3 + 2,
    nextRecommendedAction: {
      title: inProgressPhase ? `Phase ${inProgressPhase.step}: ${inProgressPhase.title}` : "All Phases Mastered!",
      description: inProgressPhase ? inProgressPhase.description : "You are ready for target role applications.",
      actionUrl: "/roadmap",
      type: "milestone",
    },
  };
}

export const FALLBACK_COURSES: CourseRecommendation[] = [
  {
    id: "rec-course-1",
    title: "Next.js 16 & React 19 Full-Stack Architecture",
    provider: "Vercel Academy / Frontend Masters",
    duration: "15 Hours",
    level: "Intermediate",
    matchScore: 96,
    prerequisites: ["Modern JavaScript", "React Fundamentals"],
    skillsCovered: ["Next.js App Router", "Server Components", "Server Actions", "Streaming SSR"],
    whyRecommended: "Directly bridges your gap in Next.js 16 server-side rendering required for Full Stack AI Engineering.",
    category: "Core Foundation",
  },
  {
    id: "rec-course-2",
    title: "Production LLMs & RAG Application Development",
    provider: "DeepLearning.AI / LangChain",
    duration: "20 Hours",
    level: "Intermediate",
    matchScore: 94,
    prerequisites: ["Python Basics", "API Integration"],
    skillsCovered: ["LangChain", "Vector Embeddings", "Pinecone/Qdrant", "Prompt Engineering"],
    whyRecommended: "Addresses your critical skill gap in Generative AI architectures and vector search integration.",
    category: "Specialization",
  },
  {
    id: "rec-course-3",
    title: "PostgreSQL Performance Optimization & Prisma ORM",
    provider: "Educative.io",
    duration: "12 Hours",
    level: "Intermediate",
    matchScore: 89,
    prerequisites: ["Basic SQL"],
    skillsCovered: ["Database Indexing", "Prisma Schemas", "Query Optimization", "Connection Pooling"],
    whyRecommended: "Covers database scaling techniques necessary for handling high-concurrency production apps.",
    category: "Core Foundation",
  },
  {
    id: "rec-course-4",
    title: "System Design for High-Scalability Applications",
    provider: "ByteByteGo",
    duration: "25 Hours",
    level: "Advanced",
    matchScore: 91,
    prerequisites: ["REST APIs", "Database Basics"],
    skillsCovered: ["Distributed Caching (Redis)", "Message Queues (Kafka)", "Microservices", "Load Balancing"],
    whyRecommended: "Essential for mastering architectural trade-offs required in Senior & Lead engineering roles.",
    category: "Advanced Mastery",
  },
];

export const FALLBACK_PROJECTS: ProjectRecommendation[] = [
  {
    id: "rec-proj-1",
    title: "AI Knowledge Base & Contextual Search (RAG System)",
    description: "Build an enterprise document search engine using Next.js 16, OpenAI/Gemini embeddings, and Pinecone vector store.",
    difficulty: "Intermediate",
    estimatedHours: 20,
    techStack: ["Next.js", "TypeScript", "Vector DB", "OpenAI/Gemini API", "Tailwind CSS"],
    learningOutcomes: ["Chunking strategy implementation", "Semantic search indexing", "Streaming chat completions"],
    whyRecommended: "Combines your React background with your target skill in Vector Databases and RAG pipelines.",
    matchScore: 98,
  },
  {
    id: "rec-proj-2",
    title: "Distributed Task Queue & Notification Engine",
    description: "Architect a resilient microservice queue using Node.js, Redis Pub/Sub, PostgreSQL, and WebSockets for real-time alerts.",
    difficulty: "Advanced",
    estimatedHours: 25,
    techStack: ["Node.js", "TypeScript", "Redis", "PostgreSQL", "Docker"],
    learningOutcomes: ["Sliding-window rate limiting", "Idempotent job execution", "Distributed state management"],
    whyRecommended: "Directly satisfies the System Design & Microservices competency for your target role.",
    matchScore: 92,
  },
];

export const FALLBACK_RESOURCES: ResourceRecommendation[] = [
  {
    id: "rec-res-1",
    title: "Next.js Official App Router Guide & Patterns",
    type: "Documentation",
    provider: "Vercel",
    url: "https://nextjs.org/docs",
    whyRecommended: "Authoritative reference for server components, caching strategies, and route handlers.",
    matchScore: 95,
  },
  {
    id: "rec-res-2",
    title: "Designing Data-Intensive Applications",
    type: "Book",
    provider: "O'Reilly (Martin Kleppmann)",
    whyRecommended: "Industry-standard text on reliable, scalable, and maintainable storage engines & distributed systems.",
    matchScore: 93,
  },
  {
    id: "rec-res-3",
    title: "AWS Certified Solutions Architect – Associate",
    type: "Certification",
    provider: "Amazon Web Services",
    whyRecommended: "Validates your cloud infrastructure deployment skills for hiring managers.",
    matchScore: 88,
  },
];
