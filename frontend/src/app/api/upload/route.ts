import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { extractPdfText } from "@/lib/pdf";
import { analyzeResume } from "@/lib/groq";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const resumeText = await extractPdfText(file);

    console.log("========== RESUME ==========");
    console.log(resumeText);
    console.log("============================");

    // Analyze resume using Groq
    const aiResponse = await analyzeResume(resumeText);

    let analysis;

    try {
      analysis = JSON.parse(aiResponse);
    } catch (err) {
      console.error("Invalid AI JSON:");
      console.error(aiResponse);

      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          raw: aiResponse,
        },
        { status: 500 }
      );
    }

    console.log("========== AI ANALYSIS ==========");
    console.log(analysis);
    console.log("=================================");

    // Upload PDF to Supabase Storage
    const fileName = userId
      ? `${userId}/${Date.now()}-${file.name}`
      : `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("resumes")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    const { data, error: dbError } = await supabase
    .from("resume_analysis")
    .insert({
      user_id: userId || null,
      resume_url: fileName,
      analysis,
    })
    .select();
  
  console.log("Inserted Data:", data);
  console.log("Database Error:", dbError);

 if (dbError) {
  console.error("Database Error:", dbError);

  return NextResponse.json(
    {
      error: dbError.message,
    },
    {
      status: 500,
    }
  );
}
console.log("✅ Resume analysis saved to database");
 
    return NextResponse.json({
      success: true,
      fileName,
      resumeText,
      analysis,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}