import { z } from "zod";

export const auditLogIdSchema = z.object({
  id: z.string().uuid(),
});