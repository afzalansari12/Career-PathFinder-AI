
export function extractSkills(text: string) {
    return MASTER_SKILLS.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase())
    );
  }

export const MASTER_SKILLS = [
    "C++",
    "Java",
    "Python",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Git",
    "Linux",
    "TypeScript",
    "JavaScript"
  ];