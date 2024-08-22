import { db } from "@/db/drizzle";
import {
  sizes,
  insertSizeSchema,
  insertOrderSchema,
  orders,
  orderItems,
  products,
  images,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import { Hono } from "hono";
import { currentUser } from "@clerk/nextjs/server";

// Define types for Order and OrderItem
type OrderItem = {
  productId: string;
  productName: string;
  size: string | null;
  color: string | null;
  quantity: number | null;
};

// type Order = {
//   id: string;
//   isPaid: boolean | null;
//   phone: string | null;
//   address: string | null;
//   totalAmount: number | null;
//   createdAt: Date | null;
//   products: OrderItem[];
// };

const additionalFieldsSchema = z.object({
  products: z.array(z.string()),
});

const updateOrderSchema = z.object({
  status: z.enum(["Pending", "Processing", "Shipped", "Delivered", "Canceled"]),
});

const app = new Hono()
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertOrderSchema
        .omit({
          id: true,
        })
        .merge(additionalFieldsSchema)
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "unauthorized" }, 401);
      }

      const user = await currentUser();

      const userId = user?.publicMetadata.userId as string;

      const newOrder = await db
        .insert(orders)
        .values({
          id: createId(),
          userId: userId,
          isPaid: values.isPaid,
          phone: values.phone,
          address: values.address,
        })
        .returning();

      const orderId = newOrder[0].id;

      for (const item of values.products) {
        await db.insert(orderItems).values({
          id: createId(),
          orderId,
          productId: item,
        });
      }

      return c.json({ order: newOrder[0] });
    }
  )
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const data = await db
      .select({
        id: orders.id,
        isPaid: orders.isPaid,
        phone: orders.phone,
        address: orders.address,
        status: orders.status,
        trackingNumber: orders.trackingNumber,
        userId: orders.userId,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        products: sql<OrderItem[]>`json_agg(jsonb_build_object(
            'productId', ${orderItems.productId},
            'productName', ${products.name},
            'size', ${orderItems.size},
            'color', ${orderItems.color},
            'quantity', ${orderItems.quantity}
          ))::jsonb`,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .groupBy(orders.id)
      .orderBy(desc(orders.createdAt))
      .execute();

    const ordersWithProducts = data.map((order) => ({
      ...order,
      products: order.products as unknown as OrderItem[],
    }));

    return c.json({ data: ordersWithProducts });
  })
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
        .delete(orders)
        .where(inArray(orders.id, values.ids))
        .returning({
          id: orders.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:orderId/status",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        orderId: z.string().optional(),
      })
    ),
    zValidator("json", updateOrderSchema),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { orderId } = c.req.valid("param");
      const { status } = c.req.valid("json");

      if (!orderId) {
        return c.json({ error: "Missing id" }, 400);
      }

      try {
        await db
          .update(orders)
          .set({
            status,
            trackingNumber: createId(),
            updatedAt: new Date(),
            deliveredAt: status === "Delivered" ? new Date() : null,
            shippedAt: status === "Shipped" ? new Date() : null,
          })
          .where(eq(orders.id, orderId));

        return c.json({ message: "Order status updated successfully" });
      } catch (error) {
        console.error("Error updating order status:", error);
        return c.json({ error: "Failed to update order status" }, 500);
      }
    }
  )
  .get(
    "/:orderId/status",
    zValidator(
      "param",
      z.object({
        orderId: z.string().optional(),
      })
    ),
    async (c) => {
      const { orderId } = c.req.valid("param");

      if (!orderId) {
        return c.json({ error: "Missing id" }, 400);
      }

      try {
        const order = await db
          .select()
          .from(orders)
          .where(eq(orders.id, orderId))
          .orderBy(desc(orders.createdAt))
          .execute();

        if (order.length === 0) {
          return c.json({ error: "Order not found" }, 404);
        }

        return c.json({ data: order[0] });
      } catch (error) {
        console.error("Error retrieving order status:", error);
        return c.json({ error: "Failed to retrieve order status" }, 500);
      }
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
        .delete(orders)
        .where(eq(orders.id, id))
        .returning({
          id: orders.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .get(
    "/:userId/orderItem",
    zValidator(
      "param",
      z.object({
        userId: z.string().optional(),
      })
    ),
    async (c) => {
      const { userId } = c.req.valid("param");

      if (!userId) {
        return c.json({ error: "User ID is required" }, 400);
      }

      try {
        const ordersResult = await db
          .select({
            id: orders.id,
            status: orders.status,
            trackingNumber: orders.trackingNumber,
            userId: orders.userId,
            totalAmount: orders.totalAmount,
            createdAt: orders.createdAt,
            orderItems: sql<OrderItem[]>`json_agg(jsonb_build_object(
              'productId', ${orderItems.productId},
              'productName', ${products.name},
              'size', ${orderItems.size},
              'color', ${orderItems.color},
              'quantity', ${orderItems.quantity},
              'amount', ${orderItems.amount},
              'isReviewed', ${orderItems.isReviewed},
              'image', (
                SELECT ${images.url}
                FROM ${images}
                WHERE ${images.productId} = ${orderItems.productId}
                LIMIT 1
              )
            ))::jsonb`,
          })
          .from(orders)
          .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
          .leftJoin(products, eq(products.id, orderItems.productId))
          .where(eq(orders.userId, userId))
          .groupBy(
            orders.id,
            orders.status,
            orders.trackingNumber,
            orders.userId,
            orders.totalAmount,
            orders.createdAt
          )
          .orderBy(desc(orders.createdAt))
          .execute();

        if (ordersResult.length === 0) {
          return c.json({ error: "Order Items not found" }, 404);
        }

        return c.json({ data: ordersResult });
      } catch (error) {
        console.error("Error retrieving order Items:", error);
        return c.json({ error: "Failed to retrieve order Items" }, 500);
      }
    }
  );

export default app;
