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
  // `gen_random_uuid()` ships in pgcrypto. Replit's built-in Postgres has it
  // pre-enabled, but a freshly provisioned Render Postgres may not, so we
  // ensure the extension exists before referencing the function.
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

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
}
