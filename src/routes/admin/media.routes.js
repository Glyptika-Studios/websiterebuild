import { Router } from "express";
import {
  uploadMedia,
  getMediaList,
  deleteMedia,
} from "../../controllers/admin/media.controller.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import uploadMiddleware from "../../middleware/upload.middleware.js";
import { mediaIdSchema } from "../../validators/media.validator.js";

const router = Router();

// GET /api/v1/admin/media
// All admins can view the media library (superadmin, editor, viewer)
router.get(
  "/",
  requireRole(["superadmin", "editor", "viewer"]),
  getMediaList
);

// POST /api/v1/admin/media/upload
// Only superadmin and editor can upload files
router.post(
  "/upload",
  requireRole(["superadmin", "editor"]),
  uploadMiddleware.single("file"),
  uploadMedia
);

// DELETE /api/v1/admin/media/:id
// Only superadmin and editor can delete files
router.delete(
  "/:id",
  requireRole(["superadmin", "editor"]),
  validate(mediaIdSchema, "params"),
  deleteMedia
);

export default router;
