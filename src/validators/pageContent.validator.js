import { z } from "zod";

export const updatePageSchema = z.object({
  content: z
    .record(z.unknown())
    .refine((val) => typeof val === "object" && !Array.isArray(val), {
      message: "content must be a JSON object",
    }),
});
