import { z } from 'zod';

export const GroqExtractionSchema = z.object({
  candidateName: z.string().nullable(),
  contactInfo: z.object({
    email: z.string().nullable(),
    phone: z.string().nullable(),
    linkedInUrl: z.string().nullable(),
    githubUrl: z.string().nullable(),
    portfolioUrl: z.string().nullable(),
    location: z.object({
      city: z.string().nullable(),
      state: z.string().nullable(),
      country: z.string().nullable(),
      raw: z.string().nullable(),
    }),
  }),
  workExperience: z.array(
    z.object({
      company: z.string().nullable(),
      roleTitle: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      isCurrent: z.boolean(),
      bulletPoints: z.array(z.string()),
      quantifiedImpactScore: z.number().min(0).max(100),
      actionVerbsUsed: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string().nullable(),
      degree: z.string().nullable(),
      fieldOfStudy: z.string().nullable(),
      graduationYear: z.string().nullable(),
      gpa: z.string().nullable(),
    })
  ),
  projects: z.array(
    z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      technologiesUsed: z.array(z.string()),
      liveUrl: z.string().nullable(),
    })
  ),
  skills: z.object({
    hardSkills: z.array(z.string()),
    softSkills: z.array(z.string()),
    toolsAndFrameworks: z.array(z.string()),
    embeddedInExperience: z.array(z.string()),
  }),
});

export type ExtractedResumeData = z.infer<typeof GroqExtractionSchema>;