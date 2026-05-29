CREATE TABLE "activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"candidate_name" text NOT NULL,
	"country" text NOT NULL,
	"message" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"actor_email" text,
	"actor_role" text,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"country" text NOT NULL,
	"target_role" text NOT NULL,
	"years_experience" integer NOT NULL,
	"visa_status" text NOT NULL,
	"english_level" text NOT NULL,
	"eu_work_eligible" boolean NOT NULL,
	"linkedin_url" text NOT NULL,
	"avatar_url" text NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"cv" jsonb,
	"cv_file_bytes" "bytea",
	"cv_file_name" text,
	"cv_mime_type" text,
	"evaluation" jsonb,
	"source" text DEFAULT 'direct' NOT NULL,
	"last_role" text,
	"domain" text,
	"career_gap_months" integer DEFAULT 0 NOT NULL,
	"is_shortlisted" boolean DEFAULT false NOT NULL,
	"is_client_ready" boolean DEFAULT false NOT NULL,
	"is_industry_ready" boolean DEFAULT false NOT NULL,
	"owner_recruiter_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text NOT NULL,
	"category" text,
	"difficulty" text,
	"duration" text,
	"instructor" text,
	"subscription_name" text,
	"price" text,
	"thumbnail" text,
	"promotional_video" text,
	"ebook" text,
	"status" text DEFAULT 'Draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"section_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sub_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"time_duration" text,
	"video_url" text,
	"pdf_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"assessment_category" text NOT NULL,
	"training_type" text NOT NULL,
	"program_id" text NOT NULL,
	"program_name" text NOT NULL,
	"recommended_path" text NOT NULL,
	"delivery_mode" text DEFAULT 'hybrid' NOT NULL,
	"trainer_id" text NOT NULL,
	"trainer_name" text NOT NULL,
	"modules" jsonb NOT NULL,
	"live_sessions" jsonb NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"target_completion_date" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"progress_pct" integer DEFAULT 0 NOT NULL,
	"final_readiness_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"role" text NOT NULL,
	"candidate_id" uuid,
	"gdpr_consent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"name" text NOT NULL,
	"tech_stack" text[] DEFAULT '{}' NOT NULL,
	"duration_weeks" integer NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"feedback" text,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
