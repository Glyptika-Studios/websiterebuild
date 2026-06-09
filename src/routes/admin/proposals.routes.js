import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import { updateProposalSchema } from "../../validators/proposals.validator.js";
import {
  getAdminProposals,
  getAdminProposalById,
  updateAdminProposal,
  deleteAdminProposal,
} from "../../controllers/admin/proposals.controller.js";

const router = Router();

router.route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getAdminProposals);

router.route("/:id")
  .get(requireRole(["superadmin", "editor", "viewer"]), getAdminProposalById)
  .patch(requireRole(["superadmin", "editor"]), validate(updateProposalSchema), updateAdminProposal)
  .delete(requireRole(["superadmin", "editor"]), deleteAdminProposal);

export default router;
