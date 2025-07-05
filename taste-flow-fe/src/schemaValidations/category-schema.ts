import { z } from "zod";

export const CategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.boolean(),
  __v: z.number()
});
export type Category = z.infer<typeof CategorySchema>;
export const CategoryListSchema = z.array(CategorySchema);
