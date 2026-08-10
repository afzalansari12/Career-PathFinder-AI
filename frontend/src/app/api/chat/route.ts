// frontend/src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message || "";

    if (!message) {
      return NextResponse.json({ reply: "Please enter a question or topic." });
    }

    const q = message.toLowerCase();
    let reply = "I am PathFinder AI. Ask me for interview practice questions, ATS resume optimizations, or career roadmaps!";

    if (q.includes("question") || q.includes("interview") || q.includes("give") || q.includes("fullstack")) {
      const interviewQuestions = [
        "**Technical Question**: How do you handle database connection pooling and scale serverless API routes in Next.js App Router?",
        "**System Design**: How would you design a rate limiter for an API endpoint handling 100,000 requests/sec using Redis sliding window algorithms?",
        "**React/Next.js**: What is the structural difference between React Server Components (RSC) and Client Components regarding bundle payload?",
      ];
      reply = interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)];
    } else if (q.includes("ats") || q.includes("resume")) {
      reply = "To raise your ATS score above 85%: 1) Quantify impact with numbers (e.g., 'Reduced API latency by 35%'), 2) Align target keywords directly with job descriptions, and 3) Use clean single-column Markdown layouts.";
    } else if (q.includes("job") || q.includes("apply")) {
      reply = "Navigate to the Jobs tab to see active positions filtered directly by your target engineering roles.";
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ reply: "An error occurred while generating a response." }, { status: 500 });
  }
}