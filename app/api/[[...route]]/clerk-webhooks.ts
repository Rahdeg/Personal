import { Hono } from "hono";
import Stripe from "stripe";
import { eq, inArray } from "drizzle-orm";
import { orderItems, orders, products } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { db } from "@/db/drizzle";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const app = new Hono();

app.post("/", async (c) => {
  if (c.req.method !== "POST") {
    c.res.headers.set("Allow", "POST");
    return c.text("Method Not Allowed", 405);
  }

  let buf: Buffer;
  try {
    buf = await getRawBody(c.req.raw);
  } catch (err) {
    console.log(`Error reading request buffer: ${err}`);
    return c.json({ error: "Error reading request buffer" }, 500);
  }

  const signature = c.req.header("stripe-signature");
  if (!signature) {
    console.log("Missing Stripe signature header");
    return c.json({ error: "Missing Stripe signature header" }, 400);
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.log(`❌ Error message: ${errorMessage}`);
    return c.json({ error: `Webhook Error: ${errorMessage}` }, 400);
  }

  console.log("✅ Success:", event.id);

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;
  const addressComponents = [address?.line1, address?.state, address?.country];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    try {
      const updatedOrder = await db
        .update(orders)
        .set({
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || "",
          totalAmount: session.amount_total || 0,
        })
        .where(eq(orders.id, session?.metadata?.orderId!))
        .returning();

      if (!updatedOrder.length) {
        console.log("Order not found or not updated");
        return c.json({ error: "Order not found or not updated" }, 404);
      }

      // const orderItemsResult = await db
      //   .select()
      //   .from(orderItems)
      //   .where(eq(orderItems.orderId, session?.metadata?.orderId!));

      // const productIds = orderItemsResult.map(
      //   (orderItem) => orderItem.productId
      // );

      // await db
      //   .update(products)
      //   .set({ isArchived: true })
      //   .where(inArray(products.id, productIds));

      // Get product IDs and quantities from orderItems
      const productsToUpdate = await db
        .select({
          productId: orderItems.productId,
          quantityOrdered: orderItems.quantity,
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, session?.metadata?.orderId!));

      // Create a map of product IDs to their ordered quantities
      const productQuantitiesMap = new Map<string, number | null>();
      for (const item of productsToUpdate) {
        productQuantitiesMap.set(item.productId, item.quantityOrdered);
      }

      // Convert the keys to an array explicitly
      const productIds = Array.from(productQuantitiesMap.keys());

      // Fetch current quantities for these products
      const currentQuantities = await db
        .select({
          id: products.id,
          quantity: products.quantity,
        })
        .from(products)
        .where(inArray(products.id, productIds));

      // Create a map of product IDs to their current quantities
      const currentQuantitiesMap = new Map<string, number>();
      for (const product of currentQuantities) {
        currentQuantitiesMap.set(product.id, product.quantity);
      }

      // Convert Map to an array of entries
      const productQuantitiesArray = Array.from(productQuantitiesMap.entries());

      const updates = [];
      for (const [productId, orderedQuantity] of productQuantitiesArray) {
        const currentQuantity = currentQuantitiesMap.get(productId) || 0;
        const newQuantity = currentQuantity - orderedQuantity!;

        updates.push({
          id: productId,
          quantity: newQuantity,
          isArchived: newQuantity <= 0,
        });
      }

      // Perform the updates
      for (const update of updates) {
        await db
          .update(products)
          .set({
            quantity: update.quantity,
            isArchived: update.isArchived,
          })
          .where(eq(products.id, update.id));
      }

      console.log("Order and products updated successfully");
    } catch (err) {
      console.log(`Database error: ${err}`);
      return c.json({ error: "Database error" }, 500);
    }
  }

  return c.text("", 200);
});

async function getRawBody(req: Request): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) {
    throw new Error("No request body");
  }

  let result;
  while (!(result = await reader.read()).done) {
    chunks.push(result.value);
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

export default app;
