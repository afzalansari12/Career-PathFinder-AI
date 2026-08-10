// frontend/src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Simple in-memory fallback store
let profileStore: Record<string, any> = {};

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = profileStore[userId] || {
      targetRole: "Software Development Engineer Intern",
      targetCompany: "Amazon / Big Tech",
      location: "Delhi, India",
      skills: ["C++", "Python", "React", "TypeScript", "Next.js", "Node.js"],
    };

    return NextResponse.json({ success: true, profile: userProfile });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    profileStore[userId] = { ...body, updatedAt: new Date().toISOString() };

    return NextResponse.json({ success: true, profile: profileStore[userId] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}