CREATE TABLE "learning_path_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"learning_path_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"user_name" text,
	"user_email" text,
	"status" text DEFAULT 'joined' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
