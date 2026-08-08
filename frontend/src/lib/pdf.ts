// frontend/src/lib/pdf.ts
import { parsePdfDocument } from "./ats/parsers/pdf-parser";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const parsed = await parsePdfDocument(buffer);
  return parsed.cleanedText;
}