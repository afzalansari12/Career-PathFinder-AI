"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
        CareerPath AI 🚀
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        AI-powered career pathfinder, ATS resume optimization, and mock interview practice.
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          href="/dashboard"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-2xs transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}