import { Router } from "express";
import { requireRole } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  getAuditLogs,
  getAuditLogById,
} from "../../controllers/admin/auditLogs.controller.js";
import { auditLogIdSchema } from "../../validators/auditLogs.validator.js";

const router = Router();

router.get("/", requireRole(["superadmin"]), getAuditLogs);
router.get(
  "/:id",
  requireRole(["superadmin"]),
  validate(auditLogIdSchema, "params"),
  getAuditLogById
);

export default router;
