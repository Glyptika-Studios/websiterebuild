import { Router } from "express";
import {
  getPages,
  getPageByKey,
  updatePage,
  getPageHistory,
} from "../../controllers/admin/pageContent.controller.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { updatePageSchema } from "../../validators/admin/pageContent.validator.js";

const router = Router();

// GET /api/v1/admin/pages
// All roles can list pages
router.get(
  "/",
  requireRole(["superadmin", "editor", "viewer"]),
  getPages
);

// GET /api/v1/admin/pages/:key
// All roles can read page content + history
router.get(
  "/:key",
  requireRole(["superadmin", "editor", "viewer"]),
  getPageByKey
);

// PUT /api/v1/admin/pages/:key
// Only editor and superadmin can update
router.put(
  "/:key",
  requireRole(["superadmin", "editor"]),
  validate(updatePageSchema),
  updatePage
);

// GET /api/v1/admin/pages/:key/history
// All roles can view version history
router.get(
  "/:key/history",
  requireRole(["superadmin", "editor", "viewer"]),
  getPageHistory
);

export default router;