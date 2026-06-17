import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  addProjectMediaSchema,
  createProjectSchema,
  projectIdParamsSchema,
  projectMediaParamsSchema,
  projectStatusSchema,
  reorderProjectMediaSchema,
  updateProjectSchema,
} from "../../validators/projects.validator.js";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
  addProjectMedia,
  deleteProjectMedia,
  reorderProjectMedia,
} from "../../controllers/admin/projects.controller.js";

const router = Router();

router
  .route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getProjects)
  .post(requireRole(["superadmin", "editor"]), validate(createProjectSchema), createProject);

router
  .patch(
    "/:id/status",
    requireRole(["superadmin", "editor"]),
    validate(projectIdParamsSchema, "params"),
    validate(projectStatusSchema),
    updateProjectStatus
  )
  .post(
    "/:id/media",
    requireRole(["superadmin", "editor"]),
    validate(projectIdParamsSchema, "params"),
    validate(addProjectMediaSchema),
    addProjectMedia
  )
  .delete(
    "/:id/media/:emid",
    requireRole(["superadmin", "editor"]),
    validate(projectMediaParamsSchema, "params"),
    deleteProjectMedia
  )
  .patch(
    "/:id/media/reorder",
    requireRole(["superadmin", "editor"]),
    validate(projectIdParamsSchema, "params"),
    validate(reorderProjectMediaSchema),
    reorderProjectMedia
  );

router
  .route("/:id")
  .get(
    requireRole(["superadmin", "editor", "viewer"]),
    validate(projectIdParamsSchema, "params"),
    getProjectById
  )
  .put(
    requireRole(["superadmin", "editor"]),
    validate(projectIdParamsSchema, "params"),
    validate(updateProjectSchema),
    updateProject
  )
  .delete(
    requireRole(["superadmin", "editor"]),
    validate(projectIdParamsSchema, "params"),
    deleteProject
  );

export default router;