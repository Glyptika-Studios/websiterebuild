import { Router } from "express";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  getAuditLogs,
  getAuditLogById,
} from "../../controllers/admin/auditLogs.controller.js";

const router = Router();

router.get("/", requireRole(["superadmin"]), getAuditLogs);
router.get("/:id", requireRole(["superadmin"]), getAuditLogById);

export default router;
