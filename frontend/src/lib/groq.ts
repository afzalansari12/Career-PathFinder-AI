import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function analyzeResume(resumeText: string) {
  const prompt = `
  You are an expert AI career coach.
  
  Analyze the following resume.
  
  Return ONLY valid JSON.
  
  The JSON must exactly follow this schema:
  {
  "ats_score": 85,
  "summary": "...",
  "strengths": [
    "...",
    "..."
  ],
  "weaknesses": [
    "...",
    "..."
  ],
  "missing_skills": [
    "...",
    "..."
  ],
  "improvements": [
    "...",
    "..."
  ]
}
  
  Rules:
  - Return ONLY JSON.
  - Do not wrap the response in markdown.
  - Do not use triple backticks.
  - resume_score must be an integer from 0 to 100.
  - suggestions must contain at least 5 specific, actionable resume improvements.
  - strengths should contain 3-6 points.
  - weaknesses should contain 2-5 realistic points if applicable.
  - education, experience, and projects should be structured objects.
  - Keep the summary under 80 words.
  
  Resume:
  
  ${resumeText}
  `;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const text = response.choices[0].message.content ?? "{}";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return cleaned;
  } catch (err) {
    console.error("GROQ ERROR:", err);
    throw err;
  }
}


export async function generateRoadmap(analysis: any) {
  const prompt = `
You are an expert software engineering mentor.

Based on this resume analysis, generate a personalized learning roadmap.

Return ONLY valid JSON in this format:

{
  "title": "",
  "estimated_time": "",
  "career_goal": "",
  "weeks": [
    {
      "week": 1,
      "topics": [],
      "project": ""
    }
  ]
}

Resume Analysis:

${JSON.stringify(analysis)}
`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const text = response.choices[0].message.content ?? "{}";

  return text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();
}

export async function generateInterview(role: string) {
  const prompt = `
You are an expert software engineering interviewer.

Generate 10 interview questions for the following role.

Role:
${role}

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "",
      "difficulty": "Easy"
    }
  ]
}
`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const text = response.choices[0].message.content ?? "{}";

    return text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
  } catch (err) {
    console.error("GROQ ERROR:", err);
    throw err;
  }
}


export async function evaluateInterview(
  role: string,
  questions: any[],
  answers: string[]
) {
  const prompt = `
You are a senior software engineering interviewer.

Role:
${role}

Interview Questions:
${JSON.stringify(questions)}

Candidate Answers:
${JSON.stringify(answers)}

Evaluate the candidate.

Return ONLY valid JSON.

{
  "overall_score": 0,
  "communication": 0,
  "technical": 0,
  "problem_solving": 0,
  "strengths": [],
  "weaknesses": [],
  "feedback": ""
}
`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const text = response.choices[0].message.content ?? "{}";

    return text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
  } catch (err) {
    console.error(err);
    throw err;
  }
}


export async function generateJobs(analysis: any) {
  const prompt = `
You are an expert career advisor.

Based on this resume analysis:

${JSON.stringify(analysis)}

Recommend 8 software jobs.

Return ONLY valid JSON.

{
  "jobs":[
    {
      "title":"",
      "company_type":"",
      "salary":"",
      "reason":""
    }
  ]
}
`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const text = response.choices[0].message.content ?? "{}";

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}