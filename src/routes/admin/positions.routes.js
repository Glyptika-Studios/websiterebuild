import { Router } from "express";
import {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  getPositionItems,
  createPositionItem,
  updatePositionItem,
  deletePositionItem,
  reorderPositionItems,
} from "../../controllers/admin/positions.controller.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createPositionSchema,
  updatePositionSchema,
  createPositionItemSchema,
  updatePositionItemSchema,
  reorderPositionItemsSchema,
} from "../../validators/positions.validator.js";

const router = Router();

// ── Position routes ───────────────────────────────────────────

// GET /api/v1/admin/positions
router.get(
  "/",
  requireRole(["superadmin", "editor", "viewer"]),
  getPositions
);

// GET /api/v1/admin/positions/:id
router.get(
  "/:id",
  requireRole(["superadmin", "editor", "viewer"]),
  getPositionById
);

// POST /api/v1/admin/positions
router.post(
  "/",
  requireRole(["superadmin", "editor"]),
  validate(createPositionSchema),
  createPosition
);

// PUT /api/v1/admin/positions/:id
router.put(
  "/:id",
  requireRole(["superadmin", "editor"]),
  validate(updatePositionSchema),
  updatePosition
);

// DELETE /api/v1/admin/positions/:id
// Cascades — deletes all position_items for this position
router.delete(
  "/:id",
  requireRole(["superadmin", "editor"]),
  deletePosition
);

// ── Position items routes (nested under /:id) ─────────────────

// GET /api/v1/admin/positions/:id/items
router.get(
  "/:id/items",
  requireRole(["superadmin", "editor", "viewer"]),
  getPositionItems
);

// POST /api/v1/admin/positions/:id/items
router.post(
  "/:id/items",
  requireRole(["superadmin", "editor"]),
  validate(createPositionItemSchema),
  createPositionItem
);

// PUT /api/v1/admin/positions/:id/items/:iid
router.put(
  "/:id/items/:iid",
  requireRole(["superadmin", "editor"]),
  validate(updatePositionItemSchema),
  updatePositionItem
);

// DELETE /api/v1/admin/positions/:id/items/:iid
router.delete(
  "/:id/items/:iid",
  requireRole(["superadmin", "editor"]),
  deletePositionItem
);

// PATCH /api/v1/admin/positions/:id/items/reorder
// Must be defined BEFORE /:id/items/:iid so Express does not
// treat "reorder" as an :iid parameter
router.patch(
  "/:id/items/reorder",
  requireRole(["superadmin", "editor"]),
  validate(reorderPositionItemsSchema),
  reorderPositionItems
);

export default router;
