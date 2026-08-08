// frontend/src/lib/ats/parsers/pdf-parser.ts
// @ts-ignore
import pdfParse from 'pdf-parse-fixed';
import { ParsedResumeDocument } from '@/types/ats';
import { cleanExtractedText } from './text-cleaner';

export async function parsePdfDocument(buffer: Buffer): Promise<ParsedResumeDocument> {
  const data = await pdfParse(buffer);
  const cleaned = cleanExtractedText(data?.text || '');

  return {
    rawText: data?.text || '',
    cleanedText: cleaned,
    elements: [],
    pageCount: data?.numpages || 1,
    hasTables: /\|.*\|/.test(cleaned),
    hasImages: false,
    detectedFonts: [],
    fileType: 'pdf',
  };
}