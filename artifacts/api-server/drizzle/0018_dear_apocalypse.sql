ALTER TABLE "candidates" ADD COLUMN "expected_salary" text;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "availability" text;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "notice_period" text;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "career_preference" text;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "preferred_work_mode" text;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "languages_known" text[] DEFAULT '{}';