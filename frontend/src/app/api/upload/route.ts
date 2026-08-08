// frontend/src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdf";
import { analyzeResume } from "@/lib/groq";
import { setLatestAnalysis } from "@/app/api/resume/route";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extract raw text from PDF
    const resumeText = await extractPdfText(buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Ensure file is not scanned/image-only." },
        { status: 400 }
      );
    }

    // 2. Perform deep ATS evaluation using Groq
    const analysis = await analyzeResume(resumeText);
    setLatestAnalysis(analysis);

    return NextResponse.json({
      success: true,
      text: resumeText,
      analysis,
    });
  } catch (error: unknown) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze resume" },
      { status: 500 }
    );
  }
}