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
} from "../../validators/services.validator.js";

const router = Router();

// GET /api/v1/admin/services
router.get(
  "/",
  requireRole(["superadmin", "editor", "viewer"]),
  getServices
);

// GET /api/v1/admin/services/:id
router.get(
  "/:id",
  requireRole(["superadmin", "editor", "viewer"]),
  getServiceById
);

// POST /api/v1/admin/services
router.post(
  "/",
  requireRole(["superadmin", "editor"]),
  validate(createServiceSchema),
  createService
);

// PUT /api/v1/admin/services/:id
router.put(
  "/:id",
  requireRole(["superadmin", "editor"]),
  validate(updateServiceSchema),
  updateService
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

// DELETE /api/v1/admin/services/:id
router.delete(
  "/:id",
  requireRole(["superadmin", "editor"]),
  deleteService
);

export default router;
