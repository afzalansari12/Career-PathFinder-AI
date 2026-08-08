// frontend/src/app/dashboard/resume/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Zap, 
  Target, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ATSResult {
  overallScore: number;
  breakdown: {
    structureScore: number;
    keywordScore: number;
    formattingScore: number;
    impactScore: number;
  };
  detectedSkills: string[];
  missingSkills: string[];
  deductions: Array<{
    category: string;
    code: string;
    pointsDeducted: number;
    issue: string;
    recommendation: string;
  }>;
  metrics: {
    totalWords: number;
    actionVerbCount: number;
    quantifiableMetricsCount: number;
    bulletCount: number;
  };
}

export default function ResumeATSPage() {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);

  const handleAnalyze = async () => {
    if (!rawText.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('/api/ats/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, targetRole: 'Senior Full Stack Engineer' })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      console.error('Failed to analyze resume:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-2">
            Enterprise ATS Engine v2.4
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white">Resume Intelligence</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Deterministic rule-based audit with enterprise keyword corpus matching.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-neutral-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-neutral-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Raw Resume Input
              </CardTitle>
              <CardDescription className="text-neutral-400 text-xs">
                Paste raw extracted text or bullet points directly to run the audit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste full resume text here..."
                rows={16}
                className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-xs text-neutral-300 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              />
              <Button
                onClick={handleAnalyze}
                disabled={loading || !rawText.trim()}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs h-10 transition-all"
              >
                {loading ? 'Running Deterministic Audit...' : 'Execute ATS Audit'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <Card className="bg-neutral-900/20 border-white/5 h-full flex flex-col justify-center items-center p-12 text-center">
              <Zap className="w-10 h-10 text-neutral-600 mb-4 animate-pulse" />
              <h3 className="text-neutral-300 font-medium text-sm">No Resume Audited Yet</h3>
              <p className="text-neutral-500 text-xs max-w-sm mt-1">
                Paste text on the left to review mathematical structure, impact velocity, and keyword density.
              </p>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Overall Score Banner */}
              <Card className="bg-neutral-900/80 border-white/10 p-6 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                      Overall Match Score
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-5xl font-extrabold tracking-tight text-white">
                        {result.overallScore}
                      </span>
                      <span className="text-neutral-500 text-sm font-mono">/ 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`${
                        result.overallScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      } text-xs font-semibold px-3 py-1`}
                    >
                      {result.overallScore >= 80 ? 'Interview Ready' : 'Optimization Required'}
                    </Badge>
                  </div>
                </div>

                {/* Metric Sub-bars */}
                <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-mono">STRUCTURE</span>
                    <span className="text-sm font-semibold text-white">
                      {result.breakdown.structureScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-mono">KEYWORDS</span>
                    <span className="text-sm font-semibold text-white">
                      {result.breakdown.keywordScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-mono">IMPACT</span>
                    <span className="text-sm font-semibold text-white">
                      {result.breakdown.impactScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-mono">FORMAT</span>
                    <span className="text-sm font-semibold text-white">
                      {result.breakdown.formattingScore}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* Deductions & Action Items */}
              <Card className="bg-neutral-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-neutral-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Itemized Deductions ({result.deductions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.deductions.length === 0 ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      No critical formatting or structural issues detected!
                    </div>
                  ) : (
                    result.deductions.map((ded, i) => (
                      <div
                        key={i}
                        className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-neutral-200">
                            {ded.issue}
                          </span>
                          <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30">
                            -{ded.pointsDeducted} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-1">
                          <ArrowRight className="w-3 h-3 text-purple-400 shrink-0" />
                          {ded.recommendation}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Skill Matrix */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-neutral-900/50 border-white/10 p-4">
                  <span className="text-xs font-mono text-neutral-400 block mb-2">
                    DETECTED SKILLS ({result.detectedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.detectedSkills.map((skill, i) => (
                      <Badge
                        key={i}
                        className="bg-purple-950/40 text-purple-300 border-purple-800/30 text-[10px]"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="bg-neutral-900/50 border-white/10 p-4">
                  <span className="text-xs font-mono text-neutral-400 block mb-2">
                    MISSING HIGH-VALUE SKILLS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingSkills.map((skill, i) => (
                      <Badge
                        key={i}
                        className="bg-neutral-800/50 text-neutral-400 border-white/5 text-[10px]"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}