import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  reorderTeamSchema,
} from "../../validators/team.validator.js";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
} from "../../controllers/admin/team.controller.js";

const router = Router();

router
  .route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getTeamMembers)
  .post(requireRole(["superadmin", "editor"]), validate(createTeamMemberSchema), createTeamMember);

router
  .route("/reorder")
  .patch(requireRole(["superadmin", "editor"]), validate(reorderTeamSchema), reorderTeamMembers);

router
  .route("/:id")
  .put(requireRole(["superadmin", "editor"]), validate(updateTeamMemberSchema), updateTeamMember)
  .delete(requireRole(["superadmin", "editor"]), deleteTeamMember);

export default router;