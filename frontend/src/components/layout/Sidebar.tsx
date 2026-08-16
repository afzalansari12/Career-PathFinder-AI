// frontend/src/components/layout/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import UpgradeProModal from "@/components/pro/UpgradeProModal";
import { getProStatus } from "@/lib/proStatus";
import {
  LayoutDashboard,
  FileText,
  Map,
  Briefcase,
  Video,
  User,
  MessageSquare,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
} from "lucide-react";

const MAIN_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "ATS Resume Audit", href: "/dashboard/resume", icon: FileText, badge: "AI" },
  { label: "Learning Path & Recommendations", href: "/roadmap", icon: Map, badge: "AI Path" },
  { label: "Live Job Matches", href: "/jobs", icon: Briefcase },
  { label: "Mock AI Interview", href: "/interview", icon: Video },
];

const AI_TOOLS_NAV = [
  { label: "24/7 AI Assistant", href: "/chat", icon: MessageSquare, badge: "NEW" },
];

const ACCOUNT_NAV = [
  { label: "User Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isPro, setIsPro] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const userId = user?.id || user?.primaryEmailAddress?.emailAddress;

  const checkProStatus = () => {
    setIsPro(getProStatus(userId));
  };

  useEffect(() => {
    checkProStatus();
    window.addEventListener("pro_status_updated", checkProStatus);
    return () => window.removeEventListener("pro_status_updated", checkProStatus);
  }, [userId]);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl p-5 md:flex md:flex-col md:justify-between shadow-2xl z-30 transition-all duration-300">
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div className="px-2 flex items-center justify-between border-b border-sidebar-border/60 pb-4">
            <Link
              href="/dashboard"
              className="group font-heading text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4 text-white" />
              </div>
                  <div className="flex flex-col">
                <span className="flex items-center gap-1 leading-none text-foreground group-hover:text-emerald-400 transition-colors">
                  PathFinder <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </span>
                <span className="text-xs font-mono text-muted-foreground font-normal mt-0.5">
                  AI SaaS Accelerator
                </span>
              </div>
            </Link>

            {isPro ? (
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Crown className="w-3 h-3 text-amber-300" /> PRO
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
                FREE
              </span>
            )}
          </div>

          {/* Section 1: Main Core Hub */}
          <div className="space-y-1.5">
            <div className="px-3 text-xs font-mono uppercase tracking-widest text-muted-foreground/80 font-bold mb-2">
              Core Modules
            </div>
            {MAIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/20 translate-x-1"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground hover:translate-x-0.5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-400 rounded-r-full shadow-sm" />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                        isActive ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                        isActive
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-secondary text-muted-foreground border-border"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Section 2: AI Intelligence */}
          <div className="space-y-1.5 pt-1">
            <div className="px-3 text-xs font-mono uppercase tracking-widest text-muted-foreground/80 font-bold mb-2">
              AI Assistant
            </div>
            {AI_TOOLS_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/20 translate-x-1"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground hover:translate-x-0.5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-400 rounded-r-full shadow-sm" />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                        isActive ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Section 3: Pro Upgrade Card Widget */}
          {!isPro ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-emerald-500/10 border border-amber-500/30 space-y-2.5 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1">
                  <Crown className="w-4 h-4" /> PRO Plan
                </span>
                <span className="text-xs font-mono text-muted-foreground">$19/mo</span>
              </div>
              <p className="text-xs text-foreground/90 font-medium leading-snug">
                Unlock 1-Click Resume PDF Export & Unlimited AI Audits
              </p>
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Upgrade to PRO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                <Crown className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>PRO Candidate Unlocked</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Unlimited AI & PDF Exports Active
              </p>
            </div>
          )}

          {/* Section 4: Account */}
          <div className="space-y-1.5">
            {ACCOUNT_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/20 translate-x-1"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground hover:translate-x-0.5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-400 rounded-r-full shadow-sm" />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                        isActive ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom User Identity Card */}
        <div className="border-t border-sidebar-border/60 pt-4 mt-auto">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-sidebar-accent/50 border border-sidebar-border/40 hover:border-emerald-500/30 transition">
            <div className="flex items-center gap-2.5">
              <UserButton userProfileMode="navigation" userProfileUrl="/profile" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">
                  {isPro ? "PRO Candidate" : "Candidate Account"}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
                  {isPro ? "👑 PRO Verified Session" : "Active AI Session"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Upgrade Pro Modal */}
      <UpgradeProModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={() => checkProStatus()}
      />
    </>
  );
}