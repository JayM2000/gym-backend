CREATE TABLE "trainers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"specialization" text NOT NULL,
	"experience" text NOT NULL,
	"bio" text NOT NULL
);
--> statement-breakpoint