import { z } from "zod";

const VALID_EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];
const VALID_ITEM_KINDS = ["responsibility", "requirement", "benefit"];

// ── Position validators ───────────────────────────────────────

export const createPositionSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be 200 characters or less"),

    department: z
      .string()
      .min(1, "Department is required")
      .max(100, "Department must be 100 characters or less"),

    location: z
      .string()
      .min(1, "Location is required")
      .max(200, "Location must be 200 characters or less"),

    employment_type: z.enum(VALID_EMPLOYMENT_TYPES, {
      errorMap: () => ({
        message: `employment_type must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`,
      }),
    }),

    description: z
      .string()
      .optional()
      .nullable(),

    active: z.boolean().optional().default(true),
  }),
});

export const updatePositionSchema = z.object({
  body: z
    .object({
      title:           z.string().min(1).max(200).optional(),
      department:      z.string().min(1).max(100).optional(),
      location:        z.string().min(1).max(200).optional(),
      employment_type: z.enum(VALID_EMPLOYMENT_TYPES).optional(),
      description:     z.string().optional().nullable(),
      active:          z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      { message: "At least one field must be provided" }
    ),
});

// ── Position item validators ──────────────────────────────────

export const createPositionItemSchema = z.object({
  body: z.object({
    kind: z.enum(VALID_ITEM_KINDS, {
      errorMap: () => ({
        message: `kind must be one of: ${VALID_ITEM_KINDS.join(", ")}`,
      }),
    }),

    body: z
      .string()
      .min(1, "Body is required")
      .max(500, "Body must be 500 characters or less"),

    display_order: z
      .number()
      .int()
      .min(0, "display_order must be >= 0")
      .optional(),
  }),
});

export const updatePositionItemSchema = z.object({
  body: z
    .object({
      kind: z
        .enum(VALID_ITEM_KINDS, {
          errorMap: () => ({
            message: `kind must be one of: ${VALID_ITEM_KINDS.join(", ")}`,
          }),
        })
        .optional(),

      body: z
        .string()
        .min(1)
        .max(500)
        .optional(),

      display_order: z
        .number()
        .int()
        .min(0)
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      { message: "At least one field must be provided" }
    ),
});

export const reorderPositionItemsSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          id: z.string().uuid("Each item must have a valid UUID"),
          display_order: z
            .number()
            .int()
            .min(0, "display_order must be >= 0"),
        })
      )
      .min(1, "items must contain at least one entry"),
  }),
});