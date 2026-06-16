import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  createTagSchema,
  updateTagSchema,
  tagIdSchema,
} from "../../validators/tags.validator.js";
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../../controllers/admin/tags.controller.js";

const router = Router();

router.route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getTags)
  .post(requireRole(["superadmin", "editor"]), validate(createTagSchema), createTag);

router.route("/:id")
  .get(
    requireRole(["superadmin", "editor", "viewer"]),
    validate(tagIdSchema, "params"),
    getTagById
  )
  .put(
    requireRole(["superadmin", "editor"]),
    validate(tagIdSchema, "params"),
    validate(updateTagSchema),
    updateTag
  )
  .delete(
    requireRole(["superadmin", "editor"]),
    validate(tagIdSchema, "params"),
    deleteTag
  );

export default router;
