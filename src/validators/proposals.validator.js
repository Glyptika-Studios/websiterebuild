import { z } from "zod";

export const createProposalSchema = z
  .object({
    name: z.string().min(1).max(200),
    email: z.string().email(),
    phone: z.string().max(30).optional(),
    company: z.string().max(200).optional(),

    subject: z.string().max(300).optional(),
    message: z.string().max(5000).optional(),

    budget_type: z.enum(["fixed", "range", "flexible"]).optional(),
    budget_min: z.number().min(0).optional(),
    budget_max: z.number().min(0).optional(),
    budget_label: z.string().max(100).optional(),

    source_product_id: z.string().uuid().optional(),
    source_service_id: z.string().uuid().optional(),
    source_project_id: z.string().uuid().optional(),
    source_channel: z
      .enum(["website", "referral", "email", "linkedin", "other"])
      .optional(),

    service_ids: z.array(z.string().uuid()).default([]),
    product_ids: z.array(z.string().uuid()).default([]),
    project_ids: z.array(z.string().uuid()).default([]),
  })
  .refine(
    (d) =>
      [d.source_product_id, d.source_service_id, d.source_project_id].filter(Boolean)
        .length <= 1,
    {
      message: "Provide at most one source id",
      path: ["source_product_id"],
    }
  )
  .refine(
    (d) =>
      d.budget_min === undefined ||
      d.budget_max === undefined ||
      d.budget_max >= d.budget_min,
    {
      message: "budget_max must be greater than or equal to budget_min",
      path: ["budget_max"],
    }
  );

export const updateProposalSchema = z
  .object({
    status: z
      .enum(["new", "in_review", "accepted", "rejected", "archived"])
      .optional(),
    priority: z.enum(["low", "normal", "high"]).optional(),
    admin_notes: z.string().max(2000).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });
