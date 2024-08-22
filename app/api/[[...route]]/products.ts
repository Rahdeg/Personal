import { db } from "@/db/drizzle";
import {
  products,
  insertProductSchema,
  productSizes,
  productColors,
  images,
  categories,
  sizes,
  colors,
  reviews,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

const additionalFieldsSchema = z.object({
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  images: z.object({ url: z.string() }).array().nonempty("image is required"),
});

const extendedProductSchema = insertProductSchema
  .pick({
    name: true,
    categoryId: true,
    costPrice: true,
    sellingPrice: true,
    quantity: true,
    isFeatured: true,
    isArchived: true,
  })
  .merge(additionalFieldsSchema);

import { Hono } from "hono";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        categoryId: z.string().optional(),
        isFeatured: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const { categoryId, isFeatured } = c.req.valid("query");

      // Convert isFeatured to boolean if it is present
      // const isFeaturedFilter = isFeatured === "true" ? true : undefined;

      const data = await db
        .select({
          id: products.id,
          name: products.name,
          categoryId: products.categoryId,
          categoryName: categories.name,
          costPrice: products.costPrice,
          sellingPrice: products.sellingPrice,
          quantity: products.quantity,
          isFeatured: products.isFeatured,
          isArchived: products.isArchived,
          createdAt: products.createdAt,
          averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
          sizes: sql<string[]>`array_agg(distinct ${sizes.value})`,
          colors: sql<string[]>`array_agg(distinct ${colors.value})`,
          images: sql<string[]>`array_agg(distinct ${images.url})`,
        })
        .from(products)
        .where(
          and(
            categoryId ? eq(products.categoryId, categoryId) : undefined,
            isFeatured ? eq(products.isFeatured, true) : undefined,
            eq(products.isArchived, false)
          )
        )
        .leftJoin(categories, eq(categories.id, products.categoryId))
        .leftJoin(reviews, eq(reviews.productId, products.id))
        .leftJoin(productSizes, eq(productSizes.productId, products.id))
        .leftJoin(sizes, eq(sizes.id, productSizes.sizeId))
        .leftJoin(productColors, eq(productColors.productId, products.id))
        .leftJoin(colors, eq(colors.id, productColors.colorId))
        .leftJoin(images, eq(images.productId, products.id))
        .groupBy(
          products.id,
          categories.id,
          products.name,
          products.quantity,
          products.categoryId,
          categories.name,
          products.costPrice,
          products.sellingPrice,
          products.isFeatured,
          products.isArchived,
          products.createdAt
        )
        .orderBy(desc(products.createdAt))
        .execute();

      const productsWithDetails = data.map((product) => ({
        ...product,
        sizes: product.sizes as unknown as string[],
        colors: product.colors as unknown as string[],
        images: product.images as unknown as string[],
      }));

      return c.json({ data: productsWithDetails });
    }
  )
  .get(
    "/manage",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        categoryId: z.string().optional(),
        isFeatured: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const data = await db
        .select({
          id: products.id,
          name: products.name,
          categoryId: products.categoryId,
          categoryName: categories.name,
          costPrice: products.costPrice,
          sellingPrice: products.sellingPrice,
          quantity: products.quantity,
          isFeatured: products.isFeatured,
          isArchived: products.isArchived,
          createdAt: products.createdAt,
          sizes: sql<string[]>`array_agg(distinct ${sizes.value})`,
          colors: sql<string[]>`array_agg(distinct ${colors.value})`,
          images: sql<string[]>`array_agg(distinct ${images.url})`,
        })
        .from(products)
        .leftJoin(categories, eq(categories.id, products.categoryId))
        .leftJoin(productSizes, eq(productSizes.productId, products.id))
        .leftJoin(sizes, eq(sizes.id, productSizes.sizeId))
        .leftJoin(productColors, eq(productColors.productId, products.id))
        .leftJoin(colors, eq(colors.id, productColors.colorId))
        .leftJoin(images, eq(images.productId, products.id))
        .groupBy(
          products.id,
          categories.id,
          products.name,
          products.quantity,
          products.categoryId,
          categories.name,
          products.costPrice,
          products.sellingPrice,
          products.isFeatured,
          products.isArchived,
          products.createdAt
        )
        .orderBy(desc(products.createdAt))
        .execute();

      const productsWithDetails = data.map((product) => ({
        ...product,
        sizes: product.sizes as unknown as string[],
        colors: product.colors as unknown as string[],
        images: product.images as unknown as string[],
      }));

      return c.json({ data: productsWithDetails });
    }
  )
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
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .select({
          id: products.id,
          name: products.name,
          categoryId: products.categoryId,
          costPrice: products.costPrice,
          sellingPrice: products.sellingPrice,
          quantity: products.quantity,
          isFeatured: products.isFeatured,
          isArchived: products.isArchived,
          createdAt: products.createdAt,
          sizes: sql<string[]>`array_agg(distinct ${sizes.value})`,
          colors: sql<string[]>`array_agg(distinct ${colors.value})`,
          images: sql<string[]>`array_agg(distinct ${images.url})`,
        })
        .from(products)
        .leftJoin(categories, eq(categories.id, products.categoryId))
        .leftJoin(productSizes, eq(productSizes.productId, products.id))
        .leftJoin(sizes, eq(sizes.id, productSizes.sizeId))
        .leftJoin(productColors, eq(productColors.productId, products.id))
        .leftJoin(colors, eq(colors.id, productColors.colorId))
        .leftJoin(images, eq(images.productId, products.id))
        .where(eq(products.id, id))
        .groupBy(
          products.id,
          categories.id,
          products.name,
          products.categoryId,
          categories.name,
          products.costPrice,
          products.sellingPrice,
          products.quantity,
          products.isFeatured,
          products.isArchived,
          products.createdAt
        )
        .execute();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      const productWithDetails = {
        ...data,
        sizes: data.sizes as unknown as string[],
        colors: data.colors as unknown as string[],
        images: data.images as unknown as string[],
      };

      return c.json({ data: productWithDetails });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", extendedProductSchema),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "unauthorized" }, 401);
      }

      const [data] = await db
        .insert(products)
        .values({
          id: createId(),
          categoryId: values.categoryId,
          costPrice: values.costPrice,
          sellingPrice: values.sellingPrice,
          quantity: values.quantity,
          pQuantity: values.quantity,
          name: values.name,
          isFeatured: values.isFeatured,
          isArchived: values.isArchived,
        })
        .returning();

      const productId = data.id;

      if (values.sizes && Array.isArray(values.sizes)) {
        for (const sizeId of values.sizes) {
          await db.insert(productSizes).values({ productId, sizeId });
        }
      }

      // Insert colors
      if (values.colors && Array.isArray(values.colors)) {
        for (const colorId of values.colors) {
          await db.insert(productColors).values({ productId, colorId });
        }
      }

      if (values.images && Array.isArray(values.images)) {
        for (const imageUrlObj of values.images) {
          await db.insert(images).values({
            id: createId(),
            productId,
            url: imageUrlObj.url,
          });
        }
      }

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
        .delete(products)
        .where(inArray(products.id, values.ids))
        .returning({
          id: products.id,
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
    zValidator("json", extendedProductSchema),
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

      // Update product details
      const [updatedProduct] = await db
        .update(products)
        .set({
          name: values.name,
          categoryId: values.categoryId,
          costPrice: values.costPrice,
          sellingPrice: values.sellingPrice,
          quantity: values.quantity,
          pQuantity: values.quantity,
          isFeatured: values.isFeatured,
          isArchived: values.isArchived,
        })
        .where(eq(products.id, id))
        .returning();

      if (!updatedProduct) {
        return c.json({ error: "Not found" }, 404);
      }

      // Update sizes
      if (values.sizes && Array.isArray(values.sizes)) {
        // Delete existing sizes
        await db.delete(productSizes).where(eq(productSizes.productId, id));

        // Insert new sizes
        for (const sizeId of values.sizes) {
          await db.insert(productSizes).values({ productId: id, sizeId });
        }
      }

      // Update colors
      if (values.colors && Array.isArray(values.colors)) {
        // Delete existing colors
        await db.delete(productColors).where(eq(productColors.productId, id));

        // Insert new colors
        for (const colorId of values.colors) {
          await db.insert(productColors).values({ productId: id, colorId });
        }
      }

      // Update images
      if (values.images && Array.isArray(values.images)) {
        // Delete existing images
        await db.delete(images).where(eq(images.productId, id));

        // Insert new images
        for (const imageUrlObj of values.images) {
          await db.insert(images).values({
            id: createId(),
            productId: id,
            url: imageUrlObj.url,
          });
        }
      }

      return c.json({ data: updatedProduct });
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
        .delete(products)
        .where(eq(products.id, id))
        .returning({
          id: products.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/products",
    zValidator(
      "json",
      z.object({
        productIds: z.array(z.string()).nonempty(), // Validate an array of strings
      })
    ),
    clerkMiddleware(),
    async (c) => {
      // Get the validated product IDs from the request body
      const { productIds } = c.req.valid("json");

      // Fetch products with the given IDs
      const data = await db
        .select({
          id: products.id,
          name: products.name,
          categoryId: products.categoryId,
          categoryName: categories.name,
          costPrice: products.costPrice,
          sellingPrice: products.sellingPrice,
          quantity: products.quantity,
          isFeatured: products.isFeatured,
          isArchived: products.isArchived,
          createdAt: products.createdAt,
          sizes: sql<string[]>`array_agg(distinct ${sizes.value})`,
          colors: sql<string[]>`array_agg(distinct ${colors.value})`,
          images: sql<string[]>`array_agg(distinct ${images.url})`,
        })
        .from(products)
        .leftJoin(categories, eq(categories.id, products.categoryId))
        .leftJoin(productSizes, eq(productSizes.productId, products.id))
        .leftJoin(sizes, eq(sizes.id, productSizes.sizeId))
        .leftJoin(productColors, eq(productColors.productId, products.id))
        .leftJoin(colors, eq(colors.id, productColors.colorId))
        .leftJoin(images, eq(images.productId, products.id))
        .where(inArray(products.id, productIds))
        .groupBy(
          products.id,
          categories.id,
          products.name,
          products.quantity,
          products.categoryId,
          categories.name,
          products.costPrice,
          products.sellingPrice,
          products.isFeatured,
          products.isArchived,
          products.createdAt
        )
        .execute();

      // Map the results to include typed sizes, colors, and images
      const productsWithDetails = data.map((product) => ({
        ...product,
        sizes: product.sizes as unknown as string[],
        colors: product.colors as unknown as string[],
        images: product.images as unknown as string[],
      }));

      return c.json({ data: productsWithDetails });
    }
  );

export default app;
