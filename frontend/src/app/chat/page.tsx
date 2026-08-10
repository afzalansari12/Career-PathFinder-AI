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
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "How can I increase my ATS score from 70 to 90+?",
  "What are the top System Design concepts for Senior Engineers?",
  "Give me a 3-month roadmap to become an AI Software Engineer.",
  "How do I answer 'Tell me about a time you faced a technical bug'?",
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
      <div className="max-w-4xl mx-auto space-y-6 p-2 sm:p-4 flex flex-col h-[calc(100vh-100px)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-1">
              <Bot className="w-3.5 h-3.5" /> PathFinder AI Assistant
            </div>
            <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">
              AI Career & Technical Coach
            </h1>
          </div>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[82%] text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-600 text-white font-medium rounded-br-none shadow-md shadow-emerald-950/20"
                    : "bg-muted/40 border border-border/60 text-foreground rounded-bl-none shadow-2xs whitespace-pre-wrap"
                }`}
              >
                {m.content}
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0 border border-border mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground p-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span>PathFinder AI is formulating a detailed response...</span>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Quick Starter Prompts */}
        {messages.length <= 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 shrink-0">
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="p-3 rounded-2xl bg-card border border-border/70 hover:border-emerald-500/40 text-left text-xs text-foreground/90 transition hover:bg-muted/30 flex items-center justify-between group cursor-pointer"
              >
                <span className="line-clamp-1">{prompt}</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="bg-card border border-border/80 rounded-2xl p-3 shadow-xl flex gap-3 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about resume ATS, mock interview prep, or career roadmaps..."
            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 rounded-xl transition flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}