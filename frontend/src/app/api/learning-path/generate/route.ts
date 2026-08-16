// frontend/src/app/api/learning-path/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { LearnerProfile, StructuredLearningPath } from "@/types/learningPath";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: LearnerProfile = body.profile || {
      targetGoal: body.targetRole || "Full Stack AI Engineer",
      experienceLevel: body.experienceLevel || "Intermediate",
      knownSkills: [{ name: body.knownStack || "JavaScript, React", level: 3 }],
      targetSkills: [],
      interests: [],
      completedCourses: [],
      preferences: { pace: "Standard", style: "Project-Based", hoursPerWeek: 10 },
      skillGaps: [],
      lastUpdated: new Date().toISOString(),
    };

    if (!process.env.GROQ_API_KEY) {
      // Intelligent default structured path
      const defaultPath: StructuredLearningPath = {
        id: `path-${Date.now()}`,
        targetRole: profile.targetGoal,
        overallDuration: "12 Weeks",
        weeklyCommitment: `${profile.preferences.hoursPerWeek} Hours/Week`,
        learningPace: profile.preferences.pace,
        matchScore: 94,
        prerequisiteFlow: [
          "Phase 1: Advanced Fundamentals → Phase 2: Core Stack Architecture",
          "Phase 2: Core Stack Architecture → Phase 3: Specialization & Scalability",
          "Phase 3: Specialization & Scalability → Phase 4: Production Deployment & Capstone",
        ],
        aiSummary: `Tailored 4-phase learning path generated for ${profile.targetGoal}. Formatted for ${profile.preferences.style} learning at ${profile.preferences.hoursPerWeek} hours/week.`,
        createdAt: new Date().toISOString(),
        phases: [
          {
            step: 1,
            title: "Advanced Fundamentals & Type Safety",
            description: `Bridge your initial skills (${profile.knownSkills.map((s) => s.name).join(", ")}) to advanced patterns needed for ${profile.targetGoal}.`,
            duration: "3 Weeks",
            status: "completed",
            prerequisites: ["Basic HTML/CSS & Modern JS"],
            topics: ["TypeScript Generics & Utility Types", "Event Loop Mechanics", "Production Code Quality"],
            projectIdea: "Build a type-safe event-driven state manager library from scratch.",
            quiz: {
              quizTitle: "Phase 1 Verification Quiz",
              passingScore: 80,
              questions: [
                {
                  id: "q1",
                  question: "What is the primary benefit of TypeScript generics?",
                  options: [
                    "Allows writing reusable, type-safe components without resorting to 'any'",
                    "Increases code runtime performance in V8 engine",
                    "Automatically minifies production bundles",
                    "Replaces standard CSS styles",
                  ],
                  correctIndex: 0,
                  explanation: "Generics allow developers to create reusable code that works with a variety of types while retaining compile-time type safety.",
                },
              ],
            },
          },
          {
            step: 2,
            title: "High-Throughput Full-Stack APIs & SSR",
            description: "Master modern server components, streaming rendering, and database integrations.",
            duration: "3 Weeks",
            status: "in_progress",
            prerequisites: ["Phase 1: Advanced Fundamentals"],
            topics: ["Next.js App Router & Server Actions", "PostgreSQL & Prisma Indexing", "Authentication Middleware"],
            projectIdea: "Develop a real-time collaborative workspace with RBAC and streaming SSR.",
            quiz: {
              quizTitle: "Phase 2 Mastery Quiz",
              passingScore: 80,
              questions: [
                {
                  id: "q2",
                  question: "How do React Server Components (RSC) differ from Client Components in Next.js?",
                  options: [
                    "RSCs execute exclusively on the server and send zero JS bundle to the client",
                    "RSCs execute inside the browser window",
                    "RSCs cannot fetch data from databases",
                    "Client components cannot handle onClick events",
                  ],
                  correctIndex: 0,
                  explanation: "Server components run only on the server side and do not increase the JavaScript client bundle size.",
                },
              ],
            },
          },
          {
            step: 3,
            title: "System Design, Microservices & RAG AI Integration",
            description: "Build scalable backend infrastructure, vector search engines, and background worker queues.",
            duration: "3 Weeks",
            status: "pending",
            prerequisites: ["Phase 2: High-Throughput Full-Stack APIs"],
            topics: ["Vector Databases (Pinecone/Qdrant)", "Redis Sliding-Window Rate Limiting", "Message Queues (Kafka/RabbitMQ)"],
            projectIdea: "Architect an enterprise AI RAG system with document embeddings and contextual retrieval.",
          },
          {
            step: 4,
            title: "Production CI/CD, Observability & Capstone",
            description: "Deploy fault-tolerant systems with automated testing, monitoring telemetry, and edge deployment.",
            duration: "3 Weeks",
            status: "pending",
            prerequisites: ["Phase 3: System Design & AI Integration"],
            topics: ["Docker Containerization", "GitHub Actions CI/CD", "Prometheus & Grafana Telemetry"],
            projectIdea: "Deploy an auto-scaling multi-region production web service with zero-downtime releases.",
          },
        ],
      };

      return NextResponse.json({ success: true, path: defaultPath });
    }

    const prompt = `You are a world-class AI Career & Learning Path Engine.
Create a highly structured, personalized learning path for a learner with the following profile:

Target Goal: "${profile.targetGoal}"
Experience Level: "${profile.experienceLevel}"
Known Skills: ${profile.knownSkills.map((s) => `${s.name} (L${s.level})`).join(", ")}
Target Skills: ${profile.targetSkills.map((s) => s.name).join(", ")}
Interests: ${profile.interests.join(", ")}
Learning Style: ${profile.preferences.style}
Pace: ${profile.preferences.pace}
Commitment: ${profile.preferences.hoursPerWeek} hours/week

Return ONLY a valid JSON object strictly matching this schema:
{
  "id": "path-ai-1",
  "targetRole": "${profile.targetGoal}",
  "overallDuration": "12 Weeks",
  "weeklyCommitment": "${profile.preferences.hoursPerWeek} Hours/Week",
  "learningPace": "${profile.preferences.pace}",
  "matchScore": 95,
  "prerequisiteFlow": [
    "Phase 1 → Phase 2",
    "Phase 2 → Phase 3",
    "Phase 3 → Phase 4"
  ],
  "aiSummary": "Executive narrative summary explaining how this path closes the candidate's exact skill gaps.",
  "phases": [
    {
      "step": 1,
      "title": "Phase Title",
      "description": "Specific action-oriented learning objective",
      "duration": "3 Weeks",
      "status": "completed",
      "prerequisites": ["Prerequisites for Phase 1"],
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "projectIdea": "Milestone portfolio project challenge description",
      "quiz": {
        "quizTitle": "Phase 1 Assessment",
        "passingScore": 80,
        "questions": [
          {
            "id": "q1",
            "question": "Multiple choice technical question testing Phase 1?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0,
            "explanation": "Detailed explanation of correct answer."
          }
        ]
      }
    },
    {
      "step": 2,
      "title": "Phase Title",
      "description": "Specific objective",
      "duration": "3 Weeks",
      "status": "in_progress",
      "prerequisites": ["Phase 1"],
      "topics": ["Topic A", "Topic B", "Topic C"],
      "projectIdea": "Milestone project challenge description"
    },
    {
      "step": 3,
      "title": "Phase Title",
      "description": "Specific objective",
      "duration": "3 Weeks",
      "status": "pending",
      "prerequisites": ["Phase 2"],
      "topics": ["Topic A", "Topic B", "Topic C"],
      "projectIdea": "Milestone project challenge description"
    },
    {
      "step": 4,
      "title": "Phase Title",
      "description": "Specific objective",
      "duration": "3 Weeks",
      "status": "pending",
      "prerequisites": ["Phase 3"],
      "topics": ["Topic A", "Topic B", "Topic C"],
      "projectIdea": "Capstone project description"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
    result.createdAt = new Date().toISOString();

    return NextResponse.json({ success: true, path: result });
  } catch (error: any) {
    console.error("Learning path generation error:", error);
    return NextResponse.json({ error: "Failed to generate path" }, { status: 500 });
  }
}
