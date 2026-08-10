"use client";

import Sidebar from "./Sidebar";
import ChatBot from "@/components/chatbot/chatbot";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <div className="mx-auto flex max-w-[1600px] min-h-screen">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background relative">
          {children}
          {/* Floating AI Assistant Chatbot */}
          <ChatBot />
        </main>
      </div>
    </div>
  );
}