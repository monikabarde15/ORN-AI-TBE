ALTER TABLE "candidates" ADD COLUMN "candidate_code" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "candidate_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "candidate_code";--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_candidate_code_unique" UNIQUE("candidate_code");