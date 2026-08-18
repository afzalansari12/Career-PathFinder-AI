// frontend/src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { isUserSignedUp, markUserSignedUp } from "@/lib/authTracking";
import { Sparkles, Loader2 } from "lucide-react";

export default function RootRedirectPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      markUserSignedUp();
      router.replace("/dashboard");
    } else {
      const hasSignedUp = isUserSignedUp();
      if (hasSignedUp) {
        router.replace("/sign-in");
      } else {
        router.replace("/sign-up");
      }
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col items-center space-y-4 text-center max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30 shadow-xl text-xl">
          P
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-heading font-extrabold text-foreground flex items-center justify-center gap-1.5">
            PathFinder AI <Sparkles className="w-4 h-4 text-emerald-400" />
          </h1>
          <p className="text-xs text-muted-foreground">Redirecting to your workspace portal...</p>
        </div>
        <div className="pt-2">
          <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
        </div>
      </div>
    </div>
  );
}