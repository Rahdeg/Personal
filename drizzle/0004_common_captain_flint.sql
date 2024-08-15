CREATE TABLE IF NOT EXISTS "admin" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"isAdmin" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expensis" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "selling_price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "cost_price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "quantity" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "price";