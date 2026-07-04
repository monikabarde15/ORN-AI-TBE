ALTER TABLE "candidates" ADD COLUMN "current_job_role" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_links" ADD COLUMN "learning_path_id" uuid;--> statement-breakpoint
ALTER TABLE "candidates" DROP COLUMN "current_role";