import { z } from "zod";

export const createPostSchema = z
  .object({
    type: z.enum(["blog", "linkedin"]),
    title: z.string().min(1).max(300),
    slug: z.string().min(1).max(300).optional(),
    excerpt: z.string().max(500).optional(),
    content: z.string().optional(),
    category_id: z.string().uuid().nullish(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    image_id: z.string().uuid().nullish(),
    linkedin_url: z.string().url().startsWith("https://").optional(),
    published_at: z.string().date().optional(),
  })
  .refine((d) => d.type !== "blog" || (d.content && d.content.length > 0), {
    message: "Blog posts require content",
    path: ["content"],
  })
  .refine(
    (d) =>
      d.type !== "linkedin" ||
      (d.linkedin_url && d.linkedin_url.length > 0),
    { message: "LinkedIn posts require linkedin_url", path: ["linkedin_url"] }
  );

export const updatePostSchema = z
  .object({
    title: z.string().min(1).max(300).optional(),
    slug: z.string().min(1).max(300).optional(),
    excerpt: z.string().max(500).optional(),
    content: z.string().optional(),
    category_id: z.string().uuid().nullish(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    image_id: z.string().uuid().nullish(),
    linkedin_url: z.string().url().startsWith("https://").optional(),
    published_at: z.string().date().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });
