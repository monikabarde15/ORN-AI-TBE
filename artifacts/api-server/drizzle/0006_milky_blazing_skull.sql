CREATE TABLE "live_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" text NOT NULL,
	"payment_id" text NOT NULL,
	"student_name" text,
	"student_email" text,
	"student_phone" text,
	"session_title" text NOT NULL,
	"trainer_name" text,
	"meeting_link" text,
	"session_date" text,
	"start_time" text,
	"end_time" text,
	"description" text,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
