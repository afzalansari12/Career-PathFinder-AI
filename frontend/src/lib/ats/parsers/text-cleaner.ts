export function cleanExtractedText(rawText: string): string {
    return rawText
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
      .replace(/[^\x00-\x7F]/g, (char) => {
        // Map common smart quotes/dashes to standard ASCII
        const replacements: Record<string, string> = {
          '“': '"', '”': '"', '‘': "'", '’': "'", '–': '-', '—': '-'
        };
        return replacements[char] || char;
      })
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }