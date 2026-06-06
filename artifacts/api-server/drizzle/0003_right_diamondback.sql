ALTER TABLE "blogs" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "category" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "updated_at" DROP NOT NULL;