import { z } from "zod";

export const VALID_SCOPES = ["post", "product", "service", "project"];

const scopeSchema = z.enum(VALID_SCOPES, {
  errorMap: () => ({ message: "scope must be one of: post, product, service, project" }),
});

const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase letters, numbers, and hyphens only",
  });

const labelSchema = z.string().trim().min(1).max(100);
const displayOrderSchema = z.number().int().min(0);

export const categoryIdSchema = z.object({
  id: z.string().uuid(),
});

export const createCategorySchema = z.object({
  label: labelSchema,
  scope: scopeSchema,
  slug: slugSchema,
  display_order: displayOrderSchema.default(0),
  active: z.boolean().default(true),
});

export const updateCategorySchema = z
  .object({
    label: labelSchema.optional(),
    scope: scopeSchema.optional(),
    slug: slugSchema.optional(),
    display_order: displayOrderSchema.optional(),
    active: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });
