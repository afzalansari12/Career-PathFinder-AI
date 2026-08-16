// frontend/src/app/profile/page.tsx
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
  BookOpen,
  Sliders,
  Award,
  Layers,
  Clock,
  Zap,
} from "lucide-react";
import { LearnerProfile, ExperienceLevel, LearningPace, LearningStyle, CompletedCourse } from "@/types/learningPath";
import { loadStoredProfile, saveStoredProfile, calculateSkillGaps } from "@/lib/learningPathEngine";

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

  // Learner Profile State
  const [profile, setProfile] = useState<LearnerProfile>(loadStoredProfile());

  // Additional basic profile fields
  const [fullName, setFullName] = useState(user?.fullName || "Afzal Ansari");
  const [email] = useState(user?.primaryEmailAddress?.emailAddress || "afzalansari12ab@gmail.com");
  const [location, setLocation] = useState("Delhi, India");

  // New course state
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCoursePlatform, setNewCoursePlatform] = useState("Udemy");

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = {
      ...profile,
      skillGaps: calculateSkillGaps(profile),
      lastUpdated: new Date().toISOString(),
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddCourse = () => {
    if (!newCourseTitle.trim()) return;
    const course: CompletedCourse = {
      id: `course-${Date.now()}`,
      title: newCourseTitle.trim(),
      platform: newCoursePlatform,
      dateCompleted: new Date().toISOString().split("T")[0],
      rating: 5,
      keySkillsLearned: ["Software Architecture", "Core Concepts"],
    };
    const updated: LearnerProfile = {
      ...profile,
      completedCourses: [course, ...profile.completedCourses],
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setNewCourseTitle("");
  };

  return (
    <AppShell>
      {/* Top Controls Bar */}
      <div className="-mt-6 -mx-6 lg:-mt-10 lg:-mx-10 border-b border-border bg-card px-6 py-3 mb-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5" /> Learner Profiling & AI Targeting Engine
          </span>
          {isPro ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Crown className="w-3.5 h-3.5 text-amber-300" /> PRO Learner
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-secondary text-muted-foreground border border-border">
              Free Learner
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
            onClick={() => handleSave()}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> {isSaved ? "Profile Saved!" : "Save Learner Profile"}
          </button>
        </div>
      </div>

      {/* Split Dual-Pane View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: User Identity & Profile Summary Card */}
        <div className="lg:col-span-4 bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-6 sticky top-6">
          <div className="text-center space-y-3">
            <div className="relative w-20 h-20 mx-auto rounded-full border-4 border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center overflow-hidden">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-12 h-12 text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="text-base font-heading font-bold text-foreground">{fullName}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
            </div>
          </div>

          {/* Target Role & Level */}
          <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 space-y-2 text-xs">
            <div className="flex justify-between items-center text-muted-foreground font-mono">
              <span>Target Role:</span>
              <span className="font-bold text-emerald-400">{profile.targetGoal}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground font-mono">
              <span>Level:</span>
              <span className="font-bold text-foreground">{profile.experienceLevel}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground font-mono">
              <span>Commitment:</span>
              <span className="font-bold text-foreground">{profile.preferences.hoursPerWeek} hrs/week</span>
            </div>
          </div>

          <hr className="border-border" />

          {/* Quick Stats Summary */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Completed Courses
              </span>
              <span className="font-bold text-foreground">{profile.completedCourses.length} Courses</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-blue-400" /> Skill Gaps Identified
              </span>
              <span className="font-bold text-amber-400">{profile.skillGaps.length} Gaps</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Learner Engine
              </span>
              <span className="font-bold text-emerald-400">AI Profile Active</span>
            </div>
          </div>
        </div>

        {/* Right Canvas Pane: Learner Profiling Configuration Sheet */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Career Aspirations & Experience Level */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="pb-3 border-b border-border">
              <h3 className="text-sm font-heading font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" /> Target Learning Objectives & Experience
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Specify your career aspirations so the AI engine can calculate missing skill competencies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Target Career Goal / Position</label>
                <input
                  type="text"
                  value={profile.targetGoal}
                  onChange={(e) => setProfile({ ...profile, targetGoal: e.target.value })}
                  placeholder="e.g. Full Stack AI Engineer, Lead System Architect"
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-foreground focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Current Experience Level</label>
                <select
                  value={profile.experienceLevel}
                  onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value as ExperienceLevel })}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-foreground focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner (0-1 years)</option>
                  <option value="Intermediate">Intermediate (1-3 years)</option>
                  <option value="Advanced">Advanced (4+ years)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Learning Preferences & Style Engine */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="pb-3 border-b border-border">
              <h3 className="text-sm font-heading font-bold text-foreground flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" /> Learning Preferences & Weekly Commitment
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure pace and learning style for customized recommendation algorithms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Learning Style</label>
                <select
                  value={profile.preferences.style}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, style: e.target.value as LearningStyle },
                    })
                  }
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-foreground focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Project-Based">Hands-on Project-Based</option>
                  <option value="Video">Video Courses & Tutorials</option>
                  <option value="Theory/Docs">Reading Docs & Books</option>
                  <option value="Interactive">Interactive Coding Practice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Learning Pace</label>
                <select
                  value={profile.preferences.pace}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, pace: e.target.value as LearningPace },
                    })
                  }
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-foreground focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Fast">Fast Pace (Accelerated)</option>
                  <option value="Standard">Standard Pace (Balanced)</option>
                  <option value="Relaxed">Relaxed Pace (Flexible)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Weekly Time Commitment</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={2}
                    max={40}
                    value={profile.preferences.hoursPerWeek}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, hoursPerWeek: parseInt(e.target.value) || 10 },
                      })
                    }
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-foreground focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-xs font-mono text-muted-foreground shrink-0">Hrs/wk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Completed Courses & Previous Learning History */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="pb-3 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-sm font-heading font-bold text-foreground flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" /> Completed Courses & Learning History
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Log previous courses so the AI recommendation engine won't suggest duplicate topics.
                </p>
              </div>
            </div>

            {/* Course adder form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                placeholder="Course Title (e.g., Coursera Deep Learning Specialization)..."
                className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <select
                value={newCoursePlatform}
                onChange={(e) => setNewCoursePlatform(e.target.value)}
                className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                <option value="Udemy">Udemy</option>
                <option value="Coursera">Coursera</option>
                <option value="edX">edX</option>
                <option value="MIT OCW">MIT OCW</option>
                <option value="Youtube / Self-Study">Self-Study</option>
              </select>
              <button
                onClick={handleAddCourse}
                disabled={!newCourseTitle.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Log Course
              </button>
            </div>

            {/* Logged Courses List */}
            <div className="space-y-2 pt-2">
              {profile.completedCourses.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 border border-border/50 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-foreground">{c.title}</h4>
                    <p className="text-[11px] text-muted-foreground">{c.platform} • Completed {c.dateCompleted}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleSave()}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Profile Preferences & Re-calculate Gaps
            </button>
          </div>
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