ALTER TABLE "candidates" ALTER COLUMN "career_preference" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "candidates" ALTER COLUMN "career_preference" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "candidates" ALTER COLUMN "preferred_work_mode" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "candidates" ALTER COLUMN "preferred_work_mode" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "interested_skills" text[] DEFAULT '{}';