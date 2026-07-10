CREATE TABLE "assessment_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"question" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_answer" integer DEFAULT 0 NOT NULL,
	"explanation" text,
	"difficulty" text DEFAULT 'Easy' NOT NULL,
	"marks" integer DEFAULT 1 NOT NULL,
	"time_limit_seconds" integer DEFAULT 60 NOT NULL,
	"status" text DEFAULT 'Draft' NOT NULL,
	"order_no" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_name" text NOT NULL,
	"target_role" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" text DEFAULT 'Easy' NOT NULL,
	"passing_percentage" integer DEFAULT 70 NOT NULL,
	"duration_minutes" integer DEFAULT 45 NOT NULL,
	"instructions" text,
	"description" text,
	"status" text DEFAULT 'Draft' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
