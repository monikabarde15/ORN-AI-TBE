ALTER TABLE "live_sessions" ALTER COLUMN "session_title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "live_sessions" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "live_sessions" ADD COLUMN "learning_path_id" text;--> statement-breakpoint
ALTER TABLE "live_sessions" DROP COLUMN "course_id";--> statement-breakpoint
ALTER TABLE "live_sessions" DROP COLUMN "payment_id";--> statement-breakpoint
ALTER TABLE "live_sessions" DROP COLUMN "student_name";--> statement-breakpoint
ALTER TABLE "live_sessions" DROP COLUMN "student_email";--> statement-breakpoint
ALTER TABLE "live_sessions" DROP COLUMN "student_phone";