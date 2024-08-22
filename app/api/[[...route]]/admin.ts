import { db } from "@/db/drizzle";
import { admin, insertAdminSchema } from "@/db/schema";
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
        id: admin.id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
      })
      .from(admin);
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
          id: admin.id,
          name: admin.name,
          email: admin.email,
          isAdmin: admin.isAdmin,
        })
        .from(admin)
        .where(eq(admin.id, id))
        .orderBy(desc(admin.createdAt));

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
      insertAdminSchema.pick({
        name: true,
        email: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "unauthorized" }, 401);
      }

      const [data] = await db
        .insert(admin)
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
        .delete(admin)
        .where(inArray(admin.id, values.ids))
        .returning({
          id: admin.id,
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
      insertAdminSchema.pick({
        name: true,
        email: true,
        isAdmin: true,
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
        .update(admin)
        .set(values)
        .where(eq(admin.id, id))
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .patch(
    "/toogle/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertAdminSchema.pick({
        isAdmin: true,
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
        .update(admin)
        .set(values)
        .where(eq(admin.id, id))
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
      const [data] = await db.delete(admin).where(eq(admin.id, id)).returning({
        id: admin.id,
      });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
