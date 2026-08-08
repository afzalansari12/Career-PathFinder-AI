import mammoth from 'mammoth';
import { ParsedResumeDocument } from '@/types/ats';
import { cleanExtractedText } from './text-cleaner';

export async function parseDocxDocument(buffer: Buffer): Promise<ParsedResumeDocument> {
  const result = await mammoth.extractRawText({ buffer });
  const cleaned = cleanExtractedText(result.value);

  return {
    rawText: result.value,
    cleanedText: cleaned,
    elements: [],
    pageCount: 1,
    hasTables: false,
    hasImages: false,
    detectedFonts: [],
    fileType: 'docx',
  };
}