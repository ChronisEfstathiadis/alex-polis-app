CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"image_url" text,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
