import { z } from "zod";

export const createPostSchema = z.object({
  type: z.enum(["blog", "linkedin"]).default("blog"),
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(300).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional().nullable(),
  category_id: z.string().uuid().nullish(),
  tags: z.array(z.string().trim().min(1).max(100)).default([]),
  featured: z.boolean().default(false),
  image_id: z.string().uuid().nullish(),
  linkedin_url: z.string().url().startsWith("https://").optional().nullable(),
  published_at: z.string().date().optional(),
});

export const updatePostSchema = z.object({
  type: z.enum(["blog", "linkedin"]).optional(),
  title: z.string().min(1).max(300).optional(),
  slug: z.string().min(1).max(300).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional().nullable(),
  category_id: z.string().uuid().nullish(),
  tags: z.array(z.string().trim().min(1).max(100)).optional(),
  featured: z.boolean().optional(),
  image_id: z.string().uuid().nullish(),
  linkedin_url: z.string().url().startsWith("https://").optional().nullable(),
  published_at: z.string().date().optional(),
});
