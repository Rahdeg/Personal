import { Hono } from "hono";
import { handle } from "hono/vercel";
import categories from "./categories";
import sizes from "./sizes";
import colors from "./colors";
import products from "./products";
import orders from "./orders";
import checkout from "./checkout";
import webhooks from "./webhooks";
import expensis from "./expensis";
import admin from "./admin";
import summary from "./summary";
import review from "./review";
import users from "./users";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  // .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/sizes", sizes)
  .route("/colors", colors)
  .route("/products", products)
  .route("/orders", orders)
  .route("/checkout", checkout)
  .route("/webhooks", webhooks)
  .route("/expensis", expensis)
  .route("/admin", admin)
  .route("/summary", summary)
  .route("/review", review)
  .route("/users", users);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
