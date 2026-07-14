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

export const productStatusSchema = z.object({
  status: z.enum(["draft", "published", "archived"]),
});

export const createProductSchema = z.object({
  title: titleSchema,
  overview: z.string().trim().max(500).optional().nullable(),
  description: z.string().trim().optional().nullable(),
  category_id: z.string().uuid().nullish(),
  cover_id: z.string().uuid().nullish(),
  featured: z.boolean().optional().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const updateProductSchema = z
  .object({
    title: titleSchema.optional(),
    overview: z.string().trim().max(500).optional().nullable(),
    description: z.string().trim().optional().nullable(),
    category_id: z.string().uuid().nullish(),
    cover_id: z.string().uuid().nullish(),
    featured: z.boolean().optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
    published_at: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });

export const createProductModuleSchema = z
  .object({
    title: titleSchema,
    description: z.string().trim().max(5000).optional().nullable(),
    display_order: displayOrderSchema.default(0),
    active: z.boolean().default(true),
    publish: z.boolean().optional(),
    metadata: z.record(z.unknown()).optional().nullable(),
  })
  .catchall(jsonSchema);

export const updateProductModuleSchema = z
  .object({
    title: titleSchema.optional(),
    description: z.string().trim().max(5000).optional().nullable(),
    display_order: displayOrderSchema.optional(),
    active: z.boolean().optional(),
    publish: z.boolean().optional(),
    metadata: z.record(z.unknown()).optional().nullable(),
  })
  .catchall(jsonSchema)
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });

export const reorderProductModulesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        display_order: displayOrderSchema,
      })
    )
    .min(1),
});

export const addProductMediaSchema = z
  .object({
    media_file_id: z.string().uuid(),
    display_order: displayOrderSchema.default(0),
    alt_text: z.string().trim().max(500).optional().nullable(),
    caption: z.string().trim().max(1000).optional().nullable(),
    metadata: z.record(z.unknown()).optional().nullable(),
  })
  .catchall(jsonSchema);

export const reorderProductMediaSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        display_order: displayOrderSchema,
      })
    )
    .min(1),
});

export const upsertModulePricingSchema = z
  .object({
    price: z.number().min(0).optional(),
    currency: z.string().trim().min(1).max(10).optional(),
    label: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(5000).optional().nullable(),
    features: z.array(z.unknown()).optional(),
    active: z.boolean().optional(),
    metadata: z.record(z.unknown()).optional().nullable(),
  })
  .catchall(jsonSchema)
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one pricing field",
  });
export const productIdParamsSchema = z.object({
  id: z.string().uuid("Invalid product id"),
});

export const productMediaParamsSchema = z.object({
  id: z.string().uuid("Invalid product id"),
  emid: z.string().uuid("Invalid product media id"),
});

export const productModuleParamsSchema = z.object({
  id: z.string().uuid("Invalid product id"),
  mid: z.string().uuid("Invalid product module id"),
});

export const modulePricingParamsSchema = z.object({
  mid: z.string().uuid("Invalid module id"),
  tier: z.enum(["basic", "standard", "premium"]),
});