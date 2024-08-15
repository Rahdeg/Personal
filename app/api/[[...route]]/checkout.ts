import { db } from "@/db/drizzle";
import { orders, orderItems, products } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { Hono } from "hono";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      color: z.string().optional(),
      size: z.string().optional(),
      quantity: z.number().optional(),
    })
  ),
});

const app = new Hono().post(
  "/orders",
  clerkMiddleware(),
  zValidator("json", orderSchema),
  async (c) => {
    const values = c.req.valid("json");

    if (!values.items || values.items.length === 0) {
      return c.json({ error: "Product IDs are required" }, 400);
    }

    const user = await currentUser();

    const userId = user?.publicMetadata.userId as string;

    const newOrder = await db
      .insert(orders)
      .values({
        id: createId(),
        userId: userId,
        isPaid: false,
        phone: "",
        address: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const orderId = newOrder[0].id;

    const productItems = [];

    for (const item of values.items) {
      const productResult = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.sellingPrice,
        })
        .from(products)
        .where(eq(products.id, item.productId))
        .execute();

      if (productResult.length === 0) {
        return c.json(
          { error: `Product with ID ${item.productId} not found` },
          404
        );
      }

      const product = productResult[0];
      const modifiedProduct = { ...product, quantity: item.quantity || 1 };

      productItems.push(modifiedProduct);

      await db.insert(orderItems).values({
        id: createId(),
        orderId,
        productId: item.productId,
        amount: productResult[0].price * modifiedProduct.quantity,
        color: item.color || "",
        size: item.size || "",
        quantity: item.quantity || 1,
      });
    }

    const line_items = productItems.map((product) => ({
      quantity: product.quantity,
      price_data: {
        currency: "NGN",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
      metadata: {
        orderId,
      },
    });

    return c.json({ url: session.url });
  }
);

export default app;
