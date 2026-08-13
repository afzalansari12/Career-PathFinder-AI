"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import UpgradeProModal from "@/components/pro/UpgradeProModal";
import { getProStatus } from "@/lib/proStatus";
import { useUser } from "@clerk/nextjs";
import {
  UserCircle,
  Briefcase,
  MapPin,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Crown,
  ArrowRight,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const [isSaved, setIsSaved] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const userId = user?.id || user?.primaryEmailAddress?.emailAddress;

  const checkPro = () => {
    setIsPro(getProStatus(userId));
  };

  useEffect(() => {
    checkPro();
    window.addEventListener("pro_status_updated", checkPro);
    return () => window.removeEventListener("pro_status_updated", checkPro);
  }, [userId]);

  // Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || "Afzal Ansari");
  const [email] = useState(user?.primaryEmailAddress?.emailAddress || "afzalansari12ab@gmail.com");
  const [targetRole, setTargetRole] = useState("Software Development Engineer Intern");
  const [targetCompany, setTargetCompany] = useState("Amazon / Big Tech");
  const [location, setLocation] = useState("Delhi, India");
  const [skills, setSkills] = useState("C++, Python, React, TypeScript, Next.js, Node.js");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <AppShell>
      {/* Top Controls Bar */}
      <div className="-mt-6 -mx-6 lg:-mt-10 lg:-mx-10 border-b border-border bg-card px-6 py-3 mb-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" /> Candidate Profile & Targeting
          </span>
          {isPro ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Crown className="w-3.5 h-3.5 text-amber-300" /> PRO Candidate
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-secondary text-muted-foreground border border-border">
              Free Candidate
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isPro && (
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-xl transition shadow-sm cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" /> Upgrade to PRO
            </button>
          )}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> {isSaved ? "Saved!" : "Save Profile"}
          </button>
        </div>
      </div>

      {/* Split Dual-Pane View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Sidebar: User Identity Card */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-6 sticky top-6">
          <div className="text-center space-y-3">
            <div className="relative w-20 h-20 mx-auto rounded-full border-4 border-emerald-500/20 bg-emerald-50/50 flex items-center justify-center overflow-hidden">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-12 h-12 text-emerald-700" />
              )}
            </div>
            <div>
              <h2 className="text-base font-heading font-bold text-foreground">
                {fullName}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
            </div>
          </div>

          {/* Tier Status Box */}
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-mono uppercase text-[10px]">Subscription Plan</span>
              {isPro ? (
                <span className="font-bold text-amber-300 flex items-center gap-1 font-mono">
                  <Crown className="w-3.5 h-3.5" /> PRO ACTIVE
                </span>
              ) : (
                <span className="font-bold text-muted-foreground font-mono">FREE TIER</span>
              )}
            </div>

            {!isPro ? (
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="w-full py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Upgrade for Unlimited Scans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <p className="text-[10px] text-emerald-400 font-mono text-center">
                👑 Unlimited AI Compute & PDF Export Unlocked
              </p>
            )}
          </div>

          <hr className="border-border" />

          {/* Quick Info Summary */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-accent/40 border border-border rounded-xl">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-primary" /> Target Role
              </span>
              <span className="font-bold text-foreground truncate max-w-[140px]">{targetRole}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent/40 border border-border rounded-xl">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Location
              </span>
              <span className="font-bold text-foreground">{location}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent/40 border border-border rounded-xl">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Account Auth
              </span>
              <span className="font-bold text-emerald-700">Clerk Verified</span>
            </div>
          </div>
        </div>

        {/* Right Canvas Pane: Editable Configuration Sheet */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-8 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-border">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Profile & ATS Targeting Settings
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              This data feeds directly into your ATS scoring engine, interview simulation prompts, and live job matching filters.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            {/* Target Role & Target Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Target Engineering Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Target Company / Track</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Preferred Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>

            {/* Core Skills */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Core Skill Keywords (Comma Separated)
              </label>
              <textarea
                rows={3}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-3.5 text-xs font-mono text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-2xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Profile Preferences
              </button>
            </div>
          </form>
        </div>
      </div>

      <UpgradeProModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={() => checkPro()}
      />
    </AppShell>
  );
}