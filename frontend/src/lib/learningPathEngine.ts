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

export const DEFAULT_PROFILE: LearnerProfile = {
  targetGoal: "Software Engineer",
  experienceLevel: "Intermediate",
  knownSkills: [
    { name: "JavaScript", level: 4, verified: true },
    { name: "React", level: 3, verified: true },
    { name: "HTML/CSS", level: 4, verified: true },
    { name: "Python", level: 2, verified: false },
    { name: "Node.js", level: 2, verified: false },
  ],
  targetSkills: [
    { name: "Data Structures & Algorithms", level: 4 },
    { name: "TypeScript & Object-Oriented Design", level: 4 },
    { name: "PostgreSQL & Database Indexing", level: 4 },
    { name: "System Design & Caching (Redis)", level: 4 },
    { name: "Microservices & Docker", level: 4 },
    { name: "CI/CD & Cloud Infrastructure", level: 4 },
  ],
  interests: ["Software Architecture", "Full Stack Development", "Distributed Systems"],
  completedCourses: [
    {
      id: "course-c1",
      title: "Complete Web Development Bootcamp",
      platform: "Udemy",
      dateCompleted: "2025-11-15",
      rating: 5,
      keySkillsLearned: ["HTML", "CSS", "JavaScript", "React Basics"],
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

export function getRoleTargetSkills(role: string) {
  const r = role.toLowerCase();
  if (r.includes("software engineer") || r.includes("sde") || r.includes("backend")) {
    return [
      { name: "Data Structures & Algorithms", level: 4 },
      { name: "TypeScript & Object-Oriented Design", level: 4 },
      { name: "PostgreSQL & Database Indexing", level: 4 },
      { name: "System Design & Distributed Caching (Redis)", level: 4 },
      { name: "Microservices & Docker Containerization", level: 4 },
      { name: "CI/CD & Cloud Infrastructure", level: 4 },
    ];
  } else if (r.includes("ai") || r.includes("machine learning") || r.includes("ml")) {
    return [
      { name: "Python & Numerical Computing (NumPy/Pandas)", level: 5 },
      { name: "Deep Learning & PyTorch Models", level: 4 },
      { name: "LLMs & RAG Architectures (LangChain/LlamaIndex)", level: 4 },
      { name: "Vector Databases & Embeddings (Pinecone/Qdrant)", level: 4 },
      { name: "MLOps & Model Deployment (FastAPI/Docker)", level: 4 },
    ];
  } else if (r.includes("frontend") || r.includes("web")) {
    return [
      { name: "Modern JavaScript & TypeScript", level: 5 },
      { name: "React 19 & Next.js App Router", level: 5 },
      { name: "CSS Architecture & Tailwind CSS", level: 4 },
      { name: "State Synchronization & WebSockets", level: 4 },
      { name: "Web Performance & Core Web Vitals", level: 4 },
    ];
  } else if (r.includes("devops") || r.includes("cloud")) {
    return [
      { name: "Linux System Administration & Bash", level: 4 },
      { name: "Docker & Kubernetes Orchestration", level: 5 },
      { name: "Infrastructure as Code (Terraform)", level: 4 },
      { name: "CI/CD Pipelines (GitHub Actions/GitLab)", level: 5 },
      { name: "Cloud Platforms (AWS/GCP)", level: 4 },
    ];
  } else if (r.includes("mobile") || r.includes("android") || r.includes("ios")) {
    return [
      { name: "Cross-Platform Frameworks (React Native/Flutter)", level: 5 },
      { name: "State Management & Navigation", level: 4 },
      { name: "Native Device APIs (GPS, Camera, Push Notifications)", level: 4 },
      { name: "Offline Database Sync (SQLite/WatermelonDB)", level: 4 },
      { name: "App Store Publishing & CI/CD", level: 4 },
    ];
  }

  // Generic Software Engineering default target skills
  return [
    { name: "Data Structures & Algorithms", level: 4 },
    { name: "TypeScript & Software Architecture", level: 4 },
    { name: "PostgreSQL & Database Systems", level: 4 },
    { name: "System Design & Distributed Caching", level: 4 },
    { name: "Docker & Cloud Deployment", level: 4 },
  ];
}

export function calculateSkillGaps(profile: LearnerProfile): SkillGap[] {
  const gaps: SkillGap[] = [];
  const targetSkills = profile.targetSkills && profile.targetSkills.length > 0
    ? profile.targetSkills
    : getRoleTargetSkills(profile.targetGoal);

  targetSkills.forEach((target) => {
    const known = (profile.knownSkills || []).find(
      (k) => k.name.toLowerCase().includes(target.name.toLowerCase()) || target.name.toLowerCase().includes(k.name.toLowerCase())
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
        description: `Current proficiency is level ${currentLevel}/5, target role (${profile.targetGoal}) requires level ${target.level}/5.`,
      });
    }
  });

  return gaps;
}

export function getRoleTailoredRecommendations(role: string): {
  courses: CourseRecommendation[];
  projects: ProjectRecommendation[];
  resources: ResourceRecommendation[];
} {
  const r = role.toLowerCase();

  if (r.includes("software engineer") || r.includes("sde") || r.includes("backend")) {
    return {
      courses: [
        {
          id: "course-se-1",
          title: "Data Structures and Algorithms Specialization",
          provider: "Coursera / UC San Diego",
          duration: "30 Hours",
          level: "Intermediate",
          matchScore: 97,
          prerequisites: ["Basic Programming"],
          skillsCovered: ["Trees & Graphs", "Dynamic Programming", "Sorting & Searching"],
          url: "https://www.coursera.org/specializations/data-structures-algorithms",
          whyRecommended: "Essential core foundation for passing software engineering technical interviews and building efficient code.",
          category: "Core Foundation",
        },
        {
          id: "course-se-2",
          title: "System Design for High-Scalability Applications",
          provider: "ByteByteGo (Alex Xu)",
          duration: "25 Hours",
          level: "Advanced",
          matchScore: 95,
          prerequisites: ["REST APIs", "SQL Basics"],
          skillsCovered: ["Distributed Caching", "Message Queues", "Database Sharding", "Load Balancing"],
          url: "https://bytebytego.com",
          whyRecommended: "Master high-throughput system design principles required for Mid to Senior Software Engineer positions.",
          category: "Specialization",
        },
        {
          id: "course-se-3",
          title: "PostgreSQL High Performance & Query Tuning",
          provider: "Udemy",
          duration: "14 Hours",
          level: "Intermediate",
          matchScore: 92,
          prerequisites: ["Basic SQL"],
          skillsCovered: ["B-Tree Indexing", "EXPLAIN ANALYZE", "Partitioning", "Connection Pooling"],
          url: "https://www.udemy.com/course/postgresql-persistence/",
          whyRecommended: "Directly bridges database performance and query indexing skills required for backend software engineers.",
          category: "Core Foundation",
        },
      ],
      projects: [
        {
          id: "proj-se-1",
          title: "Distributed Rate-Limiting Microservice & Task Queue",
          description: "Architect a resilient sliding-window rate limiter microservice using Node.js, Redis, PostgreSQL, and Docker.",
          difficulty: "Intermediate",
          estimatedHours: 25,
          techStack: ["Node.js", "TypeScript", "Redis", "PostgreSQL", "Docker"],
          learningOutcomes: ["Sliding-window token bucket implementation", "Concurrency handling", "Idempotent job execution"],
          whyRecommended: "Portfolio project demonstrating system design, distributed caching, and backend API scalability.",
          matchScore: 98,
        },
        {
          id: "proj-se-2",
          title: "High-Throughput E-Commerce Order Processing Engine",
          description: "Build an event-driven order engine with RabbitMQ message queues, PostgreSQL transactions, and Redis caching.",
          difficulty: "Advanced",
          estimatedHours: 30,
          techStack: ["Go / Node.js", "RabbitMQ", "PostgreSQL", "Docker"],
          learningOutcomes: ["ACID transaction guarantees", "Event-driven architecture", "Microservice isolation"],
          whyRecommended: "Showcases real-world software engineering capabilities in distributed transactions and messaging.",
          matchScore: 94,
        },
      ],
      resources: [
        {
          id: "res-se-1",
          title: "Designing Data-Intensive Applications",
          type: "Book",
          provider: "O'Reilly (Martin Kleppmann)",
          url: "https://dataintensive.net",
          whyRecommended: "The definitive industry reference on storage engines, replication, partition sharding, and consensus.",
          matchScore: 96,
        },
        {
          id: "res-se-2",
          title: "MIT 6.824: Distributed Systems Course Notes",
          type: "Documentation",
          provider: "MIT OpenCourseWare",
          url: "https://ocw.mit.edu/courses/6-824-distributed-systems-spring-2020/",
          whyRecommended: "Deep dive into Raft consensus, MapReduce, and fault-tolerant distributed system design.",
          matchScore: 93,
        },
      ],
    };
  } else if (r.includes("ai") || r.includes("machine learning") || r.includes("ml")) {
    return {
      courses: [
        {
          id: "course-ai-1",
          title: "Production LLMs & RAG Application Development",
          provider: "DeepLearning.AI / LangChain",
          duration: "20 Hours",
          level: "Intermediate",
          matchScore: 98,
          prerequisites: ["Python Basics"],
          skillsCovered: ["LangChain", "Vector Embeddings", "Pinecone/Qdrant", "Prompt Engineering"],
          url: "https://www.deeplearning.ai",
          whyRecommended: "Directly bridges your critical skill gap in RAG pipelines and vector database integration for AI Engineering.",
          category: "Specialization",
        },
        {
          id: "course-ai-2",
          title: "Deep Learning Specialization (PyTorch & Transformers)",
          provider: "Coursera / Andrew Ng",
          duration: "40 Hours",
          level: "Advanced",
          matchScore: 95,
          prerequisites: ["Python", "Linear Algebra"],
          skillsCovered: ["Neural Networks", "Transformer Architecture", "Attention Mechanisms", "PyTorch"],
          url: "https://www.coursera.org/specializations/deep-learning",
          whyRecommended: "Authoritative deep learning foundation for training and fine-tuning AI models.",
          category: "Core Foundation",
        },
      ],
      projects: [
        {
          id: "proj-ai-1",
          title: "AI Knowledge Base & Contextual Search (RAG Engine)",
          description: "Build an enterprise document search engine using Next.js 16, OpenAI/Gemini embeddings, and Pinecone vector store.",
          difficulty: "Intermediate",
          estimatedHours: 20,
          techStack: ["Next.js", "Python", "Vector DB", "Gemini API", "Tailwind CSS"],
          learningOutcomes: ["Chunking strategy implementation", "Semantic search indexing", "Streaming chat completions"],
          whyRecommended: "Combines full stack development with your target skill in Vector Databases and RAG pipelines.",
          matchScore: 99,
        },
      ],
      resources: [
        {
          id: "res-ai-1",
          title: "Hugging Face Transformers Documentation & Guides",
          type: "Documentation",
          provider: "Hugging Face",
          url: "https://huggingface.co/docs",
          whyRecommended: "Essential guide for loading, fine-tuning, and deploying open-source AI models.",
          matchScore: 94,
        },
      ],
    };
  }

  // Default Software Engineer / Full Stack recommendations with working links
  return {
    courses: [
      {
        id: "course-def-1",
        title: "Next.js 16 & React 19 Full-Stack Architecture",
        provider: "Vercel Academy",
        duration: "15 Hours",
        level: "Intermediate",
        matchScore: 96,
        prerequisites: ["Modern JavaScript", "React Fundamentals"],
        skillsCovered: ["Next.js App Router", "Server Components", "Server Actions", "Streaming SSR"],
        url: "https://nextjs.org/learn",
        whyRecommended: "Bridges full stack development and modern server-side rendering for your target engineering goal.",
        category: "Core Foundation",
      },
      {
        id: "course-def-2",
        title: "System Design for High-Scalability Applications",
        provider: "ByteByteGo",
        duration: "25 Hours",
        level: "Advanced",
        matchScore: 93,
        prerequisites: ["REST APIs"],
        skillsCovered: ["Distributed Caching (Redis)", "Message Queues", "Microservices", "Load Balancing"],
        url: "https://bytebytego.com",
        whyRecommended: "Essential for mastering architectural trade-offs required in software engineering roles.",
        category: "Specialization",
      },
    ],
    projects: [
      {
        id: "proj-def-1",
        title: "Enterprise Full Stack Application & Database Architecture",
        description: "Build a high-performance web application with Next.js, PostgreSQL, Redis caching, and Docker containerization.",
        difficulty: "Intermediate",
        estimatedHours: 25,
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
        learningOutcomes: ["Full stack architecture", "Database indexing", "Caching strategy"],
        whyRecommended: "Demonstrates end-to-end software development capabilities for your target role.",
        matchScore: 96,
      },
    ],
    resources: [
      {
        id: "res-def-1",
        title: "Next.js Official Documentation & App Router Patterns",
        type: "Documentation",
        provider: "Vercel",
        url: "https://nextjs.org/docs",
        whyRecommended: "Authoritative reference for modern server components and scalable architecture.",
        matchScore: 95,
      },
    ],
  };
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
        title: "Complete Phase 2: High-Throughput APIs & SSR",
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

export const FALLBACK_COURSES = getRoleTailoredRecommendations("Software Engineer").courses;
export const FALLBACK_PROJECTS = getRoleTailoredRecommendations("Software Engineer").projects;
export const FALLBACK_RESOURCES = getRoleTailoredRecommendations("Software Engineer").resources;
