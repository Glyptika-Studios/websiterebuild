import { z } from "zod";

export const createServiceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters"),

  url: z
    .string()
    .url("Must be a valid URL")
    .startsWith("https://", "URL must start with https://")
    .max(500)
    .optional()
    .nullable(),

  url_type: z
    .enum(["internal", "external"], {
      errorMap: () => ({ message: "url_type must be internal or external" }),
    })
    .optional(),

  active: z.boolean().optional(),

  publish: z.boolean().optional(),

  display_order: z.number().int().min(0).optional(),

  bg_image_id: z.string().uuid("Invalid UUID").optional().nullable(),

  icon_image_id: z.string().uuid("Invalid UUID").optional().nullable(),
});

export const updateServiceSchema = z
  .object({
    title:         z.string().min(1).max(200).optional(),
    url:           z.string().url().startsWith("https://").max(500).optional().nullable(),
    url_type:      z.enum(["internal", "external"]).optional(),
    active:        z.boolean().optional(),
    publish:       z.boolean().optional(),
    display_order: z.number().int().min(0).optional(),
    bg_image_id:   z.string().uuid().optional().nullable(),
    icon_image_id: z.string().uuid().optional().nullable(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
  );

export const reorderServicesSchema = z.object({
  items: z
    .array(
      z.object({
        id:            z.string().uuid("Invalid service UUID"),
        display_order: z.number().int().min(0, "display_order must be >= 0"),
      })
    )
    .min(1, "items must contain at least one entry"),
});
