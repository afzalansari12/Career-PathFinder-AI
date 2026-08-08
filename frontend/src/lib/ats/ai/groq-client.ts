import Groq from 'groq-sdk';
import { GroqExtractionSchema, ExtractedResumeData } from './schemas';
import { EXTRACTION_SYSTEM_PROMPT } from './prompts';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function extractResumeWithGroq(rawText: string): Promise<ExtractedResumeData> {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
      { role: 'user', content: `Extract the following resume:\n\n${rawText}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Groq engine returned empty payload.');

  return GroqExtractionSchema.parse(JSON.parse(content));
}