// frontend/src/app/chat/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  MessageSquare,
  FileText,
  Target,
  Briefcase,
  HelpCircle,
  BrainCircuit,
  Zap,
  ArrowRight,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  { text: "How can I increase my ATS score from 70 to 90+?", icon: FileText },
  { text: "What are top System Design concepts for Senior Software Engineers?", icon: Target },
  { text: "Give me a structured 3-month roadmap to become an AI Engineer.", icon: BrainCircuit },
  { text: "How do I answer 'Tell me about a complex technical bug you solved'?", icon: MessageSquare },
];

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to PathFinder AI! I'm your 24/7 AI Career Coach. Ask me anything about optimizing your resume, mock interview answers, career roadmaps, or technical system design questions.",
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = query.trim();
    const historyForRequest = messages;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: historyForRequest }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Could not connect to AI server. Please try again." },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again shortly." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6 p-3 sm:p-6 min-h-[calc(100vh-100px)] flex flex-col justify-between">
        {/* Hero Mesh Glow Banner matching Dashboard */}
        <div className="relative z-30 rounded-3xl bg-gradient-to-br from-card via-card/95 to-emerald-950/30 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl shrink-0">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-28 -right-28 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-mono font-semibold">
                <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" /> 24/7 AI Career & Technical Coach
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                AI Career Advisor
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Get instant guidance on technical interview preparation, ATS resume feedback, salary negotiation, and career path progression.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-card/80 p-4 rounded-2xl border border-border/80 text-xs font-mono text-emerald-400">
              <Zap className="w-4 h-4" /> Live AI Engine Connected
            </div>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 my-2 min-h-[350px] max-h-[500px]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-1 shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium rounded-br-none shadow-lg shadow-emerald-950/20"
                    : "bg-muted/40 border border-border/60 text-foreground rounded-bl-none shadow-2xs whitespace-pre-wrap"
                }`}
              >
                {m.content}
              </div>

              {m.role === "user" && (
                <div className="w-9 h-9 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0 border border-border mt-1 shadow-md">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground p-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <span>PathFinder AI is formulating a detailed response...</span>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Quick Starter Prompts Cards */}
        {messages.length <= 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
            {STARTER_PROMPTS.map((prompt, idx) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.text)}
                  className="text-left p-3.5 rounded-2xl bg-card border border-border/80 hover:border-emerald-500/50 hover:bg-card/90 transition duration-300 text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center justify-between group shadow-md cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{prompt.text}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {/* Input Bar */}
        <div className="bg-card border border-border/80 rounded-2xl p-3 shadow-xl flex gap-3 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your career coach anything (e.g. system design, resume review, interview prep)..."
            className="flex-1 bg-background border border-border/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}