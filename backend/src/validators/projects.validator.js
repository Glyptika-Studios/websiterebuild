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

export const projectStatusSchema = z.object({
  status: z.enum(["ongoing", "completed", "archived"]),
});

export const createProjectSchema = z.object({
  title: titleSchema,
  description: z.string().trim().optional().nullable(),
  category_id: z.string().uuid().nullish(),
  cover_id: z.string().uuid().nullish(),
  featured: z.boolean().optional().default(false),
  status: z.enum(["ongoing", "completed", "archived"]).default("ongoing"),
  published_at: z.string().optional().nullable(),
});

export const updateProjectSchema = z
  .object({
    title: titleSchema.optional(),
    description: z.string().trim().optional().nullable(),
    category_id: z.string().uuid().nullish(),
    cover_id: z.string().uuid().nullish(),
    featured: z.boolean().optional(),
    status: z.enum(["ongoing", "completed", "archived"]).optional(),
    published_at: z.string().optional().nullable(),
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


export const projectIdParamsSchema = z.object({
  id: z.string().uuid("Invalid project id"),
});

export const projectMediaParamsSchema = z.object({
  id: z.string().uuid("Invalid project id"),
  emid: z.string().uuid("Invalid project media id"),
});
