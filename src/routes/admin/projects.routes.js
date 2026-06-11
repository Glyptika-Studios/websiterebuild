import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../../validators/projects.validator.js";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../../controllers/admin/projects.controller.js";

const router = Router();

router
  .route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getProjects)
  .post(requireRole(["superadmin", "editor"]), validate(createProjectSchema), createProject);

router
  .route("/:id")
  .get(requireRole(["superadmin", "editor", "viewer"]), getProjectById)
  .put(requireRole(["superadmin", "editor"]), validate(updateProjectSchema), updateProject)
  .delete(requireRole(["superadmin", "editor"]), deleteProject);

export default router;
