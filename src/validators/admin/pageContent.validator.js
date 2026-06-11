import { z } from "zod";

export const updatePageSchema = z.object({
  body: z.object({
    // content must be a valid JSON object — not a string, not an array
    content: z
      .record(z.unknown())
      .refine((val) => typeof val === "object" && !Array.isArray(val), {
        message: "content must be a JSON object",
      }),
  }),
});