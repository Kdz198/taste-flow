import { z } from 'zod'

export const ReceiptItemSchema = z.object({
  idIngredient: z.number(),
  quantity: z.number(),
  _id: z.string(),
});

export const FoodSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number(),
  status: z.boolean(),
  category: z.array(z.string()),
  receipt: z.array(ReceiptItemSchema),
  __v: z.number(),
});

// 👉 TypeScript type từ schema
export type FoodType = z.infer<typeof FoodSchema>;
