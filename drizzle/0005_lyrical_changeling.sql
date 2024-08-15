ALTER TABLE "products" ALTER COLUMN "quantity" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "quantity" integer DEFAULT 1;