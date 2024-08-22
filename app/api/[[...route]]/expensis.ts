import { db } from "@/db/drizzle";
import { expensis, insertExpensisSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import { Hono } from "hono";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    // const auth = getAuth(c);

    // if (!auth?.userId) {
    //   return c.json({ error: "unauthorized" }, 401);
    // }

    const data = await db
      .select({
        id: expensis.id,
        name: expensis.name,
        amount: expensis.amount,
      })
      .from(expensis)
      .orderBy(desc(expensis.createdAt));
    return c.json({ data });
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      // const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      // if (!auth?.userId) {
      //   return c.json({ error: "Unauthorized" }, 401);
      // }
      const [data] = await db
        .select({
          id: expensis.id,
          name: expensis.name,
          amount: expensis.amount,
        })
        .from(expensis)
        .where(eq(expensis.id, id));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertExpensisSchema.pick({
        name: true,
        amount: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "unauthorized" }, 401);
      }

      const [data] = await db
        .insert(expensis)
        .values({
          id: createId(),
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .delete(expensis)
        .where(inArray(expensis.id, values.ids))
        .returning({
          id: expensis.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertExpensisSchema.pick({
        name: true,
        amount: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .update(expensis)
        .set(values)
        .where(eq(expensis.id, id))
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing Id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "unAuthorized" }, 401);
      }
      const [data] = await db
        .delete(expensis)
        .where(eq(expensis.id, id))
        .returning({
          id: expensis.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
