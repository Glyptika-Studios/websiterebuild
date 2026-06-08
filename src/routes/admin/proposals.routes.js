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
router.use(requireRole(["superadmin", "editor", "viewer"]));

router.route("/")
  .get(getAdminProposals);

router.route("/:id")
  .get(getAdminProposalById)
  .patch(validate(updateProposalSchema), updateAdminProposal)
  .delete(deleteAdminProposal);

export default router;
