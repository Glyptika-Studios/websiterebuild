import { z } from "zod";

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(1).max(200),
  position_id: z.string().uuid().nullish(),
  bio: z.string().max(2000).optional(),
  photo_id: z.string().uuid().nullish(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  display_order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const updateTeamMemberSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    position_id: z.string().uuid().nullish(),
    bio: z.string().max(2000).optional(),
    photo_id: z.string().uuid().nullish(),
    linkedin_url: z.string().url().optional().or(z.literal("")),
    display_order: z.number().int().min(0).optional(),
    active: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });

export const reorderTeamSchema = z.object({
  order: z
    .array(
      z.object({
        id: z.string().uuid(),
        display_order: z.number().int().min(0),
      })
    )
    .min(1, { message: "Provide at least one item to reorder" }),
});