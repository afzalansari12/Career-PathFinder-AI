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
  Target,
  Plus,
  Trash2,
  BarChart3,
  BrainCircuit,
  Search,
} from "lucide-react";
import { LearnerProfile, ExperienceLevel, LearningPace, LearningStyle, CompletedCourse } from "@/types/learningPath";
import { DEFAULT_PROFILE, loadStoredProfile, saveStoredProfile, calculateSkillGaps } from "@/lib/learningPathEngine";

const POPULAR_PRESET_COURSES = [
  { title: "AWS Certified Solutions Architect", platform: "AWS Training" },
  { title: "Next.js 16 & React 19 Full-Stack Architecture", platform: "Vercel Academy" },
  { title: "Data Structures and Algorithms Specialization", platform: "Coursera" },
  { title: "System Design for High-Scalability Applications", platform: "ByteByteGo" },
  { title: "Deep Learning Specialization (PyTorch)", platform: "DeepLearning.AI" },
  { title: "PostgreSQL High Performance & Query Tuning", platform: "Udemy" },
  { title: "Complete Web Development Bootcamp", platform: "Udemy" },
];

export default function ProfilePage() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const userId = user?.id || user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    setMounted(true);
    if (userId) {
      setIsPro(getProStatus(userId));
    }
  }, [userId]);

  // Learner Profile State initialized with baseline defaults for zero hydration mismatch
  const [profile, setProfile] = useState<LearnerProfile>(DEFAULT_PROFILE);

  // Additional basic profile fields
  const [fullName, setFullName] = useState("Learner");
  const [email, setEmail] = useState("learner@example.com");
  const [location, setLocation] = useState("Delhi, India");

  // Load client stored profile after mount
  useEffect(() => {
    const p = loadStoredProfile();
    setProfile(p);
    if (user?.fullName) setFullName(user.fullName);
    if (user?.primaryEmailAddress?.emailAddress) setEmail(user.primaryEmailAddress.emailAddress);
  }, [user]);

  // Course logger state
  const [selectedDropdownCourse, setSelectedDropdownCourse] = useState("");
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

  const handleSelectDropdownCourse = (title: string) => {
    setSelectedDropdownCourse(title);
    if (title) {
      setNewCourseTitle(title);
      const found = POPULAR_PRESET_COURSES.find((c) => c.title === title);
      if (found) {
        setNewCoursePlatform(found.platform);
      }
    }
  };

  const handlePlatformChange = (platform: string) => {
    setNewCoursePlatform(platform);
    if (!newCourseTitle.trim()) {
      if (platform === "AWS Training") setNewCourseTitle("AWS Certified Solutions Architect");
      else if (platform === "Vercel Academy") setNewCourseTitle("Next.js 16 & React 19 Full-Stack Architecture");
      else if (platform === "ByteByteGo") setNewCourseTitle("System Design for High-Scalability Applications");
      else if (platform === "DeepLearning.AI") setNewCourseTitle("Deep Learning Specialization (PyTorch)");
      else if (platform === "Coursera") setNewCourseTitle("Data Structures and Algorithms Specialization");
      else if (platform === "Udemy") setNewCourseTitle("Complete Web Development Bootcamp");
    }
  };

  const handleAddCourse = () => {
    let titleToAdd = (newCourseTitle || selectedDropdownCourse).trim();
    if (!titleToAdd) {
      if (newCoursePlatform === "AWS Training") titleToAdd = "AWS Certified Solutions Architect";
      else if (newCoursePlatform === "Vercel Academy") titleToAdd = "Next.js 16 & React 19 Full-Stack Architecture";
      else if (newCoursePlatform === "ByteByteGo") titleToAdd = "System Design for High-Scalability Applications";
      else if (newCoursePlatform === "DeepLearning.AI") titleToAdd = "Deep Learning Specialization (PyTorch)";
      else if (newCoursePlatform === "Coursera") titleToAdd = "Data Structures and Algorithms Specialization";
      else titleToAdd = `${newCoursePlatform} Certification Course`;
    }

    const course: CompletedCourse = {
      id: `course-${Date.now()}`,
      title: titleToAdd,
      platform: newCoursePlatform,
      dateCompleted: new Date().toISOString().split("T")[0],
      rating: 5,
      keySkillsLearned: ["Software Architecture", "Core Competencies"],
    };

    const updated: LearnerProfile = {
      ...profile,
      completedCourses: [course, ...(profile.completedCourses || [])],
    };

    setProfile(updated);
    saveStoredProfile(updated);
    setNewCourseTitle("");
    setSelectedDropdownCourse("");
  };

  const handleRemoveCourse = (id: string) => {
    const updated: LearnerProfile = {
      ...profile,
      completedCourses: (profile.completedCourses || []).filter((c) => c.id !== id),
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const updateSkillLevel = (skillName: string, newLevel: number, isKnown: boolean) => {
    if (isKnown) {
      const updatedKnown = (profile.knownSkills || []).map((s) =>
        s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level: newLevel } : s
      );
      const updated = { ...profile, knownSkills: updatedKnown };
      setProfile(updated);
      saveStoredProfile(updated);
    } else {
      const updatedTarget = (profile.targetSkills || []).map((s) =>
        s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level: newLevel } : s
      );
      const updated = { ...profile, targetSkills: updatedTarget };
      setProfile(updated);
      saveStoredProfile(updated);
    }
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8 p-3 sm:p-6">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-3.5 h-3.5" /> Learner Profile & AI Targeting Engine
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
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition shadow-md cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" /> Upgrade to PRO
              </button>
            )}

            <button
              onClick={() => handleSave()}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-bold px-5 py-2 rounded-xl transition shadow-lg shadow-emerald-950/20 cursor-pointer"
            >
              <Save className="w-4 h-4" /> {isSaved ? "Saved Successfully!" : "Save Learner Profile"}
            </button>
          </div>
        </div>

        {/* Decorative Hero Mesh Glow Banner matching Dashboard */}
        <div className="relative z-30 rounded-3xl bg-gradient-to-br from-card via-card/95 to-emerald-950/30 border border-emerald-500/30 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-28 -right-28 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-mono font-semibold">
                <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" /> AI Learner Profile Core
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Learner Profile & Preferences
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Configure your known skills, target role goals, study preferences, and completed courses to personalize AI roadmap recommendations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="p-4 rounded-2xl bg-card/90 border border-border/80 text-center shadow-lg min-w-[140px]">
                <div className="text-2xl font-extrabold font-mono text-emerald-400">{profile.knownSkills?.length || 0}</div>
                <div className="text-[11px] font-mono text-muted-foreground uppercase">Known Skills</div>
              </div>
              <div className="p-4 rounded-2xl bg-card/90 border border-border/80 text-center shadow-lg min-w-[140px]">
                <div className="text-2xl font-extrabold font-mono text-blue-400">{profile.targetSkills?.length || 0}</div>
                <div className="text-[11px] font-mono text-muted-foreground uppercase">Target Skills</div>
              </div>
            </div>
          </div>
        </div>

        {/* Split Dual-Pane View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: User Identity Card */}
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
                <h2 className="text-lg font-heading font-bold text-foreground" suppressHydrationWarning>
                  {mounted ? fullName : "Learner"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5" suppressHydrationWarning>
                  {mounted ? email : "learner@example.com"}
                </p>
              </div>
            </div>

            {/* Target Role Pill */}
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-muted-foreground font-mono">
                <span>Target Career Role:</span>
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-base font-extrabold text-emerald-400">{profile.targetGoal}</div>
            </div>

            {/* Personal Details Form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-muted-foreground font-mono uppercase block mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-mono uppercase block mb-1 font-bold">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Right Main Pane: Skills & Preferences */}
          <div className="lg:col-span-8 space-y-8">
            {/* Target Role Goal & Experience Level Section */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <Target className="w-5 h-5 text-emerald-400" />
                <h3 className="font-heading font-bold text-lg text-foreground">Target Role & Experience Level</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground block mb-1 font-bold">Target Position</label>
                  <input
                    type="text"
                    value={profile.targetGoal}
                    onChange={(e) => setProfile({ ...profile, targetGoal: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground block mb-1 font-bold">Current Level</label>
                  <select
                    value={profile.experienceLevel}
                    onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value as ExperienceLevel })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Known Skills & Target Skills Matrix */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <h3 className="font-heading font-bold text-lg text-foreground">Skill Proficiency Ratings (1 - 5)</h3>
              </div>

              {/* Known Skills */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">Known Skills</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.knownSkills?.map((skill, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{skill.name}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => updateSkillLevel(skill.name, lvl, true)}
                            className={`w-6 h-6 rounded-md text-[10px] font-mono font-bold transition ${
                              lvl <= skill.level ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground hover:bg-card"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Skills */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">Target Role Required Skills</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.targetSkills?.map((skill, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{skill.name}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => updateSkillLevel(skill.name, lvl, false)}
                            className={`w-6 h-6 rounded-md text-[10px] font-mono font-bold transition ${
                              lvl <= skill.level ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground hover:bg-card"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Study Preferences Section */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <Sliders className="w-5 h-5 text-purple-400" />
                <h3 className="font-heading font-bold text-lg text-foreground">Learning Preferences</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground block mb-1 font-bold">Learning Pace</label>
                  <select
                    value={profile.preferences.pace}
                    onChange={(e) =>
                      setProfile({ ...profile, preferences: { ...profile.preferences, pace: e.target.value as LearningPace } })
                    }
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="Accelerated">Accelerated</option>
                    <option value="Standard">Standard</option>
                    <option value="Relaxed">Relaxed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground block mb-1 font-bold">Learning Style</label>
                  <select
                    value={profile.preferences.style}
                    onChange={(e) =>
                      setProfile({ ...profile, preferences: { ...profile.preferences, style: e.target.value as LearningStyle } })
                    }
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="Project-Based">Project-Based</option>
                    <option value="Video-First">Video-First</option>
                    <option value="Theory-Driven">Theory-Driven</option>
                    <option value="Interactive">Interactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground block mb-1 font-bold">Hours Per Week</label>
                  <input
                    type="number"
                    min={1}
                    max={80}
                    value={profile.preferences.hoursPerWeek}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, hoursPerWeek: parseInt(e.target.value) || 10 },
                      })
                    }
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Completed Courses Log */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="font-heading font-bold text-lg text-foreground">Completed Courses Log</h3>
                </div>
              </div>

              {/* Add Course Form with Dual Input (Dropdown + Search/Type) */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-muted-foreground font-bold">
                    Select Popular Course or Type Custom Title
                  </label>
                  <select
                    value={selectedDropdownCourse}
                    onChange={(e) => handleSelectDropdownCourse(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none font-medium"
                  >
                    <option value="">-- Choose from Popular Preset Courses --</option>
                    {POPULAR_PRESET_COURSES.map((preset, idx) => (
                      <option key={idx} value={preset.title}>
                        {preset.title} ({preset.platform})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Search or type custom course title (e.g. AWS Certified Solutions Architect)"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none"
                  />
                  <select
                    value={newCoursePlatform}
                    onChange={(e) => handlePlatformChange(e.target.value)}
                    className="bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-foreground font-semibold"
                  >
                    <option value="AWS Training">AWS Training</option>
                    <option value="Udemy">Udemy</option>
                    <option value="Coursera">Coursera</option>
                    <option value="edX">edX</option>
                    <option value="Vercel Academy">Vercel Academy</option>
                    <option value="ByteByteGo">ByteByteGo</option>
                    <option value="DeepLearning.AI">DeepLearning.AI</option>
                  </select>
                  <button
                    onClick={handleAddCourse}
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-md shadow-emerald-950/20 active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Course
                  </button>
                </div>
              </div>

              {/* Logged Courses List */}
              <div className="space-y-3 pt-2">
                {profile.completedCourses?.map((course) => (
                  <div key={course.id} className="p-4 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {course.platform}
                        </span>
                        <span className="text-xs font-bold text-foreground">{course.title}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 font-mono">Completed: {course.dateCompleted}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveCourse(course.id)}
                      className="text-muted-foreground hover:text-red-400 transition cursor-pointer p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpgradeProModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </AppShell>
  );
}