-- Migration: add city, interested_skills, and convert career_preference/preferred_work_mode to text[]

BEGIN;

-- Add city column if missing
ALTER TABLE IF EXISTS public.candidates
  ADD COLUMN IF NOT EXISTS city text;

-- Add interested_skills array column if missing
ALTER TABLE IF EXISTS public.candidates
  ADD COLUMN IF NOT EXISTS interested_skills text[] DEFAULT ARRAY[]::text[];

-- Ensure career_preference exists; if it's text, convert to text[] safely
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'candidates' AND column_name = 'career_preference') THEN
    -- Alter type to text[] using a safe expression
    BEGIN
      ALTER TABLE public.candidates
        ALTER COLUMN career_preference TYPE text[]
        USING (CASE WHEN career_preference IS NULL THEN ARRAY[]::text[] ELSE ARRAY[career_preference] END);
    EXCEPTION WHEN undefined_function OR invalid_text_representation THEN
      -- fallback: create temp column, copy values, drop original, rename
      ALTER TABLE public.candidates ADD COLUMN career_preference_tmp text[] DEFAULT ARRAY[]::text[];
      UPDATE public.candidates SET career_preference_tmp = CASE WHEN career_preference IS NULL THEN ARRAY[]::text[] ELSE ARRAY[career_preference] END;
      ALTER TABLE public.candidates DROP COLUMN career_preference;
      ALTER TABLE public.candidates RENAME COLUMN career_preference_tmp TO career_preference;
    END;
    ALTER TABLE public.candidates ALTER COLUMN career_preference SET DEFAULT ARRAY[]::text[];
  END IF;
END$$;

-- Convert preferred_work_mode to text[] similarly
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'candidates' AND column_name = 'preferred_work_mode') THEN
    BEGIN
      ALTER TABLE public.candidates
        ALTER COLUMN preferred_work_mode TYPE text[]
        USING (CASE WHEN preferred_work_mode IS NULL THEN ARRAY[]::text[] ELSE ARRAY[preferred_work_mode] END);
    EXCEPTION WHEN undefined_function OR invalid_text_representation THEN
      ALTER TABLE public.candidates ADD COLUMN preferred_work_mode_tmp text[] DEFAULT ARRAY[]::text[];
      UPDATE public.candidates SET preferred_work_mode_tmp = CASE WHEN preferred_work_mode IS NULL THEN ARRAY[]::text[] ELSE ARRAY[preferred_work_mode] END;
      ALTER TABLE public.candidates DROP COLUMN preferred_work_mode;
      ALTER TABLE public.candidates RENAME COLUMN preferred_work_mode_tmp TO preferred_work_mode;
    END;
    ALTER TABLE public.candidates ALTER COLUMN preferred_work_mode SET DEFAULT ARRAY[]::text[];
  END IF;
END$$;

COMMIT;
