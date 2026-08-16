// frontend/src/lib/groq.ts
import Groq from "groq-sdk";
import type { ATSEvaluationResult } from "./ats/engine";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface ResumeFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
}

export async function generateResumeFeedback(
  evaluation: ATSEvaluationResult,
  jobDescription: string = ""
): Promise<ResumeFeedback> {
  const prompt = `
You are an expert Executive Resume Reviewer and Senior Technical Recruiter.

You are given a DETERMINISTIC ATS analysis computed by a rules engine for a candidate's resume compared directly against a specific TARGET JOB DESCRIPTION.
Do not recalculate or contradict the score. Your job is to explain the alignment and turn this structured data into actionable, recruiter-level feedback.

Target Job Description Context:
"${jobDescription || "Full Stack Software Engineer position requiring TypeScript, React, Next.js, System Design, and Database Optimization"}"

ATS Evaluation Metrics:
Overall JD Match Score: ${evaluation.overallScore}/100
Structure Score: ${evaluation.breakdown.structureScore}/100
Keyword Match Score: ${evaluation.breakdown.keywordScore}/100
Impact & Metrics Score: ${evaluation.breakdown.impactScore}/100
Formatting Score: ${evaluation.breakdown.formattingScore}/100

Matched JD Skills Found in Resume: ${evaluation.detectedSkills.join(", ") || "none"}
Critical Skills Missing from Resume Required by JD: ${evaluation.missingSkills.join(", ") || "none"}

Deductions & Issues Identified:
${evaluation.deductions.map((d) => `- [${d.category}] ${d.issue} (Suggestion: ${d.recommendation})`).join("\n") || "None"}

Resume Metrics: ${evaluation.metrics.totalWords} total words, ${evaluation.metrics.bulletCount} bullet points, ${evaluation.metrics.actionVerbCount} action verbs, ${evaluation.metrics.quantifiableMetricsCount} bullet points with quantified metrics.

Return JSON matching this EXACT structure, no markdown, no triple backticks:
{
  "summary": "2-3 sentence overview explaining how well this resume matches the target Job Description",
  "strengths": ["3-4 specific strengths directly aligned with the Job Description requirements"],
  "improvements": ["4-6 specific, actionable improvements telling the candidate how to rewrite bullet points to match the missing skills and qualifications in the Job Description"]
}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a Senior Technical Recruiter. You provide precise feedback comparing a resume against a target Job Description. Always output valid JSON.",
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
        "Your ATS score and Job Description skill alignment were calculated successfully. Detailed AI narrative feedback could not be produced this time — please retry.",
      strengths: [],
      improvements: ["Re-run the analysis to get detailed AI Job Description feedback."],
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

export async function evaluateInterview(question: string, answer: string) {
  const cleanAnswer = (answer || "").trim();

  // 1. Detect gibberish, keyboard smashes, or extremely low word counts
  const isGibberish =
    cleanAnswer.length < 15 ||
    /^[a-zA-Z0-9]{1,12}$/.test(cleanAnswer) ||
    /^[^a-zA-Z0-9\s]+$/.test(cleanAnswer) ||
    /^(ndnwdfh|asdf|qwerty|test|abc|xyz|12345|none|idk)$/i.test(cleanAnswer);

  if (isGibberish) {
    return {
      score: 12,
      feedback:
        "The response appears to be random text or gibberish. It does not address the technical interview question. Please provide a clear engineering explanation.",
    };
  }

  // 2. Query LLM for actual evaluation
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert, strict Senior Technical Interviewer scoring candidate answers.

STRICT SCORING RULES:
1. If candidate answer is off-topic, random words, or does not address the question, score MUST be between 0 and 20.
2. If candidate answer is vague, generic, or incomplete, score MUST be between 25 and 55.
3. If candidate answer correctly addresses architecture, performance, protocols, and trade-offs, score MUST be between 70 and 95.

Return JSON matching this exact structure:
{
  "score": 15,
  "feedback": "Concise feedback explaining why this score was awarded relative to the question asked."
}`,
        },
        {
          role: "user",
          content: `Interview Question: "${question}"\nCandidate Answer: "${cleanAnswer}"`,
        },
      ],
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    return {
      score: typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 15,
      feedback: parsed.feedback || "Answer evaluated relative to technical prompt.",
    };
  } catch (error) {
    console.error("Evaluate Interview Error:", error);
    return {
      score: 15,
      feedback: "Answer does not provide valid technical depth for evaluation. Please retry with a detailed explanation.",
    };
  }
}