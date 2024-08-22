import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";

export const statusEnum = pgEnum("status", [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Canceled",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  username: text("username").notNull(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Category table
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// Size table
export const sizes = pgTable("sizes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sizeRelations = relations(sizes, ({ many }) => ({
  productSizes: many(productSizes),
}));

// Color table
export const colors = pgTable("colors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const expensis = pgTable("expensis", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const admin = pgTable("admin", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("isAdmin").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const colorRelations = relations(colors, ({ many }) => ({
  productColors: many(productColors),
}));

// Product table
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  sellingPrice: integer("selling_price").notNull(),
  costPrice: integer("cost_price").notNull(),
  quantity: integer("quantity").notNull(),
  pQuantity: integer("pQuantity").default(1).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  sizes: many(productSizes),
  colors: many(productColors),
  images: many(images),
  orderItems: many(orderItems),
  reviews: many(reviews), // Add relation to reviews
}));

// Product Sizes table for many-to-many relationship
export const productSizes = pgTable("product_sizes", {
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sizeId: text("size_id")
    .notNull()
    .references(() => sizes.id, { onDelete: "cascade" }),
});

export const productSizeRelations = relations(productSizes, ({ one }) => ({
  product: one(products, {
    fields: [productSizes.productId],
    references: [products.id],
  }),
  size: one(sizes, {
    fields: [productSizes.sizeId],
    references: [sizes.id],
  }),
}));

// Product Colors table for many-to-many relationship
export const productColors = pgTable("product_colors", {
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  colorId: text("color_id")
    .notNull()
    .references(() => colors.id, { onDelete: "cascade" }),
});

export const productColorRelations = relations(productColors, ({ one }) => ({
  product: one(products, {
    fields: [productColors.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productColors.colorId],
    references: [colors.id],
  }),
}));

// Image table
export const images = pgTable("images", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const imageRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}));

// Order table
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  isPaid: boolean("is_paid").default(false),
  userId: text("user_id").notNull(),
  phone: text("phone").default(""),
  totalAmount: integer("total_amount").default(0),
  address: text("address").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: statusEnum("status").default("Pending"),
  trackingNumber: text("tracking_number"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
});

export const orderRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

// OrderItem table
export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  color: text("color").default(""),
  size: text("size").default(""),
  quantity: integer("quantity").default(1),
  amount: integer("amount").default(0),
  isReviewed: boolean("isReviewed").default(false),
});

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // Enforce rating range in application logic
  comment: text("comment").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

// Schemas
export const insertCategorySchema = createInsertSchema(categories);
export const insertSizeSchema = createInsertSchema(sizes);
export const insertColorSchema = createInsertSchema(colors);
export const insertExpensisSchema = createInsertSchema(expensis);
export const insertAdminSchema = createInsertSchema(admin);
export const insertProductSchema = createInsertSchema(products);
export const insertImageSchema = createInsertSchema(images);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertProductSizeSchema = createInsertSchema(productSizes);
export const insertProductColorSchema = createInsertSchema(productColors);
