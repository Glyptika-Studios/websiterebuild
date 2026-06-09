import { Router } from "express";
import { uploadMedia } from "../../controllers/admin/media.controller.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import uploadMiddleware from "../../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/upload",
  requireRole(["superadmin", "editor"]),
  uploadMiddleware.single("file"),
  uploadMedia
);

export default router;
