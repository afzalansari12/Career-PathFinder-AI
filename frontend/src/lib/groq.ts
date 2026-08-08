// frontend/src/lib/groq.ts
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeResume(resumeText: string) {
  const prompt = `
You are an expert Executive Resume Reviewer and Senior Technical Recruiter.
Analyze the following resume text rigorously and return a strict, JSON-only output with no Markdown formatting or surrounding text.

Evaluation Criteria:
1. Overall Score (0-100): Weighted calculation across Content Impact (30%), Technical/Core Skills (30%), Structure & Formatting (20%), and ATS Readability (20%).
2. Summary: A 2-sentence executive summary of the candidate's core domain, strengths, and primary career level.
3. Extracted Skills: Break down into Hard/Technical Skills and Soft/Transferable Skills.
4. ATS Strengths: List 3-4 distinct strengths of this resume.
5. Critical Improvements: List 3-4 specific, actionable improvements (e.g., missing metrics, formatting issues, weak action verbs).
6. Missing Key Sections: Identify missing sections (e.g., Projects, Certifications, Contact Info, Summary).

Resume Text:
"""
${resumeText}
"""

Return JSON matching this EXACT structure:
{
  "score": 85,
  "summary": "Strong Software Engineer with hands-on expertise in full-stack development and cloud systems.",
  "skills": {
    "technical": ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "C++", "Python"],
    "soft": ["Problem Solving", "Collaboration", "Analytical Thinking"]
  },
  "strengths": [
    "Clean project descriptions highlighting technical tech stack",
    "Solid technical keyword density across modern frameworks",
    "Clear educational history and background"
  ],
  "improvements": [
    "Quantify achievements using concrete impact metrics (e.g., improved load speed by 30%)",
    "Ensure action verbs start every bullet point in experience/projects",
    "Add a dedicated LinkedIn/GitHub profile link at the top"
  ],
  "missingSections": ["Certifications"]
}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a professional ATS parser and resume reviewer. Always output valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const rawContent = response.choices[0]?.message?.content || "{}";
    return JSON.parse(rawContent);
  } catch (error) {
    console.error("Groq Resume Analyzer Error:", error);
    return {
      score: 70,
      summary: "Resume processed, but detailed AI parsing encountered a runtime issue.",
      skills: { technical: [], soft: [] },
      strengths: ["Text content successfully extracted from PDF"],
      improvements: ["Re-upload resume for updated AI breakdown"],
      missingSections: [],
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