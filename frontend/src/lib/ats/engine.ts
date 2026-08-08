// frontend/src/lib/ats/engine.ts
// Add this alias at the bottom of frontend/src/lib/ats/engine.ts:
export { DeterministicATSEngine as ATSEngine };

export interface ParsedResume {
    rawText: string;
    sections: {
      experience: string;
      education: string;
      skills: string;
      projects: string;
      summary: string;
    };
    wordCount: number;
    extractedSkills: string[];
  }
  
  export interface ATSDeduction {
    category: 'Structure' | 'Keywords' | 'Impact' | 'Formatting';
    code: string;
    pointsDeducted: number;
    issue: string;
    recommendation: string;
  }
  
  export interface ATSEvaluationResult {
    overallScore: number;
    breakdown: {
      structureScore: number;
      keywordScore: number;
      formattingScore: number;
      impactScore: number;
    };
    detectedSkills: string[];
    missingSkills: string[];
    deductions: ATSDeduction[];
    metrics: {
      totalWords: number;
      actionVerbCount: number;
      quantifiableMetricsCount: number;
      bulletCount: number;
    };
  }
  
  // Enterprise Skill Corpus for Tech Roles
  const CRITICAL_SKILL_CORPUS = [
    'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Python',
    'PostgreSQL', 'SQL', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'REST API',
    'GraphQL', 'Git', 'CI/CD', 'Redis', 'Microservices', 'System Design',
    'Tailwind CSS', 'Java', 'C++', 'Go'
  ];
  
  const ACTION_VERBS = new Set([
    'architected', 'built', 'spearheaded', 'optimized', 'scaled', 'implemented',
    'deployed', 'designed', 'engineered', 'led', 'reduced', 'increased',
    'automated', 'refactored', 'integrated', 'developed', 'established', 'created'
  ]);
  
  export class DeterministicATSEngine {
    /**
     * Evaluates raw resume text using deterministic rules.
     */
    public static evaluate(rawText: string, targetRole: string = 'Software Engineer'): ATSEvaluationResult {
      const deductions: ATSDeduction[] = [];
      const textLower = rawText.toLowerCase();
      const words = rawText.trim().split(/\s+/);
      const totalWords = words.length;
  
      // 1. SECTION DETECTION
      const sections = this.extractSections(rawText);
      let structureScore = 100;
  
      if (!sections.experience) {
        structureScore -= 30;
        deductions.push({
          category: 'Structure',
          code: 'MISSING_EXPERIENCE_SECTION',
          pointsDeducted: 30,
          issue: 'No clear Work Experience section header detected.',
          recommendation: 'Use a standard heading such as "Work Experience" or "Professional Experience".'
        });
      }
  
      if (!sections.skills) {
        structureScore -= 25;
        deductions.push({
          category: 'Structure',
          code: 'MISSING_SKILLS_SECTION',
          pointsDeducted: 25,
          issue: 'No dedicated Skills section heading detected.',
          recommendation: 'Add a distinct "Skills" section listing technical proficiencies.'
        });
      }
  
      if (!sections.education) {
        structureScore -= 20;
        deductions.push({
          category: 'Structure',
          code: 'MISSING_EDUCATION_SECTION',
          pointsDeducted: 20,
          issue: 'No Education section heading detected.',
          recommendation: 'Add an "Education" header listing degree, institution, and graduation year.'
        });
      }
  
      structureScore = Math.max(0, structureScore);
  
      // 2. KEYWORD ANALYSIS
      const detectedSkills: string[] = [];
      const missingSkills: string[] = [];
  
      CRITICAL_SKILL_CORPUS.forEach((skill) => {
        const regex = new RegExp(`\\b${skill.replace('+', '\\+')}\\b`, 'i');
        if (regex.test(rawText)) {
          detectedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      });
  
      let keywordScore = Math.round((detectedSkills.length / (CRITICAL_SKILL_CORPUS.length * 0.4)) * 100);
      keywordScore = Math.min(100, Math.max(20, keywordScore));
  
      if (detectedSkills.length < 5) {
        deductions.push({
          category: 'Keywords',
          code: 'LOW_SKILL_DENSITY',
          pointsDeducted: 20,
          issue: `Only ${detectedSkills.length} core technical keywords detected.`,
          recommendation: 'Incorporate relevant frameworks, databases, and core language keywords directly into project/experience bullet points.'
        });
      }
  
      // 3. IMPACT & ACTION VERB ANALYSIS
      let actionVerbCount = 0;
      let quantifiableMetricsCount = 0;
      const bullets = rawText.split(/\n+/).filter((line) => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().length > 30);
  
      bullets.forEach((bullet) => {
        const firstWord = bullet.trim().replace(/^[^a-zA-Z]+/, '').split(' ')[0]?.toLowerCase();
        if (firstWord && ACTION_VERBS.has(firstWord)) {
          actionVerbCount++;
        }
        // Check for percentages, dollar amounts, numbers, or scale metrics (e.g., 50%, $10k, 100k requests)
        if (/\b(\d+%\b|\$\d+|\d+x\b|\d+\s*(ms|seconds|users|clients|requests|percent))\b/i.test(bullet)) {
          quantifiableMetricsCount++;
        }
      });
  
      let impactScore = 100;
  
      if (bullets.length > 0 && quantifiableMetricsCount / bullets.length < 0.3) {
        impactScore -= 25;
        deductions.push({
          category: 'Impact',
          code: 'LOW_QUANTIFIABLE_METRICS',
          pointsDeducted: 25,
          issue: 'Fewer than 30% of your bullet points contain measurable metrics or outcomes.',
          recommendation: 'Quantify your impact using numbers, percentages, latency improvements, or revenue generated (e.g., "Reduced page load time by 35%").'
        });
      }
  
      if (actionVerbCount < 4) {
        impactScore -= 15;
        deductions.push({
          category: 'Impact',
          code: 'WEAK_ACTION_VERBS',
          pointsDeducted: 15,
          issue: 'Sparse usage of strong engineering action verbs at the start of bullet points.',
          recommendation: 'Begin bullet points with decisive action verbs like "Architected", "Engineered", "Optimized", or "Spearheaded".'
        });
      }
  
      impactScore = Math.max(0, impactScore);
  
      // 4. FORMATTING & LENGTH ANALYSIS
      let formattingScore = 100;
  
      if (totalWords < 250) {
        formattingScore -= 30;
        deductions.push({
          category: 'Formatting',
          code: 'RESUME_TOO_SHORT',
          pointsDeducted: 30,
          issue: `Total word count (${totalWords}) is significantly below the professional standard (400-800 words).`,
          recommendation: 'Elaborate on technical challenges, architecture decisions, and business impact within your projects and roles.'
        });
      } else if (totalWords > 1000) {
        formattingScore -= 15;
        deductions.push({
          category: 'Formatting',
          code: 'RESUME_TOO_LONG',
          pointsDeducted: 15,
          issue: `Word count (${totalWords}) exceeds optimal length for non-executive candidates.`,
          recommendation: 'Trim legacy experience and keep descriptions tight and metric-driven.'
        });
      }
  
      formattingScore = Math.max(0, formattingScore);
  
      // OVERALL WEIGHTED CALCULATION
      const overallScore = Math.round(
        structureScore * 0.30 +
        keywordScore * 0.30 +
        impactScore * 0.25 +
        formattingScore * 0.15
      );
  
      return {
        overallScore,
        breakdown: {
          structureScore,
          keywordScore,
          formattingScore,
          impactScore
        },
        detectedSkills,
        missingSkills: missingSkills.slice(0, 8),
        deductions,
        metrics: {
          totalWords,
          actionVerbCount,
          quantifiableMetricsCount,
          bulletCount: bullets.length
        }
      };
    }
  
    private static extractSections(text: string) {
      const lines = text.split('\n');
      const sections = {
        experience: '',
        education: '',
        skills: '',
        projects: '',
        summary: ''
      };
  
      let currentSection: keyof typeof sections | null = null;
  
      lines.forEach((line) => {
        const cleanLine = line.trim().toLowerCase();
        if (/^(work\s+experience|experience|employment\s+history)/i.test(cleanLine)) {
          currentSection = 'experience';
        } else if (/^(education|academic\0background)/i.test(cleanLine)) {
          currentSection = 'education';
        } else if (/^(skills|technical\s+skills|competencies)/i.test(cleanLine)) {
          currentSection = 'skills';
        } else if (/^(projects|personal\s+projects)/i.test(cleanLine)) {
          currentSection = 'projects';
        } else if (/^(summary|professional\s+summary|about\s+me)/i.test(cleanLine)) {
          currentSection = 'summary';
        } else if (currentSection) {
          sections[currentSection] += line + '\n';
        }
      });
  
      return sections;
    }
  }