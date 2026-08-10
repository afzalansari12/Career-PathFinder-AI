// frontend/src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Map,
  Briefcase,
  Video,
  User,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "ATS Resume", href: "/dashboard/resume", icon: FileText },
  { label: "Career Roadmap", href: "/roadmap", icon: Map },
  { label: "Live Jobs", href: "/jobs", icon: Briefcase },
  { label: "Mock Interview", href: "/interview", icon: Video },
  { label: "AI Assistant", href: "/chat", icon: MessageSquare },
  { label: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-sidebar p-6 md:flex md:flex-col md:justify-between">
      <div className="space-y-6">
        <div className="px-2 flex items-center justify-between">
          <Link href="/dashboard" className="font-heading text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
            PathFinder <Sparkles className="w-4 h-4 text-emerald-400" />
          </Link>
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            AI SaaS
          </span>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 shadow-md shadow-emerald-950/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-emerald-400" : "text-muted-foreground")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border pt-4 px-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">User Profile</span>
        <UserButton userProfileMode="navigation" userProfileUrl="/profile" />
      </div>
    </aside>
  );
}