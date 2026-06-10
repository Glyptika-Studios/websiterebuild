import { z } from "zod";

const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase letters, numbers, and hyphens only",
  });

const labelSchema = z.string().trim().min(1).max(100);

export const createTagSchema = z.object({
  slug: slugSchema,
  label: labelSchema,
});

export const updateTagSchema = z
  .object({
    slug: slugSchema.optional(),
    label: labelSchema.optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });
