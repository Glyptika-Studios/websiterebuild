import { z } from "zod";

const titleSchema = z.string().trim().min(1).max(200);
const displayOrderSchema = z.number().int().min(0);

export const createProductSchema = z.object({
  title: titleSchema,
  category_id: z.string().uuid().nullish(),
  display_order: displayOrderSchema.default(0),
  active: z.boolean().default(true),
  publish: z.boolean().default(false),
});

export const updateProductSchema = z
  .object({
    title: titleSchema.optional(),
    category_id: z.string().uuid().nullish(),
    display_order: displayOrderSchema.optional(),
    active: z.boolean().optional(),
    publish: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });
