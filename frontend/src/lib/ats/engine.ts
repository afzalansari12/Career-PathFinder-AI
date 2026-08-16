// frontend/src/lib/ats/engine.ts
//
// Deterministic, rule-based ATS scoring with Job Description matching.

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
  category: "Structure" | "Keywords" | "Impact" | "Formatting";
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
  jobDescriptionSkills?: string[];
  deductions: ATSDeduction[];
  metrics: {
    totalWords: number;
    actionVerbCount: number;
    quantifiableMetricsCount: number;
    bulletCount: number;
  };
}

// Master tech corpus used to extract skills from Job Descriptions and Resumes
const CRITICAL_SKILL_CORPUS = [
  "TypeScript", "JavaScript", "React", "React.js", "Next.js", "Node.js", "Python",
  "PostgreSQL", "SQL", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "REST API", "REST APIs",
  "GraphQL", "Git", "CI/CD", "Redis", "Microservices", "System Design",
  "Tailwind CSS", "Java", "C++", "Go", "Golang", "Kafka", "RabbitMQ", "PyTorch", "TensorFlow",
  "LLMs", "RAG", "Vector Databases", "Pinecone", "MongoDB", "Express", "FastAPI",
  "Linux", "Terraform", "Agile", "Scrum",
];

const ACTION_VERBS = new Set([
  "architected", "built", "spearheaded", "optimized", "scaled", "implemented",
  "deployed", "designed", "engineered", "led", "reduced", "increased",
  "automated", "refactored", "integrated", "developed", "established", "created",
]);

export class DeterministicATSEngine {
  /** Evaluates raw resume text against a specific Job Description. */
  public static evaluate(
    rawText: string,
    jobDescription: string = ""
  ): ATSEvaluationResult {
    const deductions: ATSDeduction[] = [];
    const words = rawText.trim().split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    // 1. SECTION DETECTION
    const sections = this.extractSections(rawText);
    let structureScore = 100;

    if (!sections.experience) {
      structureScore -= 30;
      deductions.push({
        category: "Structure",
        code: "MISSING_EXPERIENCE_SECTION",
        pointsDeducted: 30,
        issue: "No clear Work Experience section header detected.",
        recommendation: 'Use a standard heading such as "Work Experience" or "Professional Experience".',
      });
    }

    if (!sections.skills) {
      structureScore -= 25;
      deductions.push({
        category: "Structure",
        code: "MISSING_SKILLS_SECTION",
        pointsDeducted: 25,
        issue: "No dedicated Skills section heading detected.",
        recommendation: 'Add a distinct "Skills" section listing technical proficiencies.',
      });
    }

    if (!sections.education) {
      structureScore -= 20;
      deductions.push({
        category: "Structure",
        code: "MISSING_EDUCATION_SECTION",
        pointsDeducted: 20,
        issue: "No Education section heading detected.",
        recommendation: 'Add an "Education" header listing degree, institution, and graduation year.',
      });
    }

    structureScore = Math.max(0, structureScore);

    // 2. KEYWORD & JOB DESCRIPTION MATCHING ANALYSIS
    const detectedSkills: string[] = [];
    const missingSkills: string[] = [];
    let jdRequiredSkills: string[] = [];

    // Extract tech skills explicitly required in the provided Job Description
    if (jobDescription && jobDescription.trim().length > 0) {
      CRITICAL_SKILL_CORPUS.forEach((skill) => {
        const regex = new RegExp(`\\b${skill.replace("+", "\\+")}\\b`, "i");
        if (regex.test(jobDescription)) {
          jdRequiredSkills.push(skill);
        }
      });

      // If no tech corpus matched in custom text, extract capitalized keywords from JD
      if (jdRequiredSkills.length < 3) {
        const jdWords = jobDescription.match(/\b[A-[Z][a-zA-Z0-9+#.]{2,}\b/g) || [];
        const uniqueJdWords = Array.from(new Set(jdWords)).filter((w) => w.length > 2);
        jdRequiredSkills = Array.from(new Set([...jdRequiredSkills, ...uniqueJdWords.slice(0, 10)]));
      }
    } else {
      // Fallback corpus if no job description provided
      jdRequiredSkills = CRITICAL_SKILL_CORPUS.slice(0, 10);
    }

    // Compare Candidate Resume against Job Description Required Skills
    jdRequiredSkills.forEach((skill) => {
      const regex = new RegExp(`\\b${skill.replace("+", "\\+")}\\b`, "i");
      if (regex.test(rawText)) {
        if (!detectedSkills.includes(skill)) detectedSkills.push(skill);
      } else {
        if (!missingSkills.includes(skill)) missingSkills.push(skill);
      }
    });

    // Also extract any additional known tech skills present in the resume
    CRITICAL_SKILL_CORPUS.forEach((skill) => {
      const regex = new RegExp(`\\b${skill.replace("+", "\\+")}\\b`, "i");
      if (regex.test(rawText) && !detectedSkills.includes(skill)) {
        detectedSkills.push(skill);
      }
    });

    const totalTargetSkills = Math.max(1, jdRequiredSkills.length);
    let keywordScore = Math.round((detectedSkills.length / totalTargetSkills) * 100);
    keywordScore = Math.min(100, Math.max(0, keywordScore));

    if (missingSkills.length > 0) {
      deductions.push({
        category: "Keywords",
        code: "MISSING_JD_KEYWORDS",
        pointsDeducted: Math.min(25, missingSkills.length * 5),
        issue: `Missing ${missingSkills.length} critical skills required by the Job Description: ${missingSkills.slice(0, 4).join(", ")}.`,
        recommendation:
          "Integrate missing Job Description keywords directly into your work experience bullet points and skills summary.",
      });
    }

    // 3. IMPACT & ACTION VERB ANALYSIS
    let actionVerbCount = 0;
    let quantifiableMetricsCount = 0;
    const bullets = rawText
      .split(/\n+/)
      .filter((line) => {
        const trimmed = line.trim();
        return trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*");
      });

    bullets.forEach((bullet) => {
      const firstWord = bullet.trim().replace(/^[^a-zA-Z]+/, "").split(" ")[0]?.toLowerCase();
      if (firstWord && ACTION_VERBS.has(firstWord)) {
        actionVerbCount++;
      }
      if (/(\d+(\.\d+)?%|\$\d+(\.\d+)?[km]?\b|\d+x\b|\d+k?\+?\s*(ms|seconds|users|clients|requests|records|percent))/i.test(bullet)) {
        quantifiableMetricsCount++;
      }
    });

    let impactScore = 100;

    if (bullets.length > 0 && quantifiableMetricsCount / bullets.length < 0.3) {
      impactScore -= 25;
      deductions.push({
        category: "Impact",
        code: "LOW_QUANTIFIABLE_METRICS",
        pointsDeducted: 25,
        issue: "Fewer than 30% of your bullet points contain measurable metrics or outcomes.",
        recommendation:
          'Quantify your impact using numbers, percentages, or performance gains (e.g., "Optimized database query latency by 45%").',
      });
    } else if (bullets.length === 0) {
      impactScore -= 40;
      deductions.push({
        category: "Impact",
        code: "NO_BULLET_POINTS",
        pointsDeducted: 40,
        issue: "No bullet points detected in Experience/Projects section.",
        recommendation: "Convert Experience descriptions into bullet points starting with strong action verbs.",
      });
    }

    if (actionVerbCount < 4) {
      impactScore -= 15;
      deductions.push({
        category: "Impact",
        code: "WEAK_ACTION_VERBS",
        pointsDeducted: 15,
        issue: "Sparse usage of strong engineering action verbs at the start of bullet points.",
        recommendation:
          'Begin bullet points with decisive action verbs like "Architected", "Engineered", "Optimized", or "Spearheaded".',
      });
    }

    impactScore = Math.max(0, impactScore);

    // 4. FORMATTING & LENGTH ANALYSIS
    let formattingScore = 100;

    if (totalWords < 250) {
      formattingScore -= 30;
      deductions.push({
        category: "Formatting",
        code: "RESUME_TOO_SHORT",
        pointsDeducted: 30,
        issue: `Total word count (${totalWords}) is significantly below professional standard (400-800 words).`,
        recommendation: "Elaborate on technical challenges and architecture decisions within your roles.",
      });
    } else if (totalWords > 1000) {
      formattingScore -= 15;
      deductions.push({
        category: "Formatting",
        code: "RESUME_TOO_LONG",
        pointsDeducted: 15,
        issue: `Word count (${totalWords}) exceeds optimal length for non-executive candidates.`,
        recommendation: "Trim legacy experience and keep descriptions tight and metric-driven.",
      });
    }

    formattingScore = Math.max(0, formattingScore);

    // OVERALL WEIGHTED CALCULATION
    const overallScore = Math.round(
      structureScore * 0.25 + keywordScore * 0.4 + impactScore * 0.2 + formattingScore * 0.15
    );

    return {
      overallScore,
      breakdown: { structureScore, keywordScore, formattingScore, impactScore },
      detectedSkills,
      missingSkills: missingSkills.slice(0, 10),
      jobDescriptionSkills: jdRequiredSkills,
      deductions,
      metrics: {
        totalWords,
        actionVerbCount,
        quantifiableMetricsCount,
        bulletCount: bullets.length,
      },
    };
  }

  private static extractSections(text: string) {
    const lines = text.split("\n");
    const sections = {
      experience: "",
      education: "",
      skills: "",
      projects: "",
      summary: "",
    };

    let currentSection: keyof typeof sections | null = null;

    lines.forEach((line) => {
      const cleanLine = line.trim().toLowerCase();
      if (/^(work\s+experience|experience|employment\s+history)/i.test(cleanLine)) {
        currentSection = "experience";
      } else if (/^(education|academic\s+background)/i.test(cleanLine)) {
        currentSection = "education";
      } else if (/^(skills|technical\s+skills|competencies)/i.test(cleanLine)) {
        currentSection = "skills";
      } else if (/^(projects|personal\s+projects)/i.test(cleanLine)) {
        currentSection = "projects";
      } else if (/^(summary|professional\s+summary|about\s+me)/i.test(cleanLine)) {
        currentSection = "summary";
      } else if (currentSection) {
        sections[currentSection] += line + "\n";
      }
    });

    return sections;
  }
}