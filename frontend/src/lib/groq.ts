// frontend/src/lib/groq.ts
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

import type { ATSEvaluationResult } from "./ats/engine";

export interface ResumeFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
}

/**
 * IMPORTANT: this does NOT calculate a score. `evaluation` was already
 * computed by DeterministicATSEngine.evaluate() before this is ever called.
 * The model only turns that finished, rule-based result into plain-English
 * narrative — there's no field in the schema below for it to write a score
 * into, and the prompt explicitly forbids inventing one.
 */
export async function generateResumeFeedback(
  evaluation: ATSEvaluationResult,
  targetRole: string = "Software Engineer"
): Promise<ResumeFeedback> {
  const prompt = `
You are an expert Executive Resume Reviewer and Senior Technical Recruiter.

You are given a DETERMINISTIC ATS analysis below, already computed by a rules
engine. Do not recalculate, restate, or contradict the score. Your only job
is to turn this structured data into clear, specific, human feedback for a
candidate targeting: ${targetRole}.

Overall Score: ${evaluation.overallScore}/100
Structure: ${evaluation.breakdown.structureScore}/100
Keywords: ${evaluation.breakdown.keywordScore}/100
Impact: ${evaluation.breakdown.impactScore}/100
Formatting: ${evaluation.breakdown.formattingScore}/100

Detected skills: ${evaluation.detectedSkills.join(", ") || "none"}
Missing high-value skills: ${evaluation.missingSkills.join(", ") || "none"}

Issues found:
${evaluation.deductions.map((d) => `- [${d.category}] ${d.issue} (Suggestion: ${d.recommendation})`).join("\n") || "None"}

Metrics: ${evaluation.metrics.totalWords} words, ${evaluation.metrics.bulletCount} bullets, ${evaluation.metrics.actionVerbCount} strong action verbs, ${evaluation.metrics.quantifiableMetricsCount} bullets with quantified metrics.

Return JSON matching this EXACT structure, no markdown, no triple backticks:
{
  "summary": "2-3 sentence plain-English overview grounded in the numbers above",
  "strengths": ["3-4 specific strengths, each referencing something from the data above"],
  "improvements": ["4-6 specific, actionable improvements, ordered by impact, each grounded in a deduction or gap above"]
}

Rules:
- Do not invent a score or any number not already provided above.
- Every point must trace back to the evaluation data, not generic resume advice.
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a resume feedback writer. You never calculate scores yourself — you only explain a score you're given. Always output valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const rawContent = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(rawContent);
    return {
      summary: parsed.summary ?? "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    };
  } catch (error) {
    console.error("Groq Resume Feedback Error:", error);
    return {
      summary:
        "Your ATS score and category breakdown were calculated successfully. AI-generated narrative feedback couldn't be produced this time — please retry.",
      strengths: [],
      improvements: ["Re-run the analysis to get detailed AI feedback."],
    };
  }
}

export async function generateRoadmap(analysisOrSkills: unknown, targetRole?: string) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a career advisor. Return JSON matching this exact structure:
{
  "careerGoal": "Full Stack Software Engineer",
  "estimatedTime": "3-6 months",
  "steps": ["Master TypeScript", "Build Next.js APIs", "Deploy System Architecture"]
}`,
        },
        {
          role: "user",
          content: `Target Role: ${targetRole || "Software Developer"}. Resume Data: ${JSON.stringify(analysisOrSkills)}`,
        },
      ],
    });
    return response.choices[0]?.message?.content || "{}";
  } catch (error) {
    console.error("Generate Roadmap Error:", error);
    return JSON.stringify({
      careerGoal: "Software Developer",
      estimatedTime: "3-6 months",
      steps: ["Learn Core Computer Science", "Build Full Stack Projects", "Prepare System Design"],
    });
  }
}

export async function generateJobs(skills: string[]) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Recommend jobs based on input skills. Return JSON in this format:
{
  "recommendedJobs": ["Frontend Developer", "Next.js Engineer", "Full Stack Developer"]
}`,
        },
        {
          role: "user",
          content: `Skills: ${Array.isArray(skills) ? skills.join(", ") : JSON.stringify(skills)}`,
        },
      ],
    });
    return response.choices[0]?.message?.content || "{}";
  } catch (error) {
    console.error("Generate Jobs Error:", error);
    return JSON.stringify({ recommendedJobs: ["Software Engineer", "Full Stack Developer"] });
  }
}

// Inside frontend/src/lib/groq.ts
export async function generateInterview(role: string) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert technical interviewer. Generate exactly ONE concise technical question for the candidate's target role.
Return JSON matching this exact structure:
{
  "question": "How would you optimize a slow database query involving a 1 million row join in PostgreSQL?"
}`,
        },
        { role: "user", content: `Target Role: ${role || "Full Stack Software Engineer"}` },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    return parsed.question || "How do you handle client-side vs server-side rendering trade-offs in Next.js?";
  } catch (error) {
    console.error("Generate Interview Error:", error);
    return "How do you handle client-side vs server-side rendering trade-offs in Next.js?";
  }
}

// Inside frontend/src/lib/groq.ts

// frontend/src/lib/groq.ts

export async function evaluateInterview(question: string, answer: string) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert, strict Senior Technical Interviewer evaluating a candidate's response.

CRITICAL SCORING RULE:
You MUST evaluate how directly and accurately the "Candidate Answer" answers the SPECIFIC "Interview Question" provided. Do NOT award high points to accurate text that is irrelevant or off-topic for the question asked.

Evaluation Rubric:
1. Question Relevance (40 points): Does the answer directly address the core topic of the specific question? If the answer is off-topic, generic boilerplate, or answers a different question, cap the total score below 30.
2. Technical Accuracy (30 points): Are the technical details, protocols, and architectural concepts correct for this question?
3. Depth & Completeness (20 points): Does it address scale, performance, edge cases, or trade-offs specific to the prompt?
4. Clarity (10 points): Is the answer well-structured and easy to follow?

Return JSON matching this exact structure:
{
  "score": 85,
  "feedback": "Concise feedback explaining why this score was awarded relative to the question asked."
}`,
        },
        {
          role: "user",
          content: `Interview Question: "${question}"\nCandidate Answer: "${answer}"`,
        },
      ],
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error("Evaluate Interview Error:", error);
    return {
      score: 50,
      feedback: "Failed to evaluate response context. Please retry submitting your answer.",
    };
  }
}