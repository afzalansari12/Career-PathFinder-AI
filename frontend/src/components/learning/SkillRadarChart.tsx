// frontend/src/components/learning/SkillRadarChart.tsx
"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SkillItem } from "@/types/learningPath";

interface SkillRadarChartProps {
  knownSkills: SkillItem[];
  targetSkills: SkillItem[];
}

export default function SkillRadarChart({ knownSkills, targetSkills }: SkillRadarChartProps) {
  // Combine known and target skills into a single dataset
  const skillNames = Array.from(
    new Set([
      ...knownSkills.map((s) => s.name),
      ...targetSkills.map((s) => s.name),
    ])
  ).slice(0, 7); // Top 7 skills for clean radar readability

  const chartData = skillNames.map((name) => {
    const known = knownSkills.find((s) => s.name.toLowerCase() === name.toLowerCase());
    const target = targetSkills.find((s) => s.name.toLowerCase() === name.toLowerCase());

    return {
      skill: name,
      CurrentLevel: known ? known.level : 1,
      TargetRequirement: target ? target.level : 4,
    };
  });

  return (
    <div className="w-full h-[280px] sm:h-[320px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "#64748b", fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              borderRadius: "0.75rem",
              color: "#f8fafc",
              fontSize: "12px",
            }}
          />
          <Radar
            name="Current Proficiency"
            dataKey="CurrentLevel"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.35}
          />
          <Radar
            name="Target Requirement"
            dataKey="TargetRequirement"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeDasharray="4 4"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
