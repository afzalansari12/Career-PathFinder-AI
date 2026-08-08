"use client";

import { useState } from "react";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const generateInterview = async () => {
    if (!role) return;

    setLoading(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      console.log(data);

      if (data.success) {
        // Handle both possible response formats
        const qs = Array.isArray(data.questions)
          ? data.questions
          : data.questions.questions;

        setQuestions(qs);
        setAnswers(new Array(qs.length).fill(""));
        setEvaluation(null);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const evaluateInterview = async () => {
    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          questions,
          answers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        AI Interview
      </h1>

      <input
        type="text"
        placeholder="Enter Job Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <button
        onClick={generateInterview}
        className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Generating..." : "Generate Interview"}
      </button>

      <div className="mt-10 space-y-6">
        {questions.map((q, index) => (
          <div
            key={index}
            className="border rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold">
              Q{index + 1}. {q.question}
            </h2>

            <p className="text-blue-600 mt-2">
              Difficulty: {q.difficulty}
            </p>

            <textarea
              rows={5}
              className="w-full border rounded-lg p-3 mt-4"
              placeholder="Write your answer..."
              value={answers[index] || ""}
              onChange={(e) => {
                const copy = [...answers];
                copy[index] = e.target.value;
                setAnswers(copy);
              }}
            />
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <button
          onClick={evaluateInterview}
          className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Evaluate Interview
        </button>
      )}

{evaluation && (
  <div className="mt-10 border rounded-xl p-6 bg-gray-50">
    <h2 className="text-3xl font-bold mb-6">
      AI Evaluation
    </h2>

    <div className="space-y-3">

      <p>
        <strong>Overall Score:</strong> {evaluation.overall_score}/10
      </p>

      <p>
        <strong>Communication:</strong> {evaluation.communication}/10
      </p>

      <p>
        <strong>Technical:</strong> {evaluation.technical}/10
      </p>

      <p>
        <strong>Problem Solving:</strong> {evaluation.problem_solving}/10
      </p>

      <div className="mt-6">
        <h3 className="font-bold text-lg">
          Strengths
        </h3>

        <ul className="list-disc ml-6">
          {evaluation.strengths.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg">
          Weaknesses
        </h3>

        <ul className="list-disc ml-6">
          {evaluation.weaknesses.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg">
          Feedback
        </h3>

        <p>{evaluation.feedback}</p>
      </div>

    </div>
  </div>
)}
    </div>
  );
}