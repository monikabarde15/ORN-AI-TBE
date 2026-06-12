CREATE TABLE "learning_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"thumbnail" text,
	"intro_video" text,
	"payment_link" text,
	"course_ids" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
