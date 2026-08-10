"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  Map,
  Briefcase,
  MessagesSquare,
  UserCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/resume", label: "Resume", icon: FileText },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/interview", label: "Interview", icon: MessagesSquare },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <div className="mx-auto flex max-w-[1600px] min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-border bg-sidebar px-4 py-6 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <div className="px-2 flex items-center justify-between">
              <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                PathFinder.
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                BETA
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
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-border pt-4 px-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Account</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}