// frontend/src/app/api/jobs/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "Full Stack Engineer";

  try {
    if (!process.env.GROQ_API_KEY) {
      // Immediate fallback if Groq API key is missing
      return NextResponse.json({
        jobs: [
          {
            id: "1",
            title: `Senior ${role}`,
            company: "Google / Tech",
            location: "Bengaluru, India (Hybrid)",
            salary: "₹28L - ₹42L/yr",
            description: `We are searching for a high-performing ${role} to design distributed backend services, optimize React client performance, and scale cloud infrastructure.`,
            applyUrl: "https://careers.google.com",
            matchScore: 95,
            postedDate: "1 day ago",
          },
          {
            id: "2",
            title: `${role} - Platform Architecture`,
            company: "Uber",
            location: "Gurugram, India",
            salary: "₹22L - ₹35L/yr",
            description: `Build low-latency APIs, optimize database queries using PostgreSQL & Redis, and collaborate on system design for core mobility applications.`,
            applyUrl: "https://www.uber.com/careers",
            matchScore: 90,
            postedDate: "3 days ago",
          },
          {
            id: "3",
            title: `Junior ${role}`,
            company: "Razorpay",
            location: "Bengaluru, India",
            salary: "₹16L - ₹24L/yr",
            description: `Implement secure payment workflows, streamline frontend state management, and write unit/integration test suites.`,
            applyUrl: "https://razorpay.com/jobs",
            matchScore: 88,
            postedDate: "Just now",
          },
        ],
      });
    }

    const prompt = `Generate 4 realistic, current job opening listings for the target position "${role}" in top tier tech companies located in India/Remote.
Return strictly valid JSON matching this exact structure:
{
  "jobs": [
    {
      "id": "1",
      "title": "Exact Role Title",
      "company": "Company Name",
      "location": "City, Country or Remote",
      "salary": "₹XX - ₹YY/yr",
      "description": "Detailed 2-sentence breakdown of responsibilities and required stack.",
      "applyUrl": "https://company.com/careers",
      "matchScore": 92,
      "postedDate": "1 day ago"
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
  } catch (error) {
    console.error("Job Search API Error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}