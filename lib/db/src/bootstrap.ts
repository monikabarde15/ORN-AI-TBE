import { sql } from "drizzle-orm";
import { db } from "./index";

/**
 * Idempotently create the database schema.
 *
 * This is intentionally not a migration runner — the schema is small and
 * stable, and using `CREATE TABLE IF NOT EXISTS` lets the bundled API server
 * start cleanly on a fresh database (e.g. a freshly provisioned Render
 * Postgres add-on) without shipping a migrations folder or drizzle-kit at
 * runtime. If the schema grows, replace this with `drizzle-kit migrate`.
 */
export async function ensureSchema(): Promise<void> {
  try {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  } catch (err: any) {
    console.warn("pgcrypto extension check skipped:", err?.message || err);
  }

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS candidates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      country text NOT NULL,
      target_role text NOT NULL,
      years_experience integer NOT NULL,
      visa_status text NOT NULL,
      english_level text NOT NULL,
      eu_work_eligible boolean NOT NULL,
      linkedin_url text NOT NULL,
      avatar_url text NOT NULL,
      skills text[] NOT NULL DEFAULT '{}',
      cv jsonb,
      evaluation jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS activity (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      kind text NOT NULL,
      candidate_name text NOT NULL,
      country text NOT NULL,
      message text NOT NULL,
      timestamp timestamptz NOT NULL DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS training_assignments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      candidate_id uuid NOT NULL,
      assessment_category text NOT NULL,
      training_type text NOT NULL,
      program_id text NOT NULL,
      program_name text NOT NULL,
      recommended_path text NOT NULL,
      delivery_mode text NOT NULL DEFAULT 'hybrid',
      trainer_id text NOT NULL,
      trainer_name text NOT NULL,
      modules jsonb NOT NULL,
      live_sessions jsonb NOT NULL,
      start_date timestamptz NOT NULL,
      target_completion_date timestamptz NOT NULL,
      status text NOT NULL DEFAULT 'not_started',
      progress_pct integer NOT NULL DEFAULT 0,
      final_readiness_note text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS training_assignments_candidate_id_idx
      ON training_assignments (candidate_id);
  `);

  // ---- Candidate column additions for the talent transformation engine ----
  // Each ALTER is wrapped in an IF NOT EXISTS so reboots are idempotent.

 await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS current_location text NOT NULL DEFAULT '';
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS current_job_role text NOT NULL DEFAULT '';
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS preferred_role text NOT NULL DEFAULT '';
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS candidate_code text;
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS city text;
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS expected_salary text;
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS availability text;
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS notice_period text;
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS career_preference text[] NOT NULL DEFAULT '{}';
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS preferred_work_mode text[] NOT NULL DEFAULT '{}';
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS interested_skills text[] NOT NULL DEFAULT '{}';
`));

await db.execute(sql.raw(`
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS languages_known text[] NOT NULL DEFAULT '{}';
`));

  await db.execute(sql`ALTER TABLE candidates

    ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'direct',
    ADD COLUMN IF NOT EXISTS last_role text,
    ADD COLUMN IF NOT EXISTS domain text,
    ADD COLUMN IF NOT EXISTS career_gap_months integer NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_shortlisted boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_client_ready boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_industry_ready boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS owner_recruiter_id uuid,
    ADD COLUMN IF NOT EXISTS cv_file_bytes bytea,
    ADD COLUMN IF NOT EXISTS cv_file_name text,
    ADD COLUMN IF NOT EXISTS cv_mime_type text;`);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      full_name text NOT NULL,
      role text NOT NULL,
      candidate_id uuid,
      gdpr_consent_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS users_email_idx ON users (lower(email));
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      candidate_id uuid NOT NULL,
      name text NOT NULL,
      tech_stack text[] NOT NULL DEFAULT '{}',
      duration_weeks integer NOT NULL,
      status text NOT NULL DEFAULT 'in_progress',
      feedback text,
      start_date timestamptz NOT NULL,
      end_date timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS projects_candidate_id_idx ON projects (candidate_id);
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      actor_user_id uuid,
      actor_email text,
      actor_role text,
      action text NOT NULL,
      entity_type text,
      entity_id text,
      metadata jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx
      ON audit_logs (created_at DESC);
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_course_progress (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id text NOT NULL,
      course_id text NOT NULL,
      completed_lessons jsonb NOT NULL DEFAULT '{}'::jsonb,
      completed_quizzes jsonb NOT NULL DEFAULT '{}'::jsonb,
      lesson_positions jsonb NOT NULL DEFAULT '{}'::jsonb,
      last_active_lesson_id text,
      last_content_mode text,
      final_assessment jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS assignments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      description text,
      course_id uuid,
      course_name text,
      candidate_id uuid,
      target_role text,
      category text,
      difficulty text NOT NULL DEFAULT 'Medium',
      total_marks integer NOT NULL DEFAULT 100,
      passing_marks integer NOT NULL DEFAULT 70,
      due_date timestamptz,
      instructions text,
      status text NOT NULL DEFAULT 'Published',
      questions jsonb,
      attachments jsonb,
      created_by uuid,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS assignments_course_id_idx ON assignments (course_id);
  `);
}

