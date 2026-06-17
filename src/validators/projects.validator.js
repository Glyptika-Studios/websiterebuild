import { z } from "zod";

const titleSchema = z.string().trim().min(1).max(200);
const displayOrderSchema = z.number().int().min(0);
const jsonSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.unknown()),
  z.record(z.unknown()),
]);

export const projectStatusSchema = z
  .object({
    active: z.boolean().optional(),
    publish: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide active or publish status",
  });

export const createProjectSchema = z.object({
  title: titleSchema,
  category_id: z.string().uuid().nullish(),
  display_order: displayOrderSchema.default(0),
  active: z.boolean().default(true),
  publish: z.boolean().default(false),
});

export const updateProjectSchema = z
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

export const addProjectMediaSchema = z
  .object({
    media_file_id: z.string().uuid(),
    display_order: displayOrderSchema.default(0),
    alt_text: z.string().trim().max(500).optional().nullable(),
    caption: z.string().trim().max(1000).optional().nullable(),
    metadata: z.record(z.unknown()).optional().nullable(),
  })
  .catchall(jsonSchema);

export const reorderProjectMediaSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        display_order: displayOrderSchema,
      })
    )
    .min(1),
});
import { z } from "zod";

export const projectIdParamsSchema = z.object({
  id: z.string().uuid("Invalid project id"),
});

export const projectMediaParamsSchema = z.object({
  id: z.string().uuid("Invalid project id"),
  emid: z.string().uuid("Invalid project media id"),
});
