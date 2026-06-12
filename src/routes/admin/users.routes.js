import { Router } from "express";
import {
  getAdminUsers,
  getAdminUserById,
  inviteAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getUserPermissions,
  upsertUserPermissions,
  deleteUserPermission,
} from "../../controllers/admin/users.controller.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  inviteAdminUserSchema,
  updateAdminUserSchema,
  upsertPermissionsSchema,
} from "../../validators/admin/users.validator.js";

const router = Router();

// All routes in this file are superadmin only

// ── User routes ───────────────────────────────────────────────

// GET /api/v1/admin/users
router.get(
  "/",
  requireRole(["superadmin"]),
  getAdminUsers
);

// GET /api/v1/admin/users/:id
router.get(
  "/:id",
  requireRole(["superadmin"]),
  getAdminUserById
);

// POST /api/v1/admin/users/invite
// Must be before /:id so Express does not treat "invite" as :id
router.post(
  "/invite",
  requireRole(["superadmin"]),
  validate(inviteAdminUserSchema),
  inviteAdminUser
);

// PUT /api/v1/admin/users/:id
router.put(
  "/:id",
  requireRole(["superadmin"]),
  validate(updateAdminUserSchema),
  updateAdminUser
);

// DELETE /api/v1/admin/users/:id
router.delete(
  "/:id",
  requireRole(["superadmin"]),
  deleteAdminUser
);

// ── Permission routes (nested under /:id) ─────────────────────

// GET /api/v1/admin/users/:id/permissions
router.get(
  "/:id/permissions",
  requireRole(["superadmin"]),
  getUserPermissions
);

// PUT /api/v1/admin/users/:id/permissions
// Bulk upsert — replaces all permissions for this user
router.put(
  "/:id/permissions",
  requireRole(["superadmin"]),
  validate(upsertPermissionsSchema),
  upsertUserPermissions
);

// DELETE /api/v1/admin/users/:id/permissions/:section
router.delete(
  "/:id/permissions/:section",
  requireRole(["superadmin"]),
  deleteUserPermission
);

export default router;