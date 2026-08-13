"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Target, Check, Sparkles } from "lucide-react";

const TARGET_ROLES = [
  { title: "Full Stack Engineer", category: "Software Engineering", hot: true },
  { title: "AI / ML Engineer", category: "Artificial Intelligence", hot: true },
  { title: "Software Engineer (SDE)", category: "Core Engineering", hot: false },
  { title: "Frontend Engineer", category: "Web Development", hot: false },
  { title: "Backend Engineer", category: "Systems & APIs", hot: false },
  { title: "DevOps & Cloud Architect", category: "Cloud & Infrastructure", hot: true },
  { title: "Data Scientist", category: "Data Analytics", hot: false },
  { title: "Mobile App Engineer", category: "iOS & Android", hot: false },
  { title: "Cybersecurity Specialist", category: "Security Operations", hot: false },
];

interface TargetRoleSelectorProps {
  initialRole?: string;
}

export default function TargetRoleSelector({ initialRole = "Full Stack Engineer" }: TargetRoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preferred_target_role");
    if (saved && TARGET_ROLES.some((r) => r.title === saved)) {
      setSelectedRole(saved);
    }
  }, []);

  const handleSelect = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem("preferred_target_role", role);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left mt-2">
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Target Role:</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 font-semibold text-xs transition-all duration-300 shadow-lg shadow-emerald-950/20 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>

          <Target className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="font-heading font-bold text-foreground group-hover:text-emerald-400 transition-colors">
            {selectedRole}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-emerald-400/80 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-emerald-400" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2.5 w-72 rounded-3xl bg-card/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl z-50 py-2.5 max-h-80 overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="px-4 py-2 border-b border-border/50 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Select Career Goal
              </span>
              <Sparkles className="w-3 h-3 text-emerald-400" />
            </div>

            <div className="px-1 space-y-0.5">
              {TARGET_ROLES.map((role) => {
                const isSelected = selectedRole === role.title;
                return (
                  <button
                    key={role.title}
                    onClick={() => handleSelect(role.title)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs flex items-center justify-between transition-all duration-200 ${
                      isSelected
                        ? "bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30"
                        : "text-foreground hover:bg-emerald-500/10 hover:text-emerald-400 border border-transparent"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span>{role.title}</span>
                        {role.hot && (
                          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            HOT
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">{role.category}</span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
