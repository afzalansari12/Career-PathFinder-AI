import { SignUp } from "@clerk/nextjs";
import { Sparkles, CheckCircle2, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-emerald-500/30">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-8">
        {/* Left SaaS Hero Branding Card */}
        <div className="lg:col-span-6 space-y-6 text-left p-6 lg:p-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/40 text-lg">
              P
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
              PathFinder AI
            </span>
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" /> Account Registration
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight leading-tight">
              Create an account & launch your <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                AI Career Journey
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Get instant ATS resume scoring, personalized target role roadmaps, verified job application links, and 24/7 AI interview coaching.
            </p>
          </div>

          {/* Instant Demo Option Banner for Evaluators / Judges */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Quick Prototype Evaluation
              </span>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">
                No Signup Needed
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Evaluating the prototype? Jump straight into the dashboard to test all features instantly.
            </p>
            <Link
              href="/dashboard?demo=true"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 pt-1"
            >
              Explore Instant Demo Mode <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-foreground/90 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Deterministic ATS Resume Scorecard (0-100)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-foreground/90 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI Target Role Learning Milestones & Projects</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-foreground/90 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real Tech Job Openings with Direct Apply Links</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-foreground/90 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Interactive Mock AI Interview Simulator</span>
            </div>
          </div>
        </div>

        {/* Right Clerk SignUp Component */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-4">
          <div className="w-full max-w-md bg-card/80 border border-border/80 p-2 sm:p-4 rounded-3xl shadow-2xl backdrop-blur-xl">
            <SignUp
              appearance={{
                elements: {
                  card: "bg-transparent shadow-none p-4",
                  headerTitle: "text-foreground font-heading font-bold text-xl",
                  headerSubtitle: "text-muted-foreground text-xs",
                  socialButtonsBlockButton:
                    "bg-secondary border border-border text-foreground hover:bg-secondary/80 text-xs font-semibold rounded-xl",
                  formButtonPrimary:
                    "bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-950/20 transition",
                  formFieldInput:
                    "bg-background border border-border text-foreground text-xs rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-emerald-500",
                  footerActionLink: "text-emerald-400 hover:text-emerald-300 font-semibold text-xs",
                },
              }}
            />
          </div>

          <Link
            href="/dashboard?demo=true"
            className="w-full max-w-md py-3 rounded-2xl bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs font-bold text-center border border-border transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-emerald-400" /> Continue with Instant Demo Access
          </Link>
        </div>
      </div>
    </div>
  );
}
