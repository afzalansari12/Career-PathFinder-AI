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
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resume", href: "/resume", icon: FileText },
  { label: "Roadmap", href: "/roadmap", icon: Map },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Interview", href: "/interview", icon: Video },
  { label: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-sidebar p-6 md:flex md:flex-col md:justify-between">
      <div className="space-y-6">
        <div className="px-2 flex items-center justify-between">
          <span className="font-heading text-xl font-bold tracking-tight">
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
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition",
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
        <UserButton userProfileMode="navigation" userProfileUrl="/profile" />
      </div>
    </aside>
  );
}