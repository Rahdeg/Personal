import { db } from "@/db/drizzle";
import {
  sizes,
  insertSizeSchema,
  orderItems,
  orders,
  reviews,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import { Hono } from "hono";

const app = new Hono()
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        productId: z.string(),
        userId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      })
    ),
    async (c) => {
      const { productId, rating, comment, userId } = c.req.valid("json");
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Insert the review
      await db.insert(reviews).values({
        id: createId(),
        productId,
        userId,
        rating,
        comment: comment || "",
        createdAt: new Date(),
      });

      await db
        .update(orderItems)
        .set({
          isReviewed: true,
        })
        .where(eq(orderItems.productId, productId));

      return c.json({ success: true });
    }
  )
  .get(
    "/:productId/ratings",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        productId: z.string().optional(),
      })
    ),
    async (c) => {
      const { productId } = c.req.valid("param");

      if (!productId) {
        return c.json({ error: "Missing Id" }, 400);
      }

      const averageRating = await db
        .select({
          avgRating: sql<number>`AVG(rating)`.as("average_rating"),
          totalReviews: sql<number>`COUNT(id)`.as("total_reviews"),
        })
        .from(reviews)
        .where(eq(reviews.productId, productId))
        .orderBy(desc(reviews.createdAt))
        .execute();

      if (averageRating.length === 0) {
        return c.json({ averageRating: 0, totalReviews: 0 });
      }

      return c.json(averageRating[0]);
    }
  );

export default app;
