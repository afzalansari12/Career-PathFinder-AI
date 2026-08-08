// frontend/src/app/interview/page.tsx
"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TARGET_ROLES = [
  "Full Stack Software Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps & Cloud Engineer",
  "Frontend Developer",
];

export default function InterviewPage() {
  const { user } = useUser();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ score?: number; feedback?: string } | null>(null);

  // 1. Generate Domain-Specific Technical Question
  const handleStartInterview = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      setAnswer("");

      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await res.json();
      setQuestion(data.question);
    } catch (err) {
      console.error("Failed to generate question:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Answer for Strict Contextual Evaluation
  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !question) return;

    try {
      setLoading(true);
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          role: selectedRole,
          question,
          answer,
        }),
      });

      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error("Failed to evaluate answer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Interview Simulator</h1>
          <p className="text-muted-foreground mt-1">
            Real-time, role-tailored technical evaluations with adaptive feedback.
          </p>
        </div>
        
        {/* Role Selector */}
        {!question && (
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="p-2 border rounded-md bg-background text-sm font-medium focus:ring-2 focus:ring-purple-500"
          >
            {TARGET_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        )}
      </div>

      {!question ? (
        <Card className="text-center p-8 border-dashed">
          <CardContent className="space-y-4 pt-6">
            <p className="text-muted-foreground">
              Target Track: <strong className="text-foreground">{selectedRole}</strong>
            </p>
            <Button onClick={handleStartInterview} disabled={loading} size="lg">
              {loading ? "Generating Domain Question..." : "Start Practice Session"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Target Track: {selectedRole}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/60 rounded-lg text-foreground font-semibold text-base">
              {question}
            </div>

            {!feedback ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Your Response:</label>
                <Textarea
                  rows={6}
                  placeholder="Provide your technical solution, trade-off analysis, or architecture decisions..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Evaluation Score:</span>
                  <span
                    className={`text-2xl font-bold ${
                      (feedback.score ?? 0) >= 75 ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {feedback.score ?? 0}/100
                  </span>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg text-sm space-y-1">
                  <p className="font-semibold text-purple-900 dark:text-purple-300">AI Senior Recruiter Feedback:</p>
                  <p className="text-purple-800 dark:text-purple-400">{feedback.feedback}</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            {!feedback ? (
              <Button onClick={handleSubmitAnswer} disabled={loading || !answer.trim()}>
                {loading ? "Evaluating Answer..." : "Submit Answer"}
              </Button>
            ) : (
              <div className="flex gap-3 w-full justify-end">
                <Button variant="outline" onClick={handleStartInterview}>
                  Next Question
                </Button>
                <Button onClick={() => router.push("/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}