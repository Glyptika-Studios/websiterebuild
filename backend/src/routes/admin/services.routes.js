import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices,
} from "../../controllers/admin/services.controller.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createServiceSchema,
  updateServiceSchema,
  reorderServicesSchema,
  serviceIdSchema,
} from "../../validators/services.validator.js";

const router = Router();

// GET /api/v1/admin/services
router.get(
  "/",
  requireRole(["superadmin", "editor", "viewer"]),
  getServices
);

// POST /api/v1/admin/services
router.post(
  "/",
  requireRole(["superadmin", "editor"]),
  validate(createServiceSchema),
  createService
);

// PATCH /api/v1/admin/services/reorder
// Must be defined BEFORE /:id to avoid Express matching
// "reorder" as an :id param
router.patch(
  "/reorder",
  requireRole(["superadmin", "editor"]),
  validate(reorderServicesSchema),
  reorderServices
);

// GET /api/v1/admin/services/:id
router.get(
  "/:id",
  requireRole(["superadmin", "editor", "viewer"]),
  validate(serviceIdSchema, "params"),
  getServiceById
);

// PUT /api/v1/admin/services/:id
router.put(
  "/:id",
  requireRole(["superadmin", "editor"]),
  validate(serviceIdSchema, "params"),
  validate(updateServiceSchema),
  updateService
);

// DELETE /api/v1/admin/services/:id
router.delete(
  "/:id",
  requireRole(["superadmin", "editor"]),
  validate(serviceIdSchema, "params"),
  deleteService
);

export default router;
