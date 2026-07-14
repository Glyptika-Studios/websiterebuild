import { Router } from "express";
import { getDashboardStats } from "../../controllers/admin/dashboard.controller.js";
import { requireRole } from "../../middleware/authorize.middleware.js";

const router = Router();

router.get(
  "/",
  requireRole(["superadmin", "editor", "viewer"]),
  getDashboardStats
);

export default router;
