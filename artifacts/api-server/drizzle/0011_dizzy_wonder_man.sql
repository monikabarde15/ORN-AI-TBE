CREATE TABLE "course_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"status" text DEFAULT 'Active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "session_title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "status" SET DEFAULT 'scheduled';--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "live_sessions" ADD COLUMN "course_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "live_sessions" ADD COLUMN "payment_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "live_sessions" ADD COLUMN "student_name" text;--> statement-breakpoint
ALTER TABLE "live_sessions" ADD COLUMN "student_email" text;--> statement-breakpoint
ALTER TABLE "live_sessions" ADD COLUMN "student_phone" text;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD COLUMN "is_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "live_sessions" DROP COLUMN "learning_path_id";