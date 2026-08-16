// frontend/src/components/learning/QuizModal.tsx
"use client";

import React, { useState } from "react";
import { X, CheckCircle, AlertCircle, HelpCircle, Award, ArrowRight } from "lucide-react";
import { MilestoneQuiz } from "@/types/learningPath";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: MilestoneQuiz | undefined;
  onPassQuiz: () => void;
}

export default function QuizModal({ isOpen, onClose, quiz, onPassQuiz }: QuizModalProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !quiz) return null;

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const score = calculateScore();
  const passed = score >= quiz.passingScore;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border/80 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-1.5">
              <Award className="w-3.5 h-3.5" /> Milestone Self-Assessment
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground">{quiz.quizTitle}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Passing score threshold: {quiz.passingScore}%
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Questions list */}
        <div className="space-y-6">
          {quiz.questions.map((q, qIndex) => {
            const selectedOpt = selectedAnswers[q.id];

            return (
              <div key={q.id} className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border/50">
                <h4 className="text-xs font-bold text-foreground flex items-start gap-2">
                  <span className="font-mono text-emerald-400">Q{qIndex + 1}.</span>
                  <span>{q.question}</span>
                </h4>

                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = selectedOpt === optIndex;
                    const isCorrect = q.correctIndex === optIndex;

                    let btnClass = "bg-background border-border text-foreground hover:border-emerald-500/50";

                    if (submitted) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                      } else if (isSelected && !isCorrect) {
                        btnClass = "bg-red-500/20 border-red-500 text-red-300 font-bold";
                      }
                    } else if (isSelected) {
                      btnClass = "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold";
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelect(q.id, optIndex)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {submitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {submitted && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-red-400" />}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <p className="text-[11px] text-muted-foreground bg-secondary/50 p-2.5 rounded-xl border border-border/40 leading-relaxed">
                    <span className="font-bold text-foreground">Explanation: </span>
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Results & Actions */}
        {submitted ? (
          <div className="space-y-4 border-t border-border pt-4 text-center">
            <div
              className={`p-4 rounded-2xl border text-center space-y-1 ${
                passed
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-amber-500/15 border-amber-500/40 text-amber-300"
              }`}
            >
              <h4 className="font-heading font-bold text-lg">
                {passed ? "Congratulations! Milestone Passed 🎉" : "Review Phase Material & Try Again"}
              </h4>
              <p className="text-xs">Your Score: {score}% (Required: {quiz.passingScore}%)</p>
            </div>

            <div className="flex gap-3">
              {passed && (
                <button
                  onClick={() => {
                    onPassQuiz();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/20"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Phase Complete & Continue
                </button>
              )}
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSelectedAnswers({});
                }}
                className="w-full py-2.5 rounded-xl bg-secondary hover:bg-accent text-foreground font-bold text-xs transition cursor-pointer"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            Submit Milestone Quiz <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
