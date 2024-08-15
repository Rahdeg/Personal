ALTER TABLE "products" ALTER COLUMN "quantity" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "pQuantity" integer DEFAULT 1 NOT NULL;