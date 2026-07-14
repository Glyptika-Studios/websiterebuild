import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import { createPostSchema, updatePostSchema } from "../../validators/posts.validator.js";
import {
  getAdminPosts,
  getAdminPostById,
  createAdminPost,
  updateAdminPost,
  deleteAdminPost,
} from "../../controllers/admin/posts.controller.js";

const router = Router();

router.route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getAdminPosts)
  .post(requireRole(["superadmin", "editor"]), validate(createPostSchema), createAdminPost);

router.route("/:id")
  .get(requireRole(["superadmin", "editor", "viewer"]), getAdminPostById)
  .patch(requireRole(["superadmin", "editor"]), validate(updatePostSchema), updateAdminPost)
  .delete(requireRole(["superadmin", "editor"]), deleteAdminPost);

export default router;
