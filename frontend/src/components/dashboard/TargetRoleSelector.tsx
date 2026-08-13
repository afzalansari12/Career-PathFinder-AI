"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Target, Check } from "lucide-react";

const TARGET_ROLES = [
  "Full Stack Engineer",
  "AI / ML Engineer",
  "Software Engineer (SDE)",
  "Frontend Engineer",
  "Backend Engineer",
  "DevOps & Cloud Architect",
  "Data Scientist",
  "Mobile App Engineer",
  "Cybersecurity Specialist",
];

interface TargetRoleSelectorProps {
  initialRole?: string;
}

export default function TargetRoleSelector({ initialRole = "Full Stack Engineer" }: TargetRoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preferred_target_role");
    if (saved && TARGET_ROLES.includes(saved)) {
      setSelectedRole(saved);
    }
  }, []);

  const handleSelect = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem("preferred_target_role", role);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left mt-1">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-medium">Target Position:</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 font-semibold text-xs transition shadow-sm"
        >
          <Target className="w-3.5 h-3.5" />
          <span>{selectedRole}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-card border border-border/90 shadow-2xl z-50 py-2 max-h-64 overflow-y-auto animate-in fade-in-50 zoom-in-95">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border/50 mb-1">
              Select Your Target Career Goal
            </div>
            {TARGET_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => handleSelect(role)}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-500/10 hover:text-emerald-400 transition ${
                  selectedRole === role ? "text-emerald-400 font-semibold bg-emerald-500/10" : "text-foreground"
                }`}
              >
                <span>{role}</span>
                {selectedRole === role && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
