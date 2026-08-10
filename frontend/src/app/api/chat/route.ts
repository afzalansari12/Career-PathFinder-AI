// frontend/src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are PathFinder Assistant, the in-app AI career coach for CareerPathFinder — a platform students use for resume/ATS optimization, interview prep, job search, and career roadmaps.

Answer whatever the user actually asks — interview questions (with model answers if asked), DSA/coding help, resume and ATS advice, career roadmap guidance, job search strategy, or general programming/CS questions. Give real, specific, directly useful answers, not generic filler.

Keep replies concise and chat-appropriate (a few short paragraphs or a tight list, not an essay) unless the user asks for something long-form like a full explanation or code. Use markdown (like **bold**, bullet points, or code blocks) where it helps readability.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = body?.message || "";
    const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];

    if (!message.trim()) {
      return NextResponse.json({ reply: "Please enter a question or topic." });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("Chat API error: GROQ_API_KEY is not set");
      return NextResponse.json(
        { reply: "AI is not configured on the server yet (missing GROQ_API_KEY). Please contact the site admin." },
        { status: 200 }
      );
    }

    // Keep the last few turns so the assistant has real conversational context,
    // without sending an unbounded amount of history on every request.
    const trimmedHistory = history.slice(-10);

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...trimmedHistory.map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        })),
        { role: "user", content: message },
      ],
      temperature: 0.6,
      max_tokens: 800,
    });

    const reply =
      response.choices[0]?.message?.content?.trim() ||
      "I couldn't generate a response for that — could you rephrase your question?";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { reply: "Something went wrong generating a response. Please try again." },
      { status: 500 }
    );
  }
}