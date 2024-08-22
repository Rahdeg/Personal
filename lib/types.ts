import { insertOrderSchema, insertProductSchema } from "@/db/schema";

import { z } from "zod";

export const additionalFieldsSchema = z.object({
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  images: z.object({ url: z.string() }).array().nonempty("image is required"),
});

export const extendedProductSchema = insertProductSchema
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

export const extendedOrderSchema = insertOrderSchema
  .omit({
    id: true,
  })
  .merge(additionalFieldsSchema);

export interface OrderItem {
  productId: string;
  productName: string;
  size: string | null;
  color: string | null;
  quantity: number;
  amount: number;
  isReviewed: boolean;
  image: string;
}

export interface OrderResponse {
  id: string;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Canceled"
    | null;
  trackingNumber: string | null;
  userId: string;
  totalAmount: number | null;
  createdAt: string | null;
  orderItems: OrderItem[];
}

export interface MappedOrderItem extends OrderItem {
  orderId: string;
  createdAt: string | null;
  status: string | null;
  totalAmount: number | null;
  trackingNumber: string | null;
  userId: string;
}
