ALTER TABLE "users" ADD COLUMN "email_otp" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_otp_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_email_verified" boolean DEFAULT false;