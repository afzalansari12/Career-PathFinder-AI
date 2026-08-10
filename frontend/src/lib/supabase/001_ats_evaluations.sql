-- Canonical table for ATS results. Both /api/upload and /api/ats/evaluate
-- write here. user_id is Clerk's userId as plain text — NOT a foreign key
-- to a `profiles` table, so this doesn't depend on any Clerk<->Supabase
-- user-sync webhook being set up correctly.
create table if not exists ats_evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  resume_url text,
  target_role text,
  overall_score integer not null,
  breakdown jsonb not null,
  deductions jsonb not null default '[]',
  detected_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  metrics jsonb,
  ai_summary text,
  ai_strengths jsonb,
  ai_improvements jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ats_evaluations_user_id_created_at_idx
  on ats_evaluations (user_id, created_at desc);

-- Storage: also make sure a "resumes" bucket exists under
-- Supabase Dashboard -> Storage -> New Bucket -> name it "resumes".
-- Private is fine; /api/upload uses the service-role key, not client-side
-- access, so no public bucket policy is required for this to work.
