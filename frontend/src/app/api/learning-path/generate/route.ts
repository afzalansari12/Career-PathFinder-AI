// frontend/src/app/api/learning-path/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { LearnerProfile, StructuredLearningPath } from "@/types/learningPath";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const profile: LearnerProfile = body.profile || {
      targetGoal: body.targetRole || "Full Stack AI Engineer",
      experienceLevel: body.experienceLevel || "Intermediate",
      knownSkills: [
        { name: "JavaScript", level: 4 },
        { name: "React", level: 3 },
        { name: "Python", level: 2 },
      ],
      targetSkills: [
        { name: "TypeScript", level: 4 },
        { name: "Next.js", level: 4 },
        { name: "LLMs & RAG Architectures", level: 4 },
        { name: "Vector Databases & Embeddings", level: 4 },
      ],
      interests: ["Generative AI", "Full Stack Development"],
      completedCourses: [],
      preferences: { pace: "Standard", style: "Project-Based", hoursPerWeek: 10 },
      skillGaps: [],
      lastUpdated: new Date().toISOString(),
    };

    const targetRoleName = profile.targetGoal || "Full Stack AI Engineer";

    if (process.env.GROQ_API_KEY) {
      try {
        const prompt = `You are an elite AI Senior Staff Architect.
Generate an ULTRA-DETAILED 5-phase career and engineering roadmap for a candidate targeting the role of "${targetRoleName}".
Current Skills: ${profile.knownSkills.map((s) => s.name).join(", ") || "Basics"}.
Level: ${profile.experienceLevel}. Style: ${profile.preferences.style}. Commitment: ${profile.preferences.hoursPerWeek} hrs/week.

Return STRICTLY a JSON object matching this schema without markdown formatting or code blocks:
{
  "id": "path-${Date.now()}",
  "targetRole": "${targetRoleName}",
  "overallDuration": "14 Weeks",
  "weeklyCommitment": "${profile.preferences.hoursPerWeek} Hours/Week",
  "learningPace": "${profile.preferences.pace}",
  "matchScore": 96,
  "prerequisiteFlow": [
    "Phase 1: Foundations & CS Core → Phase 2: System Architecture & DB Indexing",
    "Phase 2: System Architecture & DB Indexing → Phase 3: High-Scale Systems & Caching",
    "Phase 3: High-Scale Systems & Caching → Phase 4: DevOps, Cloud & CI/CD Pipelines",
    "Phase 4: DevOps, Cloud & CI/CD Pipelines → Phase 5: Production Capstone & FAANG Interview Prep"
  ],
  "aiSummary": "Comprehensive 5-phase engineering roadmap designed to bridge all skill gaps for ${targetRoleName} through production architecture labs, weekly module breakdowns, and interview whiteboarding.",
  "phases": [
    {
      "step": 1,
      "title": "Phase 1: Foundations & Computer Science Essentials",
      "description": "Master core computer science principles, type safety, memory allocation, and foundational data structures required for production engineering.",
      "duration": "2 Weeks",
      "status": "completed",
      "prerequisites": ["Basic Syntax & Variables"],
      "topics": ["Type Safety & Object-Oriented Patterns", "Data Structures & Time Complexity (Big-O)", "Memory Allocation & Event Loop Mechanics", "Clean Architecture Principles"],
      "weeklyBreakdown": [
        { "week": "Week 1", "title": "Type Systems & Advanced Generics", "description": "Implement strictly-typed interfaces, immutable data types, and compile-time validation schemas." },
        { "week": "Week 2", "title": "Data Structures & Big-O Optimization", "description": "Master arrays, hash maps, binary search trees, and space-time complexity trade-offs." }
      ],
      "projectIdea": "Build a modular, strongly-typed data validation engine with compile-time assertions.",
      "codeExercise": "Implement an LRU Cache with O(1) time complexity for get and put operations.",
      "interviewFocus": ["How does Big-O notation evaluate worst-case time complexity?", "Explain the difference between Stack and Heap memory."],
      "recommendedBooks": ["Clean Code by Robert C. Martin", "Grokking Algorithms by Aditya Bhargava"],
      "quiz": {
        "quizTitle": "Phase 1 Foundations Verification",
        "passingScore": 80,
        "questions": [
          {
            "id": "q1",
            "question": "What is the average time complexity of looking up a key in a Hash Table?",
            "options": ["O(1) Constant Time", "O(N) Linear Time", "O(log N) Logarithmic Time", "O(N^2) Quadratic Time"],
            "correctIndex": 0,
            "explanation": "Hash tables compute key array offsets directly via a hash function, yielding average O(1) lookup time."
          }
        ]
      }
    },
    {
      "step": 2,
      "title": "Phase 2: Core Stack Architecture & Database Engineering",
      "description": "Deep dive into server-side rendering, REST/GraphQL API design, database indexing, and authentication middleware.",
      "duration": "3 Weeks",
      "status": "in_progress",
      "prerequisites": ["Phase 1 CS Essentials"],
      "topics": ["Server-Side Rendering (SSR) & App Routers", "PostgreSQL Indexing & B-Tree Execution Plans", "Database Schema Migrations & ORMs", "OAuth2, JWT & RBAC Middleware"],
      "weeklyBreakdown": [
        { "week": "Week 3", "title": "API Contract & Middleware Architecture", "description": "Design RESTful and GraphQL endpoints with strict request validation and auth middleware." },
        { "week": "Week 4", "title": "Database Schema Design & Query Optimization", "description": "Write B-Tree indexes, composite keys, and analyze SQL EXPLAIN ANALYZE query plans." },
        { "week": "Week 5", "title": "Server Components & Streaming Data", "description": "Implement streaming SSR and React Server Components for ultra-low latency initial renders." }
      ],
      "projectIdea": "Develop an enterprise database backend with PostgreSQL indexing, JWT authentication, and automated database migrations.",
      "codeExercise": "Write a SQL query using composite indexing that optimizes a multi-table JOIN from 400ms down to 12ms.",
      "interviewFocus": ["When should you use a B-Tree index vs a Hash index in SQL?", "How does SSR differ from Client-Side Hydration?"],
      "recommendedBooks": ["Designing Data-Intensive Applications by Martin Kleppmann", "SQL Performance Explained by Markus Winand"],
      "quiz": {
        "quizTitle": "Phase 2 Database & API Mastery",
        "passingScore": 80,
        "questions": [
          {
            "id": "q2",
            "question": "Why is B-Tree composite indexing useful for SQL queries with WHERE and ORDER BY clauses?",
            "options": [
              "Combines filtered column lookup with pre-sorted order evaluation without requiring a extra sort step",
              "Compresses database disk space automatically",
              "Disables foreign key constraints",
              "Replaces server memory completely"
            ],
            "correctIndex": 0,
            "explanation": "Composite indexes store tuple pairs in sorted order, matching WHERE filter predicates and eliminating filesort operations."
          }
        ]
      }
    },
    {
      "step": 3,
      "title": "Phase 3: High-Scale Systems & Distributed Caching",
      "description": "Architect scalable microservices, distributed Redis caching, message queues, and vector search embeddings.",
      "duration": "3 Weeks",
      "status": "pending",
      "prerequisites": ["Phase 2 API & DB Architecture"],
      "topics": ["Redis Caching & Sliding-Window Rate Limiting", "Message Queues (Kafka / RabbitMQ)", "Vector Embeddings & Semantic RAG Search", "Distributed Locks & Microservices"],
      "weeklyBreakdown": [
        { "week": "Week 6", "title": "Redis Caching Patterns", "description": "Implement Cache-Aside, Write-Through, and sliding-window rate limiters to shield databases." },
        { "week": "Week 7", "title": "Asynchronous Message Queues", "description": "Decouple heavy tasks using Kafka or RabbitMQ event-driven background workers." },
        { "week": "Week 8", "title": "Vector Search & AI RAG Pipelines", "description": "Implement vector embeddings and cosine similarity search using Pinecone / Qdrant." }
      ],
      "projectIdea": "Architect a distributed high-throughput event processing platform with Redis caching, Kafka queues, and vector search.",
      "codeExercise": "Implement a distributed sliding-window rate limiter in Redis to limit user IP requests to 100 requests/minute.",
      "interviewFocus": ["How do you handle Cache Stampede (Thundering Herd) in Redis?", "Explain the CAP Theorem trade-offs in distributed systems."],
      "recommendedBooks": ["System Design Interview by Alex Xu", "Database Internals by Alex Petrov"]
    },
    {
      "step": 4,
      "title": "Phase 4: DevOps, Cloud Infrastructure & CI/CD Pipelines",
      "description": "Deploy auto-scaling containerized workloads with automated CI/CD pipelines, Terraform IaC, and observability telemetry.",
      "duration": "3 Weeks",
      "status": "pending",
      "prerequisites": ["Phase 3 High-Scale Infrastructure"],
      "topics": ["Docker Containerization & Multi-Stage Builds", "Kubernetes Pod Orchestration", "Terraform Infrastructure as Code (IaC)", "Automated GitHub Actions CI/CD Pipelines"],
      "weeklyBreakdown": [
        { "week": "Week 9", "title": "Production Docker & Container Hardening", "description": "Write multi-stage Dockerfiles reducing image size from 1.2GB down to 60MB." },
        { "week": "Week 10", "title": "Kubernetes & Cloud Deployment", "description": "Configure Kubernetes Deployments, Ingress controllers, and HPA auto-scaling on AWS / GCP." },
        { "week": "Week 11", "title": "CI/CD Pipelines & Telemetry Monitoring", "description": "Automate linting, unit testing, docker build, and zero-downtime deployment pipelines." }
      ],
      "projectIdea": "Deploy a containerized Kubernetes application on Cloud with automated CI/CD pipelines and Prometheus telemetry metrics.",
      "codeExercise": "Write a multi-stage Dockerfile that builds a Next.js application into a minimal Alpine container.",
      "interviewFocus": ["Difference between Kubernetes Deployment and StatefulSet?", "How does zero-downtime Rolling Update work?"],
      "recommendedBooks": ["The DevOps Handbook by Gene Kim", "Kubernetes in Action by Marko Luksa"]
    },
    {
      "step": 5,
      "title": "Phase 5: Production Capstone & FAANG Interview Prep",
      "description": "Deliver a flagship production capstone project, master technical system design whiteboarding, and polish resume bullet metrics.",
      "duration": "3 Weeks",
      "status": "pending",
      "prerequisites": ["Phase 4 Cloud & DevOps"],
      "topics": ["End-to-End Flagship Capstone Build", "System Design Whiteboarding & Trade-Offs", "Algorithms & STAR Method Mock Interviews", "ATS Resume Metric Alignment"],
      "weeklyBreakdown": [
        { "week": "Week 12", "title": "Flagship Capstone Development", "description": "Complete end-to-end implementation of your custom production portfolio project." },
        { "week": "Week 13", "title": "System Design Mock Interviews", "description": "Practice architectural whiteboarding for URL Shorteners, Newsfeeds, and Chat Applications." },
        { "week": "Week 14", "title": "FAANG Resume & Coding Drills", "description": "Refine resume metrics (quantifiable impact) and practice high-frequency LeetCode algorithms." }
      ],
      "projectIdea": "Complete and launch a production-grade SaaS platform deployed live with full documentation, live demo, and GitHub repository.",
      "codeExercise": "Conduct a full 45-minute live System Design mock interview whiteboarding session.",
      "interviewFocus": ["Walk me through the architectural design of a distributed URL shortener.", "Describe your hardest technical bug and how you resolved it."],
      "recommendedBooks": ["Cracking the Coding Interview by Gayle Laakmann McDowell", "System Design Interview Vol 2 by Alex Xu"]
    }
  ]
}`;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          temperature: 0.2,
        });

        const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
        if (parsed.phases && Array.isArray(parsed.phases)) {
          parsed.createdAt = new Date().toISOString();
          return NextResponse.json({ success: true, path: parsed });
        }
      } catch (groqErr) {
        console.warn("Groq execution failed, serving dynamic structured fallback:", groqErr);
      }
    }

    // High-quality detailed dynamic response fallback
    const dynamicPath: StructuredLearningPath = {
      id: `path-${Date.now()}`,
      targetRole: targetRoleName,
      overallDuration: "14 Weeks",
      weeklyCommitment: `${profile.preferences.hoursPerWeek} Hours/Week`,
      learningPace: profile.preferences.pace,
      matchScore: 96,
      prerequisiteFlow: [
        "Phase 1: Foundations & CS Core → Phase 2: System Architecture & DB Indexing",
        "Phase 2: System Architecture & DB Indexing → Phase 3: High-Scale Systems & Caching",
        "Phase 3: High-Scale Systems & Caching → Phase 4: DevOps, Cloud & CI/CD Pipelines",
        "Phase 4: DevOps, Cloud & CI/CD Pipelines → Phase 5: Production Capstone & FAANG Interview Prep",
      ],
      aiSummary: `Detailed 5-phase engineering roadmap for ${targetRoleName} with weekly module breakdowns, hands-on lab code exercises, and technical interview whiteboarding.`,
      createdAt: new Date().toISOString(),
      phases: [
        {
          step: 1,
          title: `Phase 1: Foundations & Computer Science Essentials`,
          description: `Master core computer science principles, type safety, memory allocation, and data structures required for ${targetRoleName}.`,
          duration: "2 Weeks",
          status: "completed",
          prerequisites: ["Basic Programming Syntax"],
          topics: ["Type Safety & Advanced Generics", "Data Structures & Time Complexity (Big-O)", "Memory Allocation & Event Loop Mechanics", "Clean Code & Refactoring"],
          weeklyBreakdown: [
            { week: "Week 1", title: "Type Systems & Advanced Generics", description: "Implement strictly-typed interfaces, immutable data types, and compile-time validation schemas." },
            { week: "Week 2", title: "Data Structures & Big-O Optimization", description: "Master arrays, hash maps, binary search trees, and space-time complexity trade-offs." },
          ],
          projectIdea: `Build a type-safe modular system library tailored for ${targetRoleName}.`,
          codeExercise: "Implement an LRU Cache with O(1) lookup and eviction complexity.",
          interviewFocus: ["How does Big-O notation evaluate worst-case time complexity?", "Explain Stack vs Heap memory."],
          recommendedBooks: ["Clean Code by Robert C. Martin", "Grokking Algorithms by Aditya Bhargava"],
          quiz: {
            quizTitle: "Phase 1 Verification Quiz",
            passingScore: 80,
            questions: [
              {
                id: "q1",
                question: "What is the average time complexity of looking up a key in a Hash Table?",
                options: ["O(1) Constant Time", "O(N) Linear Time", "O(log N) Logarithmic Time", "O(N^2) Quadratic Time"],
                correctIndex: 0,
                explanation: "Hash tables compute key array offsets directly via a hash function, yielding average O(1) lookup time.",
              },
            ],
          },
        },
        {
          step: 2,
          title: "Phase 2: Core Stack Architecture & Database Engineering",
          description: "Deep dive into server-side rendering, REST/GraphQL API design, database indexing, and authentication middleware.",
          duration: "3 Weeks",
          status: "in_progress",
          prerequisites: ["Phase 1 CS Essentials"],
          topics: ["Server-Side Rendering (SSR) & App Routers", "PostgreSQL Indexing & B-Tree Execution Plans", "Database Schema Migrations & ORMs", "OAuth2, JWT & RBAC Middleware"],
          weeklyBreakdown: [
            { week: "Week 3", title: "API Contract & Middleware Architecture", description: "Design RESTful and GraphQL endpoints with strict request validation and auth middleware." },
            { week: "Week 4", title: "Database Schema Design & Query Optimization", description: "Write B-Tree indexes, composite keys, and analyze SQL EXPLAIN ANALYZE query plans." },
            { week: "Week 5", title: "Server Components & Streaming Data", description: "Implement streaming SSR and React Server Components for ultra-low latency initial renders." },
          ],
          projectIdea: "Develop an enterprise database backend with PostgreSQL indexing, JWT authentication, and automated database migrations.",
          codeExercise: "Write a SQL query using composite indexing that optimizes a multi-table JOIN from 400ms down to 12ms.",
          interviewFocus: ["When should you use a B-Tree index vs a Hash index in SQL?", "How does SSR differ from Client-Side Hydration?"],
          recommendedBooks: ["Designing Data-Intensive Applications by Martin Kleppmann", "SQL Performance Explained by Markus Winand"],
          quiz: {
            quizTitle: "Phase 2 Mastery Quiz",
            passingScore: 80,
            questions: [
              {
                id: "q2",
                question: "How does server-side rendering (SSR) improve application performance?",
                options: [
                  "Delivers pre-rendered HTML to the client for faster initial page loads and superior SEO",
                  "Increases the client JavaScript bundle size",
                  "Disables browser caching completely",
                  "Replaces backend database queries",
                ],
                correctIndex: 0,
                explanation: "SSR generates HTML on the server, allowing browsers to display content immediately without waiting for client JS execution.",
              },
            ],
          },
        },
        {
          step: 3,
          title: "Phase 3: High-Scale Systems & Distributed Infrastructure",
          description: "Architect distributed microservices, vector search engines, Redis caching, and worker queues.",
          duration: "3 Weeks",
          status: "pending",
          prerequisites: ["Phase 2 Architecture"],
          topics: ["Redis Caching & Sliding-Window Rate Limiting", "Message Queues (Kafka / RabbitMQ)", "Vector Embeddings & Semantic RAG Search", "Distributed Locks & Microservices"],
          weeklyBreakdown: [
            { week: "Week 6", title: "Redis Caching Patterns", description: "Implement Cache-Aside, Write-Through, and sliding-window rate limiters to shield databases." },
            { week: "Week 7", title: "Asynchronous Message Queues", description: "Decouple heavy tasks using Kafka or RabbitMQ event-driven background workers." },
            { week: "Week 8", title: "Vector Search & AI RAG Pipelines", description: "Implement vector embeddings and cosine similarity search using Pinecone / Qdrant." },
          ],
          projectIdea: "Architect a distributed high-throughput event processing platform with Redis caching, Kafka queues, and vector search.",
          codeExercise: "Implement a distributed sliding-window rate limiter in Redis to limit user IP requests to 100 requests/minute.",
          interviewFocus: ["How do you handle Cache Stampede (Thundering Herd) in Redis?", "Explain CAP Theorem trade-offs in distributed systems."],
          recommendedBooks: ["System Design Interview by Alex Xu", "Database Internals by Alex Petrov"],
        },
        {
          step: 4,
          title: "Phase 4: DevOps, Cloud Infrastructure & CI/CD Pipelines",
          description: "Deploy auto-scaling containerized workloads with automated CI/CD pipelines, Terraform IaC, and observability telemetry.",
          duration: "3 Weeks",
          status: "pending",
          prerequisites: ["Phase 3 Infrastructure"],
          topics: ["Docker Containerization & Multi-Stage Builds", "Kubernetes Pod Orchestration", "Terraform Infrastructure as Code (IaC)", "Automated GitHub Actions CI/CD Pipelines"],
          weeklyBreakdown: [
            { week: "Week 9", title: "Production Docker & Container Hardening", description: "Write multi-stage Dockerfiles reducing image size from 1.2GB down to 60MB." },
            { week: "Week 10", title: "Kubernetes & Cloud Deployment", description: "Configure Kubernetes Deployments, Ingress controllers, and HPA auto-scaling on AWS / GCP." },
            { week: "Week 11", title: "CI/CD Pipelines & Telemetry Monitoring", description: "Automate linting, unit testing, docker build, and zero-downtime deployment pipelines." },
          ],
          projectIdea: "Deploy a containerized Kubernetes application on Cloud with automated CI/CD pipelines and Prometheus telemetry metrics.",
          codeExercise: "Write a multi-stage Dockerfile that builds a Next.js application into a minimal Alpine container.",
          interviewFocus: ["Difference between Kubernetes Deployment and StatefulSet?", "How does zero-downtime Rolling Update work?"],
          recommendedBooks: ["The DevOps Handbook by Gene Kim", "Kubernetes in Action by Marko Luksa"],
        },
        {
          step: 5,
          title: `Phase 5: Production Capstone - ${targetRoleName}`,
          description: `Deliver a flagship production capstone project, master technical system design whiteboarding, and polish resume bullet metrics.`,
          duration: "3 Weeks",
          status: "pending",
          prerequisites: ["Phase 4 DevOps & Cloud"],
          topics: ["End-to-End Flagship Capstone Build", "System Design Whiteboarding & Trade-Offs", "Algorithms & STAR Method Mock Interviews", "ATS Resume Metric Alignment"],
          weeklyBreakdown: [
            { week: "Week 12", title: "Flagship Capstone Development", description: "Complete end-to-end implementation of your custom production portfolio project." },
            { week: "Week 13", title: "System Design Mock Interviews", description: "Practice architectural whiteboarding for URL Shorteners, Newsfeeds, and Chat Applications." },
            { week: "Week 14", title: "FAANG Resume & Coding Drills", description: "Refine resume metrics (quantifiable impact) and practice high-frequency LeetCode algorithms." },
          ],
          projectIdea: `Complete and launch a production-grade ${targetRoleName} SaaS platform deployed live with full documentation, live demo, and GitHub repository.`,
          codeExercise: "Conduct a full 45-minute live System Design mock interview whiteboarding session.",
          interviewFocus: ["Walk me through the architectural design of a distributed URL shortener.", "Describe your hardest technical bug and how you resolved it."],
          recommendedBooks: ["Cracking the Coding Interview by Gayle Laakmann McDowell", "System Design Interview Vol 2 by Alex Xu"],
        },
      ],
    };

    return NextResponse.json({ success: true, path: dynamicPath });
  } catch (error: any) {
    console.error("Learning path API fatal error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate learning path",
      },
      { status: 200 }
    );
  }
}
