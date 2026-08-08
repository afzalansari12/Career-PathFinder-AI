import { NextRequest, NextResponse } from 'next/server';
import { parsePdfDocument } from '@/lib/ats/parsers/pdf-parser';
import { parseDocxDocument } from '@/lib/ats/parsers/docx-parser';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let parsedDoc;
    if (file.name.endsWith('.pdf')) {
      parsedDoc = await parsePdfDocument(buffer);
    } else if (file.name.endsWith('.docx')) {
      parsedDoc = await parseDocxDocument(buffer);
    } else {
      return NextResponse.json({ error: 'Unsupported file extension' }, { status: 400 });
    }

    return NextResponse.json({ doc: parsedDoc }, { status: 200 });
  } catch (err) {
    console.error('Parsing error:', err);
    return NextResponse.json({ error: 'Failed to parse document stream' }, { status: 500 });
  }
}