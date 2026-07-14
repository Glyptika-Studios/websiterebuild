import { z } from "zod";

export const upsertSocialLinkSchema = z.object({
  url: z
    .string()
    .startsWith("https://", { message: "URL must start with https://" })
    .max(500),
});
