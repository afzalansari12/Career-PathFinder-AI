// frontend/src/components/layout/AppShell.tsx
"use client";

import Sidebar from "./Sidebar";
import ChatBot from "@/components/chatbot/chatbot";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <div className="mx-auto flex flex-col md:flex-row max-w-[1600px] min-h-screen">
        {/* Navigation Sidebar (Mobile Sticky Header + Desktop Drawer Sidebar) */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-10 bg-background relative w-full min-w-0">
          {children}
          {/* Floating AI Assistant Chatbot */}
          <ChatBot />
        </main>
      </div>
    </div>
  );
}