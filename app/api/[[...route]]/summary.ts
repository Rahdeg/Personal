import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { subDays, parse, differenceInDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {
  categories,
  expensis,
  orderItems,
  orders,
  products,
} from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

const app = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { from, to } = c.req.valid("query");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // const defaultTo = new Date();
    // const defaultFrom = subDays(defaultTo, 30);

    // const startDate = from
    //   ? parse(from, "yyyy-MM-dd", new Date())
    //   : defaultFrom;
    // const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    // const periodLength = differenceInDays(endDate, startDate) + 1;
    // const lastPeriodStart = subDays(startDate, periodLength);
    // const lastPeriodEnd = subDays(endDate, periodLength);

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    // Fetch total revenue
    const totalRevenueQuery = await db
      .select({
        total:
          sql`SUM(${products.sellingPrice} * ${orderItems.quantity})`.mapWith(
            Number
          ),
      })
      .from(orderItems as any)
      .leftJoin(orders as any, eq(orderItems.orderId, orders.id))
      .leftJoin(products as any, eq(orderItems.productId, products.id))
      .where(
        and(
          eq(orders.isPaid, true),
          gte(orders.createdAt, startDate),
          lte(orders.createdAt, endDate)
        )
      );
    const totalRevenue = totalRevenueQuery[0]?.total || 0;

    // Fetch sold products
    const soldProducts = await db
      .select()
      .from(orderItems as any)
      .leftJoin(orders as any, eq(orderItems.id, orders.id))
      .where(
        and(
          eq(orders.isPaid, true),
          gte(orders.createdAt, startDate),
          lte(orders.createdAt, endDate)
        )
      );

    // Fetch total order counts
    const totalOrderCountsQuery = await db
      .select({
        count: sql`COUNT(*)`.mapWith(Number),
      })
      .from(orders as any)
      .where(
        and(gte(orders.createdAt, startDate), lte(orders.createdAt, endDate))
      );
    const totalOrderCounts = totalOrderCountsQuery[0]?.count || 0;

    // Fetch total products counts
    const totalProductsCountsQuery = await db
      .select({
        count: sql`COUNT(*)`.mapWith(Number),
      })
      .from(products as any);
    const totalProductsCounts = totalProductsCountsQuery[0]?.count || 0;

    // Fetch total products with quantity counts

    const totalProductsQuantityCountsQuery = await db
      .select({
        total: sql`SUM(${products.quantity})`.mapWith(Number),
      })
      .from(products as any);
    const totalProductsQuantityCounts =
      totalProductsQuantityCountsQuery[0]?.total || 0;

    // Fetch top selling products
    const topSelling: any = await db
      .select({
        productId: orderItems.productId,
        totalQuantity: sql`SUM(${orderItems.quantity})`.mapWith(Number),
      })
      .from(orderItems as any)
      .leftJoin(orders as any, eq(orderItems.orderId, orders.id))
      .leftJoin(products as any, eq(orderItems.productId, products.id))
      .where(
        and(
          eq(orders.isPaid, true),
          gte(orders.createdAt, startDate),
          lte(orders.createdAt, endDate)
        )
      )
      .groupBy(orderItems.productId)
      .orderBy(desc(sql`SUM(${products.quantity})`))
      .limit(3);

    // Fetch total expenses
    const totalProductsCostQuery = await db
      .select({
        total: sql`SUM(${products.costPrice} * ${products.pQuantity} )`.mapWith(
          Number
        ),
      })
      .from(products as any)
      .where(
        and(
          gte(products.createdAt, startDate),
          lte(products.createdAt, endDate)
        )
      );

    const totalProductCost = totalProductsCostQuery[0].total || 0;

    // Fetch total expenses
    const totalExpensesQuery = await db
      .select({
        total: sql`SUM(${expensis.amount})`.mapWith(Number),
      })
      .from(expensis as any)
      .where(
        and(
          gte(expensis.createdAt, startDate),
          lte(expensis.createdAt, endDate)
        )
      );
    const totalExpenses = totalExpensesQuery[0]?.total + totalProductCost;

    // Calculate net profit
    const netProfit = totalRevenue - totalExpenses;

    // Fetch Pie Data for each category
    const pieData: any = await db
      .select({
        name: categories.name,
        value:
          sql`SUM(${products.quantity} * ${products.sellingPrice})`.mapWith(
            Number
          ),
      })
      .from(products as any)
      .leftJoin(categories as any, eq(products.categoryId, categories.id))
      .where(
        and(
          gte(products.createdAt, startDate),
          lte(products.createdAt, endDate)
        )
      )
      .groupBy(categories.id);

    // Construct the summary response
    const summary = {
      totalRevenue,
      soldProducts,
      totalOrderCounts,
      totalProductsCounts,
      topSelling,
      totalProductCost,
      totalExpenses,
      netProfit,
      pieData,
      totalProductsQuantityCounts,
    };

    return c.json({ data: summary });
  }
);

export default app;
