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
