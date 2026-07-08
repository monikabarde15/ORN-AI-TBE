ALTER TABLE "users" ADD COLUMN "candidate_code" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_employee_id_unique" UNIQUE("employee_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_candidate_code_unique" UNIQUE("candidate_code");