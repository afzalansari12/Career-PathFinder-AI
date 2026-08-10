// frontend/src/app/interview/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  RotateCcw,
} from "lucide-react";

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

export default function InterviewPage() {
  const [candidateResponse, setCandidateResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const activeScenario =
    "How would you design a rate limiter for an API endpoint handling 100,000 requests per second in Next.js?";

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < Object.keys(event.results).length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setCandidateResponse((prev) =>
            prev ? `${prev} ${currentTranscript}` : currentTranscript
          );
        };

        recognition.onerror = (err: any) => {
          console.error("Speech recognition error:", err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Toggle Speech-to-Text Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Text-to-Speech AI Feedback Audio Handler
  const speakFeedback = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // Stop ongoing speech
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Submit Answer to Backend AI API
  const handleSubmitResponse = async () => {
    if (!candidateResponse.trim() || loading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setLoading(true);
    setAiFeedback(null);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: activeScenario,
          response: candidateResponse,
        }),
      });

      const data = await res.json();
      const feedbackText =
        data.feedback ||
        "Solid attempt! Consider using a Redis Sliding Window algorithm with Lua scripts to handle concurrent atomic checks at 100k req/sec.";

      setAiFeedback(feedbackText);
      speakFeedback(feedbackText);
    } catch (err) {
      console.error("Submission error:", err);
      setAiFeedback("Unable to process answer feedback at this time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">
              AI Interview Simulator
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Practice System Design & Technical Trade-offs with Voice Feedback
            </p>
          </div>
          <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
            Session #104
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Active Question Canvas */}
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Active Scenario
            </span>
            <h2 className="text-sm font-semibold leading-relaxed text-foreground">
              {activeScenario}
            </h2>
            <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-xl border border-border">
              <p className="font-medium text-foreground">Key areas to address:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Data Structure (e.g., Token Bucket vs Sliding Window)</li>
                <li>In-memory data store choice (Redis / Memcached)</li>
                <li>Latency & Edge Middleware integration in Next.js</li>
              </ul>
            </div>
          </div>

          {/* Response Workspace */}
          <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Candidate Response
              </label>

              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-secondary text-secondary-foreground hover:bg-accent border border-border"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-emerald-600" /> Voice Input
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={6}
              value={candidateResponse}
              onChange={(e) => setCandidateResponse(e.target.value)}
              placeholder="Detail your architecture, data structures (e.g., Redis sliding window), and trade-offs... or click 'Voice Input' to speak."
              className="w-full bg-background border border-border rounded-xl p-3 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSubmitResponse}
                disabled={loading || !candidateResponse.trim()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {loading ? "Analyzing Technical Strategy..." : "Submit Response"}
              </button>

              <button
                onClick={() => setCandidateResponse("")}
                className="p-3 bg-secondary hover:bg-accent border border-border rounded-xl text-muted-foreground transition cursor-pointer"
                title="Clear Response"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Feedback Display Box */}
        {aiFeedback && (
          <div className="bg-card border border-emerald-500/30 rounded-2xl p-6 shadow-md space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-600" />
                <h3 className="font-heading font-bold text-sm text-foreground">
                  AI Technical Evaluation
                </h3>
              </div>

              {/* Text-to-Speech Toggle */}
              <button
                onClick={() => speakFeedback(aiFeedback)}
                className="flex items-center gap-1.5 bg-secondary hover:bg-accent border border-border px-3 py-1.5 rounded-xl text-xs font-bold text-foreground transition cursor-pointer"
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                {isSpeaking ? "Mute Feedback" : "Read Aloud"}
              </button>
            </div>

            <p className="text-xs text-foreground leading-relaxed bg-emerald-50/40 p-4 rounded-xl border border-emerald-200">
              {aiFeedback}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}