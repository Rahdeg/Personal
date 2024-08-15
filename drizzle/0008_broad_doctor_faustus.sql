DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "total_amount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "status" "status" DEFAULT 'Pending';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tracking_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipped_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "delivered_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "totalAmount";