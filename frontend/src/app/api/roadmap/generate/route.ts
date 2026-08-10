// frontend/src/app/api/roadmap/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });

export async function POST(req: NextRequest) {
  try {
    const { targetRole, knownStack } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      // Intelligent fallback if Groq API Key is not set in .env.local
      return NextResponse.json({
        milestones: [
          {
            step: 1,
            title: `Advanced ${targetRole} Core Concepts`,
            description: `Deep dive into production-grade patterns bridging your current stack (${knownStack}) to target competencies.`,
            status: "completed",
            duration: "2 Weeks",
          },
          {
            step: 2,
            title: "Database Architecture & Scalability",
            description: "Master PostgreSQL, Redis caching layers, and ORM query optimizations for high-throughput apps.",
            status: "in_progress",
            duration: "3 Weeks",
          },
          {
            step: 3,
            title: "System Design & Microservices Architecture",
            description: "Learn message queues (Kafka/RabbitMQ), load balancing, and containerized deployment with Docker & K8s.",
            status: "pending",
            duration: "4 Weeks",
          },
          {
            step: 4,
            title: "Production CI/CD & Cloud Infrastructure",
            description: "Deploy serverless and edge workloads on AWS/Vercel with automated test pipelines and telemetry monitoring.",
            status: "pending",
            duration: "2 Weeks",
          },
        ],
      });
    }

    const prompt = `You are an expert tech career advisor. Analyze the gap between a candidate's current known stack ("${knownStack}") and their target role ("${targetRole}").
Generate a structured 4-step progressive learning roadmap to bridge their skill gaps.

Return ONLY a valid JSON object matching this exact schema:
{
  "milestones": [
    {
      "step": 1,
      "title": "Short Clear Milestone Title",
      "description": "Specific action-oriented learning objective.",
      "status": "completed",
      "duration": "2 Weeks"
    },
    {
      "step": 2,
      "title": "Short Clear Milestone Title",
      "description": "Specific action-oriented learning objective.",
      "status": "in_progress",
      "duration": "3 Weeks"
    },
    {
      "step": 3,
      "title": "Short Clear Milestone Title",
      "description": "Specific action-oriented learning objective.",
      "status": "pending",
      "duration": "3 Weeks"
    },
    {
      "step": 4,
      "title": "Short Clear Milestone Title",
      "description": "Specific action-oriented learning objective.",
      "status": "pending",
      "duration": "2 Weeks"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}