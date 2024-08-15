ALTER TABLE "orders" ALTER COLUMN "tracking_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipped_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "delivered_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sizes" DROP COLUMN IF EXISTS "clerk_id";